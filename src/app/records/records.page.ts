import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Menu6Entry {
  number: number | null;
  alphabet: string;
  customLabel?: string;
  date?: string;
  year?: number;
}

interface FinancialPlan {
  name: string;
  date: string;
  
}

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: false // This is not a standalone component
})
export class RecordsPage implements OnInit {
  savedEntries: any[] = [];
  financialPlans: any[] = [];
  showRecords: boolean = true;
  showPlans: boolean = true;
  selectedYear: string = '';

  // เพิ่มตัวแปรในคลาส
  tableData: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/login']); // or show an error
      return;
    }
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    const entries = localStorage.getItem('menu6_entries');
    this.savedEntries = entries ? JSON.parse(entries) : [];

    const plans = localStorage.getItem('financial_plans');
    this.financialPlans = plans ? JSON.parse(plans) : [];
  }

  editEntry(index: number) {
  this.router.navigate(['/menu-6'], { queryParams: { edit: index } });
}
  editPlan(index: number) {
  this.router.navigate(['/financial-plans'], { queryParams: { edit: index } });
}
deletePlan(index: number) {
  this.financialPlans.splice(index, 1);
  localStorage.setItem('financial_plans', JSON.stringify(this.financialPlans));
}

  deleteEntry(index: number) {
  const existing = localStorage.getItem('menu6_entries');
  let entries: Menu6Entry[] = [];
  try {
    entries = existing ? JSON.parse(existing) : [];
  } catch {
    entries = [];
  }
  entries.splice(index, 1);
  localStorage.setItem('menu6_entries', JSON.stringify(entries));
  this.savedEntries = entries;
}

  exportCSV() {
    const exportYears = this.selectedYear ? [this.selectedYear] : this.recordYears;
    let allRows: any[] = [];

    // Header เดียว
    const header = [
        'ปีงบประมาณ', 'รายการ', 'เบิก', 'แหล่งงบประมาณ', 'วันที่',
        'ประเภทข้อมูล', 'งบตั้งต้น', 'งบคงเหลือ'
    ];
    allRows.push(header);

    exportYears.forEach(year => {
        const buddhistYear = this.getBuddhistYear(year);

        // Records
        const records = this.savedEntries
            .filter(entry => {
                if (!entry.date) return false;
                const entryYear = entry.date.length >= 4 ? entry.date.slice(0, 4) : entry.date;
                return entryYear === year;
            })
            .map(entry => [
                buddhistYear,
                entry.itemName || '',
                entry.withdraw || '',
                entry.sourceOfFunds || 'เงินบำรุง',
                this.getBuddhistDate(entry.date),
                '', '', '' // ช่องว่างสำหรับ financial plan
            ]);

        // Financial Plans
        const plans = this.financialPlans
            .filter(plan => {
                const planYear = plan.date && plan.date.length >= 4 ? plan.date.slice(0, 4) : plan.date;
                return planYear === year;
            })
            .map(plan => [
                buddhistYear,
                '', '', '', '',
                'งบจัดสรร',
                plan.name,
                this.getRemainingBudget(plan)
            ]);

        // รวมข้อมูลทั้งสองกลุ่ม
        if (records.length > 0) allRows.push(...records);
        if (plans.length > 0) allRows.push(...plans);

        // เว้นแถวว่างระหว่างปี (ถ้าไม่ใช่ปีสุดท้าย)
        allRows.push(['', '', '', '', '', '', '', '']);
    });

    // Export CSV
    const csvContent = allRows
        .map(row => row.map((val: string) => `"${val}"`).join(','))
        .join('\r\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'records_and_financial_plans.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

  getRemainingBudget(plan: any): number {
    // Use year for matching if available, else fallback to date string
    const planYear = plan.date && plan.date.length >= 4 ? plan.date.slice(0, 4) : plan.date;
    const planBudget = parseFloat(plan.name) || 0;
    // Sum all withdraws for this plan's year (match by year, not full date string)
    const totalWithdraw = this.savedEntries
      .filter(entry => {
        // entry.date may be full ISO string, so compare by year
        if (!entry.date) return false;
        const entryYear = entry.date.length >= 4 ? entry.date.slice(0, 4) : entry.date;
        return entryYear === planYear;
      })
      .reduce((sum, entry) => {
        const withdraw = entry.withdraw !== undefined ? parseFloat(entry.withdraw) : 0;
        return sum + (isNaN(withdraw) ? 0 : withdraw);
      }, 0);
    return planBudget - totalWithdraw;
  }

  getBuddhistYear(dateStr: string): string {
    if (!dateStr) return '';
    // If dateStr is just a year (e.g. "2024")
    if (/^\d{4}$/.test(dateStr)) {
      return (parseInt(dateStr, 10) + 543).toString();
    }
    // If dateStr is a full date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return (date.getFullYear() + 543).toString();
  }

  getBuddhistDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const buddhistYear = date.getFullYear() + 543;
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${buddhistYear}, ${hour}:${min}`;
  }

  get recordYears(): string[] {
  // Collect unique years from financialPlans
  const years = Array.from(
    new Set(
      this.financialPlans
        .map(plan => {
          // Extract year from plan.date (supports YYYY-MM-DD or YYYY)
          if (plan.date && plan.date.length >= 4) {
            return plan.date.slice(0, 4);
          }
          return plan.date;
        })
        .filter(y => !!y)
    )
  );
  return years.sort();
}

  clearYearFilter() {
    this.selectedYear = '';
  }

  get filteredSavedEntries() {
  if (!this.selectedYear) return this.savedEntries;
  return this.savedEntries.filter(entry => {
    if (!entry.date) return false;
    const entryYear = entry.date.length >= 4 ? entry.date.slice(0, 4) : entry.date;
    return entryYear === this.selectedYear;
  });
}

get filteredFinancialPlans() {
  let plans = this.financialPlans;
  if (this.selectedYear) {
    plans = plans.filter(plan => {
      const planYear = plan.date && plan.date.length >= 4 ? plan.date.slice(0, 4) : plan.date;
      return planYear === this.selectedYear;
    });
  }
  return plans.slice().sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// ...function removed as requested...

onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    const csv = e.target.result as string;
    
  };
  reader.readAsText(file, 'utf-8');
}
}