## 📌 Quick Start Guide - ระเบียบการเริ่มต้นใช้งาน

### Step 1: ติดตั้ง Node.js
ดาวน์โหลด Node.js จาก https://nodejs.org/
ที่ต้องการ LTS version (14.x หรือสูงกว่า)

### Step 2: เปิด Command Prompt/PowerShell
ไปที่โฟลเดอร์ `ELECTRON_PROJECT`

### Step 3: ติดตั้ง Dependencies
```bash
npm install
```
*จะใช้เวลา 3-5 นาที ค่อนข้างนาน เนื่องจาก `better-sqlite3` ต้อง compile*

### Step 4: เรียกใช้ Development Mode
```bash
npm run dev
```
จะเปิด:
- Vue Development Server (http://localhost:8080)
- Electron App window

### Step 5: สร้าง Executable (EXE)
เมื่อพัฒนาเสร็จ:
```bash
npm run build-win
```

ไฟล์ .exe จะอยู่ในโฟลเดอร์ `dist_electron/`

---

## 🎯 Features ที่พัฒนาแล้ว

✅ ตารางวางแผนงบประมาณ 10 หมวดค่าใช้จ่าย  
✅ บันทึกข้อมูลลงฐานข้อมูล SQLite  
✅ ส่งออก Excel  
✅ ซ่อน/แสดงรายการย่อย  
✅ ล้างข้อมูล  
✅ เลือกปีงบประมาณ  
✅ Design Glassmorphism สวยงาม  

---

## 🔧 Troubleshooting

### ❌ npm install ล้มเหลว
```bash
npm install -g windows-build-tools
npm install
```

### ❌ Port 8080 ถูกใช้งาน
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### ❌ Cannot find module 'better-sqlite3'
```bash
npm rebuild better-sqlite3
```

---

## 📚 File Structure

```
ELECTRON_PROJECT/
├── public/
│   ├── electron.js          ← Main Electron process
│   ├── preload.js           ← Security layer
│   └── index.html           ← HTML template
│
├── src/
│   ├── components/
│   │   └── BudgetTable.vue  ← Table component
│   ├── views/
│   │   ├── AllPlans.vue     ← Main page
│   │   └── PlanRecords.vue  ← Records page
│   ├── services/
│   │   ├── DatabaseService.js    ← SQLite operations
│   │   ├── ExportService.js      ← Excel export
│   │   ├── BudgetService.js      ← Business logic
│   │   └── StorageService.js     ← Local storage
│   ├── utils/
│   │   └── formatters.js    ← Utility functions
│   ├── assets/
│   │   └── styles/          ← Global CSS
│   ├── router/
│   │   └── index.js         ← Vue Router
│   ├── App.vue
│   └── main.js
│
├── package.json             ← Dependencies
├── vue.config.js            ← Vue config
├── babel.config.js          ← Babel config
├── electron-builder.json    ← Build config
└── README.md
```

---

## 💡 Tips

1. **ฝึกใช้ DevTools**: Press `F12` ขณะใช้งาน
2. **Export ที่ Documents**: ไฟล์ Excel ไปที่ `Documents\ClinicBudgetExport\`
3. **Database ที่ Local**: ไม่ต้องกังวลเรื่องอินเทอร์เน็ต
4. **Gitignore อยู่แล้ว**: สามารถ Push ขึ้น GitHub ได้

---

## 🚀 Next Steps

1. ✅ ทดสอบ Run แอป
2. ✅ ป้อนข้อมูลทดสอบ
3. ✅ Backup ข้อมูลเป็น Excel
4. ✅ Build เป็น EXE

**สำเร็จ! 🎉**
