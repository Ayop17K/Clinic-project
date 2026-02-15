class BudgetService {
  constructor() {
    this.months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
    this.defaultCategories = [
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
    ];
  }

  getDefaultCategories() {
    return this.defaultCategories;
  }

  initializeEmptyRow(categoryId, categoryName) {
    const row = {
      category_id: categoryId,
      category_name: categoryName,
      budget_op: 0,
      budget_fund: 0,
      sub_rows: []
    };

    // Initialize month columns
    this.months.forEach(month => {
      row[month] = 0;
    });

    row.total = 0;
    return row;
  }

  calculateRowTotal(row) {
    let total = 0;
    this.months.forEach(month => {
      total += parseFloat(row[month]) || 0;
    });
    return total;
  }

  calculateSummaryRow(rows) {
    const summary = {
      budget_op: 0,
      budget_fund: 0
    };

    this.months.forEach(month => {
      summary[month] = 0;
    });

    rows.forEach(row => {
      summary.budget_op += parseFloat(row.budget_op) || 0;
      summary.budget_fund += parseFloat(row.budget_fund) || 0;

      this.months.forEach(month => {
        summary[month] += parseFloat(row[month]) || 0;
      });
    });

    return summary;
  }

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
  }

  validateBudgetData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }

    return data.map(row => {
      const validatedRow = {
        ...row,
        budget_op: parseFloat(row.budget_op) || 0,
        budget_fund: parseFloat(row.budget_fund) || 0
      };

      this.months.forEach(month => {
        validatedRow[month] = parseFloat(row[month]) || 0;
      });

      validatedRow.total = this.calculateRowTotal(validatedRow);
      return validatedRow;
    });
  }

  // Export data to CSV format
  exportToCSV(rows, year) {
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

    let csv = `แผนการใช้จ่ายเงินบำรุงโรงพยาบาล ประจำปีงบประมาณ ${year}\n\n`;
    csv += headers.join('\t') + '\n';

    rows.forEach(row => {
      csv += `${row.category_name}\t${row.budget_op}\t${row.budget_fund}`;
      this.months.forEach(month => {
        csv += `\t${row[month]}`;
      });
      csv += `\t${row.total}\n`;
    });

    return csv;
  }
}

export default new BudgetService();
