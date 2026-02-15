<template>
  <div class="records-page">
    <header class="header">
      <button @click="goBack" class="back-button">← ย้อนกลับ</button>
      <h1>บันทึกแผน</h1>
    </header>

    <main class="main-content">
      <div class="content-card">
        <p>หน้าบันทึกแผน - ยังในขั้นพัฒนา</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PlanRecords',
  methods: {
    goBack() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.records-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
  margin-bottom: 30px;
}

.back-button {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 1.8em;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  color: #666;
}
</style>
