<template>
  <div class="budget-table-wrapper">
    <div class="table-container">
      <table class="budget-table">
        <!-- Header -->
        <thead>
          <tr class="header-row">
            <th class="col-category">หมวดค่าใช้จ่าย</th>
            <th class="col-number">ประมาณการปกติ</th>
            <th class="col-number">เงินอุดหนุน</th>
            <th v-for="month in months" :key="month" class="col-month">
              {{ getMonthName(month) }}
            </th>
            <th class="col-total">รวม</th>
            <th class="col-actions">จัดการ</th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <!-- Data Rows -->
          <tr v-for="(row, idx) in rows" :key="`row-${idx}`" class="data-row">
            <td class="col-category">
              <input 
                v-model="row.category_name" 
                class="input-text"
                @change="updateRowData(idx, row)"
              >
            </td>
            <td class="col-number">
              <input 
                v-model.number="row.budget_op" 
                type="number"
                class="input-number"
                @change="updateRowData(idx, row)"
              >
            </td>
            <td class="col-number">
              <input 
                v-model.number="row.budget_fund" 
                type="number"
                class="input-number"
                @change="updateRowData(idx, row)"
              >
            </td>
            <td v-for="month in months" :key="`${idx}-${month}`" class="col-month">
              <input 
                v-model.number="row[month]" 
                type="number"
                class="input-number"
                @change="updateRowData(idx, row)"
              >
            </td>
            <td class="col-total">{{ formatNumber(calculateRowTotal(row)) }}</td>
            <td class="col-actions">
              <button @click="toggleSubRows(idx)" class="btn-sm btn-expand">
                {{ row.subRowsCollapsed ? '▶' : '▼' }}
              </button>
            </td>
          </tr>

          <!-- Sub Rows -->
          <template v-for="(row, idx) in rows" :key="`subrows-${idx}`">
            <tr v-if="row.subRows && row.subRows.length > 0 && !row.subRowsCollapsed" class="sub-header-row">
              <td colspan="100%" class="sub-header">
                <span>รายการย่อยของ {{ row.category_name }}</span>
                <button @click="addSubRow(idx)" class="btn-sm btn-add">+ เพิ่ม</button>
              </td>
            </tr>

            <tr v-for="(subRow, subIdx) in row.subRows" 
              v-if="!row.subRowsCollapsed"
              :key="`subrow-${idx}-${subIdx}`" 
              class="sub-data-row">
              <td class="col-category sub-item">
                <input 
                  v-model="subRow.name" 
                  class="input-text"
                  placeholder="ชื่อรายการ"
                  @change="updateSubRowData(idx, subIdx, subRow)"
                >
              </td>
              <td class="col-number">
                <input 
                  v-model.number="subRow.budget_op" 
                  type="number"
                  class="input-number"
                  @change="updateSubRowData(idx, subIdx, subRow)"
                >
              </td>
              <td class="col-number">
                <input 
                  v-model.number="subRow.budget_fund" 
                  type="number"
                  class="input-number"
                  @change="updateSubRowData(idx, subIdx, subRow)"
                >
              </td>
              <td v-for="month in months" :key="`${idx}-${subIdx}-${month}`" class="col-month">
                <input 
                  v-model.number="subRow[month]" 
                  type="number"
                  class="input-number"
                  @change="updateSubRowData(idx, subIdx, subRow)"
                >
              </td>
              <td class="col-total">{{ formatNumber(calculateRowTotal(subRow)) }}</td>
              <td class="col-actions">
                <button @click="deleteSubRow(idx, subIdx)" class="btn-sm btn-delete">×</button>
              </td>
            </tr>
          </template>

          <!-- Summary Row -->
          <tr class="summary-row">
            <td class="col-category">รวมทั้งสิ้น</td>
            <td class="col-number">{{ formatNumber(summary.budget_op) }}</td>
            <td class="col-number">{{ formatNumber(summary.budget_fund) }}</td>
            <td v-for="month in months" :key="`summary-${month}`" class="col-month">
              {{ formatNumber(summary[month]) }}
            </td>
            <td class="col-total">{{ formatNumber(summary.total) }}</td>
            <td class="col-actions"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetTable',
  props: {
    rows: {
      type: Array,
      required: true
    },
    summary: {
      type: Object,
      required: true
    },
    months: {
      type: Array,
      default: () => ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep']
    }
  },
  methods: {
    formatNumber(value) {
      return (parseFloat(value) || 0).toLocaleString('th-TH', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    },
    getMonthName(month) {
      const monthNames = {
        oct: 'ต.ค.',
        nov: 'พ.ย.',
        dec: 'ธ.ค.',
        jan: 'ม.ค.',
        feb: 'ก.พ.',
        mar: 'มี.ค.',
        apr: 'เม.ย.',
        may: 'พ.ค.',
        jun: 'มิ.ย.',
        jul: 'ก.ค.',
        aug: 'ส.ค.',
        sep: 'ก.ย.'
      };
      return monthNames[month] || month;
    },
    calculateRowTotal(row) {
      let total = 0;
      this.months.forEach(month => {
        total += parseFloat(row[month]) || 0;
      });
      return total;
    },
    toggleSubRows(index) {
      this.rows[index].subRowsCollapsed = !this.rows[index].subRowsCollapsed;
    },
    updateRowData(index, row) {
      this.$emit('update:row', index, row);
    },
    updateSubRowData(rowIndex, subIndex, subRow) {
      this.$emit('update:sub-row', rowIndex, subIndex, subRow);
    },
    addSubRow(rowIndex) {
      this.$emit('add:sub-row', rowIndex);
    },
    deleteSubRow(rowIndex, subIndex) {
      if (confirm('คุณแน่ใจหรือว่าต้องการลบรายการนี้?')) {
        this.$emit('delete:sub-row', rowIndex, subIndex);
      }
    }
  }
};
</script>

<style scoped>
.budget-table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
}

.table-container {
  min-width: 1200px;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.header-row th {
  padding: 12px 8px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}

.col-category {
  text-align: left;
  min-width: 200px;
  width: 20%;
}

.col-number {
  min-width: 100px;
  width: 8%;
}

.col-month {
  min-width: 80px;
  width: 5%;
}

.col-total {
  min-width: 100px;
  width: 8%;
  font-weight: bold;
}

.col-actions {
  min-width: 60px;
  width: 5%;
}

.data-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.data-row:hover {
  background-color: #f9fafb;
}

.data-row td {
  padding: 8px 4px;
  border: 1px solid #f0f0f0;
}

.sub-header-row {
  background-color: #f3f4f6;
  font-weight: bold;
}

.sub-header {
  padding: 8px 12px !important;
  display: flex !important;
  justify-content: space-between;
  align-items: center;
}

.sub-data-row {
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.sub-data-row td {
  padding: 6px 4px;
  border: 1px solid #f0f0f0;
}

.sub-item {
  padding-left: 30px !important;
}

.summary-row {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  font-weight: bold;
  border-top: 2px solid #667eea;
}

.summary-row td {
  padding: 12px 8px;
  border: 1px solid #e5e7eb;
}

.input-text,
.input-number {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: inherit;
}

.input-text:focus,
.input-number:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 4px rgba(102, 126, 234, 0.3);
}

.input-number {
  text-align: right;
}

.btn-sm {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-expand {
  background: #e0e7ff;
  color: #667eea;
}

.btn-expand:hover {
  background: #667eea;
  color: white;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #dc2626;
  color: white;
}

.btn-add {
  background: #d1fae5;
  color: #059669;
  padding: 4px 12px;
}

.btn-add:hover {
  background: #059669;
  color: white;
}
</style>
