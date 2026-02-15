<template>
  <div class="plans-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-title">
          <h1>แผนการใช้จ่ายเงินบำรุงโรงพยาบาล</h1>
          <p>โรงพยาบาลส่งเสริมสุขภาพตำบลหนองปลิง</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-card">
        <!-- Year Selector -->
        <div class="section-header">
          <div class="year-selector-group">
            <label for="yearInput">ประจำปีงบประมาณ พ.ศ.</label>
            <input 
              id="yearInput"
              v-model.number="planYear" 
              type="number" 
              min="2560" 
              max="2700"
              @change="debouncedLoadBudgets"
              class="year-input"
            >
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="toggleAllSubRows" class="btn btn-primary">
              <span>{{ allSubRowsCollapsed ? '▼ แสดง' : '▲ ซ่อน' }}</span>
            </button>
            <button @click="goToPlanRecords" class="btn btn-info">
              <span>📋 ดูบันทึก</span>
            </button>
            <button @click="exportToExcel" class="btn btn-success">
              <span>📊 ส่งออก</span>
            </button>
            <button @click="saveData" class="btn btn-success">
              <span>💾 บันทึก</span>
            </button>
            <button @click="confirmClear" class="btn btn-danger">
              <span>🗑️ ล้าง</span>
            </button>
          </div>
        </div>

        <!-- Budget Table -->
        <BudgetTable 
          :rows="planRows"
          :summary="summary"
          :months="months"
          @update:row="updateRow"
          @update:sub-row="updateSubRow"
          @add:sub-row="addSubRow"
          @delete:sub-row="deleteSubRow"
        />
      </div>
    </main>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">กำลังโหลด...</div>
    </div>

    <!-- Debug Info -->
    <div v-if="!planRows || planRows.length === 0" class="debug-box">
      <p>Debug: planRows = {{ planRows ? planRows.length + ' items' : 'null' }}</p>
      <p>Debug: isLoading = {{ isLoading }}</p>
      <button @click="initializeData()">Retry Load Data</button>
    </div>
  </div>
</template>

<script>
import BudgetTable from '../components/BudgetTable.vue';

export default {
  name: 'AllPlans',
  components: {
    BudgetTable
  },
  data() {
    return {
      planYear: new Date().getFullYear() + 543,
      planRows: [],
      summary: {},
      allSubRowsCollapsed: false,
      isLoading: false,
      loadTimeout: null,
      months: ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'],
      defaultCategories: [
        { id: 1, name: 'ค่ายาและเวชภัณฑ์' },
        { id: 2, name: 'ค่าวัสดุ' },
        { id: 3, name: 'ค่าน้ำ ค่าไฟ ค่าโทรศัพท์' },
        { id: 4, name: 'ค่าเช่า' },
        { id: 5, name: 'ค่าซ่อมแซม' },
        { id: 6, name: 'ค่าจ้างที่ปรึกษา' },
        { id: 7, name: 'ค่าสัตว์และอาหารสัตว์' },
        { id: 8, name: 'ค่าป้ายโฆษณา' },
        { id: 9, name: 'ค่าเดินทาง' },
        { id: 10, name: 'ค่าทำความสะอาด' }
      ]
    };
  },
  mounted() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      await this.loadBudgets();
    },
    debouncedLoadBudgets() {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = setTimeout(() => this.loadBudgets(), 500);
    },
    async loadBudgets() {
      this.isLoading = true;
      try {
        if (window.electronAPI) {
          const result = await window.electronAPI.getBudgets(this.planYear);
          if (result.success && result.data.length > 0) {
            this.planRows = result.data.map(row => ({
              ...row,
              subRowsCollapsed: false,
              subRows: row.subRows || []
            }));
          } else {
            this.initializeEmptyRows();
          }
        } else {
          this.initializeEmptyRows();
        }
        this.calculateSummary();
      } catch (error) {
        console.error('Load budgets error:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        this.isLoading = false;
      }
    },
    initializeEmptyRows() {
      this.planRows = this.defaultCategories.map(cat => ({
        category_id: cat.id,
        category_name: cat.name,
        budget_op: 0,
        budget_fund: 0,
        oct: 0,
        nov: 0,
        dec: 0,
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        total: 0,
        subRowsCollapsed: false,
        subRows: []
      }));
    },
    async saveData() {
      this.isLoading = true;
      try {
        const dataToSave = this.planRows.map(row => ({
          ...row,
          year: this.planYear,
          total: this.calculateRowTotal(row)
        }));
        
        if (window.electronAPI) {
          await window.electronAPI.saveBudgets(dataToSave);
        }
        alert('✓ บันทึกข้อมูลสำเร็จ');
      } catch (error) {
        console.error('Save error:', error);
        alert('✗ เกิดข้อผิดพลาดในการบันทึก');
      } finally {
        this.isLoading = false;
      }
    },
    async exportToExcel() {
      try {
        if (window.electronAPI) {
          const result = await window.electronAPI.exportToExcel(this.planYear, this.planRows);
          if (result.success) {
            alert(`✓ ส่งออก Excel สำเร็จ\nไปที่: ${result.path}`);
          }
        }
      } catch (error) {
        console.error('Export error:', error);
        alert('✗ เกิดข้อผิดพลาดในการส่งออก');
      }
    },
    async confirmClear() {
      if (confirm('คุณแน่ใจหรือว่าต้องการล้างข้อมูลทั้งหมด?\nการกระทำนี้ไม่สามารถเลิกทำได้')) {
        this.isLoading = true;
        try {
          if (window.electronAPI) {
            await window.electronAPI.deleteBudgets(this.planYear);
          }
          this.initializeEmptyRows();
          this.calculateSummary();
          alert('✓ ล้างข้อมูลสำเร็จ');
        } catch (error) {
          console.error('Clear error:', error);
          alert('✗ เกิดข้อผิดพลาดในการล้าง');
        } finally {
          this.isLoading = false;
        }
      }
    },
    toggleAllSubRows() {
      this.allSubRowsCollapsed = !this.allSubRowsCollapsed;
      this.planRows.forEach(row => {
        row.subRowsCollapsed = this.allSubRowsCollapsed;
      });
    },
    goToPlanRecords() {
      this.$router.push('/plan-records');
    },
    updateRow(index, updatedRow) {
      this.planRows[index] = updatedRow;
      this.calculateSummary();
    },
    updateSubRow(rowIndex, subIndex, updatedSubRow) {
      if (this.planRows[rowIndex].subRows) {
        this.planRows[rowIndex].subRows[subIndex] = updatedSubRow;
      }
      this.calculateSummary();
    },
    addSubRow(rowIndex) {
      if (!this.planRows[rowIndex].subRows) {
        this.planRows[rowIndex].subRows = [];
      }
      this.planRows[rowIndex].subRows.push({
        name: 'รายการใหม่',
        budget_op: 0,
        budget_fund: 0,
        oct: 0,
        nov: 0,
        dec: 0,
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        total: 0
      });
    },
    deleteSubRow(rowIndex, subIndex) {
      if (this.planRows[rowIndex].subRows) {
        this.planRows[rowIndex].subRows.splice(subIndex, 1);
      }
      this.calculateSummary();
    },
    calculateRowTotal(row) {
      let total = 0;
      this.months.forEach(month => {
        total += parseFloat(row[month]) || 0;
      });
      return total;
    },
    calculateSummary() {
      this.summary = {
        budget_op: 0,
        budget_fund: 0,
        oct: 0,
        nov: 0,
        dec: 0,
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        total: 0
      };

      this.planRows.forEach(row => {
        this.summary.budget_op += parseFloat(row.budget_op) || 0;
        this.summary.budget_fund += parseFloat(row.budget_fund) || 0;
        this.months.forEach(month => {
          this.summary[month] += parseFloat(row[month]) || 0;
        });
        this.summary.total += this.calculateRowTotal(row);
      });
    }
  }
};
</script>

<style scoped>
.plans-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-title h1 {
  font-size: 2em;
  margin-bottom: 10px;
  font-weight: 700;
}

.header-title p {
  font-size: 1.1em;
  opacity: 0.9;
}

.main-content {
  max-width: 1600px;
  margin: 0 auto;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.year-selector-group {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(102, 126, 234, 0.05);
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.year-selector-group label {
  font-weight: 600;
  color: #667eea;
}

.year-input {
  width: 80px;
  padding: 8px 12px;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
  color: #667eea;
}

.year-input:focus {
  outline: none;
  border-color: #764ba2;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95em;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
}

.btn-info:hover {
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 30px 60px;
  border-radius: 16px;
  font-weight: bold;
  color: #667eea;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.debug-box {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 10px;
  font-family: monospace;
  z-index: 9999;
}

.debug-box button {
  background: white;
  color: red;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
