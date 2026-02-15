const ExcelJS = require('exceljs');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

class ExportService {
  async exportToExcel(year, data) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Budget Plan');

      // Add title
      const titleRow = worksheet.addRow([
        `แผนการใช้จ่ายเงินบำรุงโรงพยาบาลส่งเสริมสุขภาพตำบลหนองปลิง ประจำปีงบประมาณ ${year}`
      ]);
      titleRow.font = { size: 14, bold: true };
      worksheet.mergeCells('A1:S1');

      // Add headers
      const headers = [
        'หมวดค่าใช้จ่าย',
        'ประมาณการงบประมาณปกติ',
        'ประมาณการงบประมาณเงินอุดหนุน',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค.',
        'ส.ค.',
        'ก.ย.',
        'รวม'
      ];
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667EEA' }
      };

      // Add data rows
      data.forEach(item => {
        const row = worksheet.addRow([
          item.category_name,
          item.budget_op,
          item.budget_fund,
          item.oct,
          item.nov,
          item.dec,
          item.jan,
          item.feb,
          item.mar,
          item.apr,
          item.may,
          item.jun,
          item.jul,
          item.aug,
          item.sep,
          item.total
        ]);

        // Format numbers as currency
        for (let i = 2; i <= 16; i++) {
          row.getCell(i).numFmt = '#,##0.00';
        }
      });

      // Set column widths
      worksheet.columns = [
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 }
      ];

      // Save file
      const exportDir = path.join(app.getPath('documents'), 'ClinicBudgetExport');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      const fileName = `Budget_${year}_${Date.now()}.xlsx`;
      const filePath = path.join(exportDir, fileName);
      
      await workbook.xlsx.writeFile(filePath);
      return filePath;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
}

module.exports = ExportService;
