import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-record',
  templateUrl: './plan-record.page.html',
  styleUrls: ['./plan-record.page.scss'],
  standalone: false // This is not a standalone component
})

export class PlanRecordPage implements OnInit, DoCheck {
  private lastLoadedRows: string = '';
  subItems: any;
  availableYears: string[] = [];
  planYear: string = '';
  planRows: any[] = [];
  tableCollapsed: boolean = false;
  expanded: boolean[] = [];
  summary: any = {};
  subRowsCollapsed: boolean[] = [];
  // Add months and monthNames properties
  months: string[] = [
    'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'
  ];
  monthNames: string[] = [
    'ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'
  ];

  allSubRowsCollapsed: boolean = true;

  toggleAllSubRows(): void {
    this.allSubRowsCollapsed = !this.allSubRowsCollapsed;
    this.subRowsCollapsed = (this.planRows || []).map(() => this.allSubRowsCollapsed);
  }

  constructor(private router: Router) {}

  ngDoCheck() {
    // Auto-reload data if storage has changed for the current year
    if (this.planYear) {
      const saved = localStorage.getItem(`allPlanRows-${this.planYear}`);
      const currentRows = JSON.stringify(this.planRows);
      let loadedRows = '';
      if (saved) {
        try {
          const data = JSON.parse(saved);
          loadedRows = JSON.stringify((data.rows || []).map((row: any) => {
            if (!row.subRows && row.subItems) {
              row.subRows = row.subItems;
              delete row.subItems;
            }
            if (!row.subRows) row.subRows = [];
            return row;
          }));
        } catch { loadedRows = ''; }
      }
      if (loadedRows && loadedRows !== this.lastLoadedRows) {
        this.loadYearData(this.planYear);
        this.lastLoadedRows = loadedRows;
      }
    }
  }
  removeSubItem(sub: { name: string }): void {
    const idx = this.subItems.indexOf(sub);
    if (idx > -1) {
      this.subItems.splice(idx, 1);
    }
}

  goToNavigator() {
    if (this.router && this.router.navigate) {
      this.router.navigate(['/navigator']);
    } else {
      window.location.href = '/navigator';
    }
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/login']); // or show an error
      return;
    }
    this.availableYears = this.getAllSavedYears();
    if (this.availableYears.length > 0) {
      this.planYear = this.availableYears.sort().reverse()[0];
      this.loadYearData(this.planYear);
    } else {
      this.planRows = [];
      this.planYear = '';
    }
    this.subRowsCollapsed = this.planRows.map(() => true);
    this.calculateSummary();
  }

  getAllSavedYears(): string[] {
    const years: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      const match = key.match(/^allPlanRows-(\d{4})$/);
      if (match) {
        years.push(match[1]);
      }
    }
    return years;
  }
  loadYearData(year: string) {
    const saved = localStorage.getItem(`allPlanRows-${year}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.planRows = (data.rows || []).map((row: any) => {
          // Migrate subItems to subRows if needed
          if (!row.subRows && row.subItems) {
            row.subRows = row.subItems;
            delete row.subItems;
          }
          // Always ensure subRows exists
          if (!row.subRows) row.subRows = [];
          return row;
        });
        this.planYear = year;
        this.lastLoadedRows = JSON.stringify(this.planRows);
      } catch {
        this.planRows = [];
        this.lastLoadedRows = '';
      }
    } else {
      this.planRows = [];
      this.lastLoadedRows = '';
    }
    this.subRowsCollapsed = this.planRows.map(() => true);
    this.expanded = this.planRows.map(() => false);
    this.calculateSummary();
  }
  toggleSubRowsCollapsed(i: number) {
    this.subRowsCollapsed[i] = !this.subRowsCollapsed[i];
  }

  toggleTable() {
    this.tableCollapsed = !this.tableCollapsed;
  }

  toggleRow(idx: number) {
    this.expanded[idx] = !this.expanded[idx];
  }

  calculateSummary() {
    const fields = [
      'budget_op', 'budget_fund', ...this.months
    ];
    this.summary = {};
    for (const field of fields) {
      this.summary[field] = this.planRows.reduce((acc, row) => {
        const val = parseFloat(row[field]);
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
    }
    this.summary.total = this.months.reduce((acc, m) => acc + (this.summary[m] || 0), 0);
  }

  // Navigation methods for buttons
  goToAllPlan() {
    if (this.router && this.router.navigate) {
      this.router.navigate(['/all-plan']);
    } else {
      window.location.href = '/all-plan';
    }
  }

  exportToCSV(): void {
    // Table header row (no multi-line header)
    const headers: string[] = [
      'ลำดับที่',
      'รายการ',
      'งบประมาณ อปท.',
      'เงินบำรุง',
      ...this.monthNames,
      'รวม'
    ];

    // Format numbers as in the UI
    const formatNumber = (val: any, isTotal = false) => {
      if (val === undefined || val === null || val === '') return isTotal ? '-' : '0.00';
      const num = Number(val);
      if (isNaN(num)) return isTotal ? '-' : '0.00';
      return num === 0 ? '-' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Row labels as in the web app
    const rowLabels = [
      'ค่ายาและเวชภัณฑ์',
      'ค่าวัสดุ',
      'ค่าตอบแทนทางการแพทย์',
      'ค่าบริการทางการแพทย์',
      'ค่าครุภัณฑ์ ที่ดิน และสิ่งก่อสร้าง',
      'ค่าใช้สอย',
      'ค่าสาธารณูปโภค',
      'ค่าจ้างลูกจ้างชั่วคราว',
      'ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ',
      'ค่าใช้จ่ายการเดินทางไปราชการ/ค่าใช้จ่ายในการเข้ารับการฝึกอบรม',
      'ค่าใช้จ่ายอื่นที่จำเป็นที่เกี่ยวข้องกับการสาธารณสุข'
    ];

    // Data rows: main rows and sub-rows
    const rows: string[][] = [];
    (this.planRows || []).forEach((row: any, idx: number) => {
      // Main row
      rows.push([
        (idx + 1).toString(),
        rowLabels[idx] || '',
        formatNumber(row.budget_op),
        formatNumber(row.budget_fund),
        ...this.months.map((m: string) => formatNumber(row[m])),
        formatNumber(row.total, true)
      ]);
      // Sub-rows
      if (row.subRows && Array.isArray(row.subRows) && row.subRows.length > 0) {
        row.subRows.forEach((sub: any, si: number) => {
          rows.push([
            `${idx + 1}.${si + 1}`,
            sub.name || '',
            formatNumber(sub.budget_op),
            formatNumber(sub.budget_fund),
            ...this.months.map((m: string) => formatNumber(sub[m])),
            formatNumber(sub.total, true)
          ]);
        });
      }
    });

    // Summary row
    const summaryRow: string[] = [
      'รวม',
      '',
      formatNumber(this.summary['budget_op']),
      formatNumber(this.summary['budget_fund']),
      ...this.months.map((m: string) => formatNumber(this.summary[m])),
      formatNumber(this.summary['total'])
    ];

    // CSV encode (no multi-line header)
    const csvData: string = [headers, ...rows, summaryRow]
      .map((r: string[]) => r.map((val: string) => '"' + (val ?? '').toString().replace(/"/g, '""') + '"').join(','))
      .join('\r\n');
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hospital_budget_plan.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Delete a single row or the entire record for the current year
  deleteRow(index?: number): void {
    if (typeof index === 'number') {
      // Delete a single row
      this.planRows.splice(index, 1);
      // Persist the updated rows to localStorage for the current year
      if (this.planYear) {
        const key = `allPlanRows-${this.planYear}`;
        const saved = localStorage.getItem(key);
        let data: any = {};
        if (saved) {
          try {
            data = JSON.parse(saved);
          } catch {
            data = {};
          }
        }
        data.rows = this.planRows;
        localStorage.setItem(key, JSON.stringify(data));
      }
      this.calculateSummary();
    } else {
      // Delete the entire record for the current year from localStorage
      if (this.planYear) {
        localStorage.removeItem(`allPlanRows-${this.planYear}`);
        this.planRows = [];
        this.subRowsCollapsed = [];
        this.calculateSummary();
        // Optionally, update availableYears and planYear
        this.availableYears = this.getAllSavedYears();
        if (this.availableYears.length > 0) {
          this.planYear = this.availableYears.sort().reverse()[0];
          this.loadYearData(this.planYear);
        } else {
          this.planYear = '';
        }
      }
    }
  }

  // Confirmation wrapper for deleting the entire year's record
  confirmDeleteRow(): void {
    if (!this.planYear || (this.planRows || []).length === 0) return;
    const message = `คุณต้องการลบข้อมูลทั้งหมดสำหรับปีงบประมาณ ${this.planYear}\nการกระทำนี้ไม่สามารถกู้คืนได้`; 
    if (confirm(message)) {
      this.deleteRow();
    }
  }
}
