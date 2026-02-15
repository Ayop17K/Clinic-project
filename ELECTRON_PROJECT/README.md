# Clinic Budget Planning - Electron Desktop App

แอปพลิเคชันวางแผนงบประมาณโรงพยาบาลแบบออฟไลน์ สำหรับใช้งานบนคอมพิวเตอร์

## ✨ คุณสมบัติ

- 📊 ตารางวางแผนงบประมาณพร้อมตัวแก้ไข
- 💾 บันทึกข้อมูลลงในฐานข้อมูลท้องถิ่น (SQLite)
- 📈 ส่งออกเป็นไฟล์ Excel
- 🔒 ทำงานแบบออฟไลน์ (ไม่ต้องเชื่อมต่ออินเทอร์เน็ต)
- 🎨 ดีไซน์現代 Glassmorphism

## 📋 ระบบที่ต้องการ

- Node.js 14 หรือสูงกว่า
- NPM หรือ Yarn
- Windows / macOS / Linux

## 🚀 การติดตั้ง

### 1. Clone หรือดาวน์โหลดโปรเจค

```bash
cd clinic-budget-app
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

## 🛠️ การพัฒนา

### เรียกใช้ในโหมด Development

```bash
npm run dev
```

ซึ่งจะเปิด:
- Vue Dev Server ที่ http://localhost:8080
- Electron App window

### เพียงเรียกใช้ Electron

```bash
npm run electron
```

## 📦 การสร้าง (Build)

### สร้าง Web Assets

```bash
npm run build
```

### สร้าง Executable ของ Windows

```bash
npm run build-win
```

ไฟล์ .exe จะถูกสร้างใน `dist_electron/` folder

### สร้าง macOS App

```bash
npm run build-mac
```

## 📂 โครงสร้างของโปรเจค

```
clinic-budget-app/
├── public/
│   ├── electron.js          # Main process ของ Electron
│   └── preload.js           # Preload script
├── src/
│   ├── components/          # Vue components
│   ├── views/               # Vue pages
│   ├── services/            # Business logic
│   ├── App.vue              # Root component
│   ├── main.js              # Vue entry point
│   └── router/              # Vue Router config
├── database/                # Database migrations
├── package.json             # Dependencies
├── vue.config.js            # Vue CLI config
└── electron-builder.json    # Build configuration
```

## 🗄️ ฐานข้อมูล

ข้อมูลจะถูกเก็บไว้ใน SQLite ที่:
- **Windows**: `C:\Users\<YourUsername>\AppData\Local\clinic-budget-db\budget-app.db`
- **macOS**: `~/Library/Application Support/clinic-budget-db/budget-app.db`
- **Linux**: `~/.local/share/clinic-budget-db/budget-app.db`

## 🔧 Troubleshooting

### Port 8080 ถูกใช้งานแล้ว
ลบไฟล์ `node_modules/.cache/` และลองใหม่

### SQLite Build Error
```bash
npm install windows-build-tools -g
npm rebuild
```

## 📝 หมายเหตุ

- แอปนี้ใช้งานแบบออฟไลน์อย่างเต็มที่
- ข้อมูลจะถูกเก็บไว้บนเครื่องของคุณเท่านั้น
- ไม่มีการส่งข้อมูลไปยัง Server

## 📞 Support

สำหรับปัญหาหรือข้อเสนอแนะ กรุณาติดต่อ

---

**Version**: 1.0.0  
**Created**: February 14, 2026
