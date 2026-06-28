const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        financial_plans: [],
        menu6_entries: [],
        allPlanRows: {}
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB file:', err);
    return { financial_plans: [], menu6_entries: [], allPlanRows: {} };
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// --- Endpoints ---

// 1. Financial Plans (งบจัดสรรรายปี)
app.get('/api/financial-plans', (req, res) => {
  const db = readDB();
  res.json(db.financial_plans || []);
});

app.post('/api/financial-plans', (req, res) => {
  const db = readDB();
  db.financial_plans = req.body.plans || [];
  writeDB(db);
  res.json({ success: true, message: 'Saved financial plans successfully' });
});

// 2. Spent Transactions (รายการถอนเงิน)
app.get('/api/menu6-entries', (req, res) => {
  const db = readDB();
  res.json(db.menu6_entries || []);
});

app.post('/api/menu6-entries', (req, res) => {
  const db = readDB();
  db.menu6_entries = req.body.entries || [];
  writeDB(db);
  res.json({ success: true, message: 'Saved spent transactions successfully' });
});

// 3. Plan Rows by Year (สัดส่วนแผน 11 หมวดหมู่ รายปี)
app.get('/api/plan-rows/:year', (req, res) => {
  const db = readDB();
  const year = req.params.year;
  res.json(db.allPlanRows[year] || null);
});

app.post('/api/plan-rows/:year', (req, res) => {
  const db = readDB();
  const year = req.params.year;
  db.allPlanRows[year] = req.body;
  writeDB(db);
  res.json({ success: true, message: `Saved plan rows for year ${year} successfully` });
});

// 4. Bulk reset endpoint to clear database
app.post('/api/reset-db', (req, res) => {
  const initialData = {
    financial_plans: [],
    menu6_entries: [],
    allPlanRows: {}
  };
  writeDB(initialData);
  res.json({ success: true, message: 'Database reset successfully' });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Backend API Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`Database file path:`);
  console.log(`👉 ${DB_FILE}`);
  console.log(`=========================================`);
});
