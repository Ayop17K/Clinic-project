import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

import { HttpClient } from '@angular/common/http';

Chart.register(...registerables);

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

  // เพิ่มตัวแปรสำหรับกราฟ
  activeTab: string = 'charts';
  donutChartInstance: any = null;
  barChartInstance: any = null;
  trendChartInstance: any = null;

  recordYears: string[] = [];
  filteredSavedEntries: any[] = [];
  filteredFinancialPlans: any[] = [];
  trendViewMode: string = 'monthly';
  isAdmin: boolean = false;

  tableData: any[] = [];

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.username) {
      this.router.navigate(['/home']);
      return;
    }
    const username = (user.username || '').toString().trim().toLowerCase();
    this.isAdmin = !!user.isAdmin || username === 'admin';
    this.cdr.detectChanges();

    this.http.get<any[]>('http://localhost:3000/api/financial-plans').subscribe({
      next: (plans) => {
        if (!plans || plans.length === 0) {
          // Only auto-simulate if user is admin
          if (this.isAdmin) {
            this.simulate5YearsData(true);
          } else {
            this.loadData();
          }
        } else {
          this.loadData();
        }
      },
      error: (err) => {
        console.error('Error fetching plans on init, falling back to local simulation check:', err);
        const existingPlans = localStorage.getItem('financial_plans');
        const parsedPlans = existingPlans ? JSON.parse(existingPlans) : [];
        if (parsedPlans.length === 0) {
          if (this.isAdmin) {
            this.simulate5YearsData(true);
          } else {
            this.loadData();
          }
        } else {
          this.loadData();
        }
      }
    });
  }

  ionViewWillEnter() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.username) {
      const username = (user.username || '').toString().trim().toLowerCase();
      this.isAdmin = !!user.isAdmin || username === 'admin';
      this.cdr.detectChanges();
    }
    this.loadData();
  }

  ionViewDidEnter() {
    this.updateCharts();
  }

  loadData() {
    this.http.get<any[]>('http://localhost:3000/api/menu6-entries').subscribe({
      next: (entries) => {
        this.savedEntries = entries || [];
        this.http.get<any[]>('http://localhost:3000/api/financial-plans').subscribe({
          next: (plans) => {
            this.financialPlans = plans || [];
            this.updateFiltersAndRender();
          },
          error: (err) => {
            console.error('Error loading plans:', err);
            const plans = localStorage.getItem('financial_plans');
            this.financialPlans = plans ? JSON.parse(plans) : [];
            this.updateFiltersAndRender();
          }
        });
      },
      error: (err) => {
        console.error('Error loading entries:', err);
        const entries = localStorage.getItem('menu6_entries');
        this.savedEntries = entries ? JSON.parse(entries) : [];
        const plans = localStorage.getItem('financial_plans');
        this.financialPlans = plans ? JSON.parse(plans) : [];
        this.updateFiltersAndRender();
      }
    });
  }

  private updateFiltersAndRender() {
    this.updateFilters();
    if (!this.selectedYear && this.recordYears.length > 0) {
      this.selectedYear = this.recordYears[this.recordYears.length - 1]; // default to latest year
      this.updateFilters();
    }
    this.updateCharts();
  }

  updateFilters() {
    // 1. Calculate recordYears
    const years = Array.from(
      new Set(
        this.financialPlans
          .map(plan => {
            if (plan.date && plan.date.length >= 4) {
              return plan.date.slice(0, 4);
            }
            return plan.date;
          })
          .filter(y => !!y)
      )
    );
    this.recordYears = (years as string[]).sort();

    // 2. Filter saved entries
    if (!this.selectedYear) {
      this.filteredSavedEntries = this.savedEntries;
    } else {
      this.filteredSavedEntries = this.savedEntries.filter(entry => {
        if (!entry.date) return false;
        const entryYear = entry.date.length >= 4 ? entry.date.slice(0, 4) : entry.date;
        return entryYear === this.selectedYear;
      });
    }

    // 3. Filter financial plans
    let plans = this.financialPlans;
    if (this.selectedYear) {
      plans = plans.filter(plan => {
        const planYear = plan.date && plan.date.length >= 4 ? plan.date.slice(0, 4) : plan.date;
        return planYear === this.selectedYear;
      });
    }
    this.filteredFinancialPlans = plans.slice().sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
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

  getSpentPercentage(plan: any): number {
    const budget = parseFloat(plan.name) || 0;
    if (budget <= 0) return 0;
    const remaining = this.getRemainingBudget(plan);
    const spent = budget - remaining;
    return (spent / budget) * 100;
  }

  getBuddhistYear(dateStr: string): string {
    if (!dateStr) return '';
    // If already a 4-digit year (could be พ.ศ. already stored)
    if (/^\d{4}$/.test(dateStr)) {
      const num = parseInt(dateStr, 10);
      // If > 2100 it's already พ.ศ., if < 2100 it's ค.ศ. — convert
      return num > 2100 ? num.toString() : (num + 543).toString();
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const year = date.getFullYear();
    return year > 2100 ? year.toString() : (year + 543).toString();
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

  clearYearFilter() {
    this.selectedYear = '';
    this.updateFilters();
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

  simulate5YearsData(auto: boolean = false) {
    try {
      const years = ['2564', '2565', '2566', '2567', '2568'];
      const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
      
      // Clear old simulation data to prevent caching/merging issues
      localStorage.removeItem('financial_plans');
      localStorage.removeItem('menu6_entries');
      years.forEach(y => {
        localStorage.removeItem(`allPlanRows-${y}`);
      });

      const budgetMap: { [key: string]: number } = {};
      const financialPlans = years.map((y, idx) => {
        // Budgets always under 2 Million (between 1.2M and 1.8M)
        const baseBudget = 1200000 + (idx * 120000) + Math.floor(Math.random() * 50000);
        budgetMap[y] = baseBudget;
        return { name: baseBudget.toString(), date: y };
      });
      localStorage.setItem('financial_plans', JSON.stringify(financialPlans));

      const mockEntries: any[] = [];
      const spendCategories = [
        { name: 'ซื้อเวชภัณฑ์ยา', type: 'เงินบำรุง' },
        { name: 'ซื้อวัสดุวิทยาศาสตร์การแพทย์', type: 'เงินบำรุง' },
        { name: 'จ่ายค่าจ้างลูกจ้างชั่วคราว', type: 'เงินบำรุง' },
        { name: 'จ่ายค่าตอบแทน OT', type: 'เงินบำรุง' },
        { name: 'จ่ายค่าสาธารณูปโภค', type: 'เงินบำรุง' },
        { name: 'ค่าซ่อมแซมและบำรุงรักษาครุภัณฑ์', type: 'เงินบำรุง' }
      ];

      years.forEach((year) => {
        const yearInt = parseInt(year);
        const calYear = yearInt - 543;
        const baseBudget = budgetMap[year] || 1200000;
        
        // Target total spent is around 75% to 88% of baseBudget (never fully spent)
        const targetSpent = baseBudget * (0.75 + Math.random() * 0.13);
        
        // For the latest year (2568), simulate that we are currently in June,
        // so we only have spent entries up to May (8 months: Oct - May).
        const maxMonths = year === '2568' ? 8 : 12;
        
        for (let mIdx = 0; mIdx < maxMonths; mIdx++) {
          const withdrawAmount = Math.round((targetSpent / 12) * (0.85 + Math.random() * 0.3));
          
          let itemYear = calYear;
          let itemMonth = 1;
          if (mIdx < 3) {
            itemYear = calYear - 1;
            itemMonth = 10 + mIdx;
          } else {
            itemMonth = mIdx - 2;
          }
          
          const monthStr = itemMonth.toString().padStart(2, '0');
          const dayStr = (10 + Math.floor(Math.random() * 15)).toString().padStart(2, '0');
          const dateStr = `${itemYear}-${monthStr}-${dayStr}`;
          
          const cat = spendCategories[mIdx % spendCategories.length];
          mockEntries.push({
            itemName: cat.name + ` (ประจำเดือน ${itemMonth}/${itemYear + 543})`,
            withdraw: withdrawAmount.toString(),
            withdrawType: cat.type,
            date: dateStr
          });
        }
      });
      localStorage.setItem('menu6_entries', JSON.stringify(mockEntries));

      const rowsMap: { [key: string]: any } = {};

      years.forEach(year => {
        const baseBudget = budgetMap[year] || 1200000;
        
        const rows = this.getDefaultPlanRowsTemplate().map((row, rIdx) => {
          if (row.subRows && row.subRows.length > 0) {
            row.subRows.forEach((sub: any) => {
              const base = this.getCategoryBaseAmount(rIdx);
              sub.budget_op = Math.floor(base * 0.4 * (1 + Math.random() * 0.3));
              sub.budget_fund = Math.floor(base * 0.6 * (1 + Math.random() * 0.3));
              
              let monthlySum = 0;
              months.forEach(m => {
                const mVal = Math.floor((sub.budget_fund / 12) * (0.8 + Math.random() * 0.4));
                sub[m] = mVal;
                monthlySum += mVal;
              });
              sub.total = monthlySum;
            });
            
            row.budget_op = row.subRows.reduce((sum: number, s: any) => sum + (s.budget_op || 0), 0);
            row.budget_fund = row.subRows.reduce((sum: number, s: any) => sum + (s.budget_fund || 0), 0);
            months.forEach(m => {
              row[m] = row.subRows.reduce((sum: number, s: any) => sum + (s[m] || 0), 0);
            });
            row.total = row.subRows.reduce((sum: number, s: any) => sum + (s.total || 0), 0);
          } else {
            const base = this.getCategoryBaseAmount(rIdx);
            row.budget_op = Math.floor(base * 0.4 * (1 + Math.random() * 0.3));
            row.budget_fund = Math.floor(base * 0.6 * (1 + Math.random() * 0.3));
            
            let monthlySum = 0;
            months.forEach(m => {
              const mVal = Math.floor((row.budget_fund / 12) * (0.8 + Math.random() * 0.4));
              row[m] = mVal;
              monthlySum += mVal;
            });
            row.total = monthlySum;
          }
          row.subRowsCollapsed = true;
          return row;
        });

        // Scale plan rows so their grand total matches 96% of the allocated baseBudget
        let grandTotal = 0;
        rows.forEach(row => {
          grandTotal += row.total || 0;
        });

        const scaleFactor = (baseBudget * 0.96) / grandTotal;

        rows.forEach(row => {
          row.budget_op = Math.round((row.budget_op || 0) * scaleFactor);
          row.budget_fund = Math.round((row.budget_fund || 0) * scaleFactor);
          row.total = Math.round((row.total || 0) * scaleFactor);
          months.forEach(m => {
            row[m] = Math.round((row[m] || 0) * scaleFactor);
          });

          if (row.subRows && row.subRows.length > 0) {
            row.subRows.forEach((sub: any) => {
              sub.budget_op = Math.round((sub.budget_op || 0) * scaleFactor);
              sub.budget_fund = Math.round((sub.budget_fund || 0) * scaleFactor);
              sub.total = Math.round((sub.total || 0) * scaleFactor);
              months.forEach(m => {
                sub[m] = Math.round((sub[m] || 0) * scaleFactor);
              });
            });
          }
        });

        rowsMap[year] = {
          rows: rows,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(`allPlanRows-${year}`, JSON.stringify(rowsMap[year]));
      });

      // Post all items to backend API
      this.http.post('http://localhost:3000/api/reset-db', {}).subscribe({
        next: () => {
          this.http.post('http://localhost:3000/api/financial-plans', { plans: financialPlans }).subscribe({
            next: () => {
              this.http.post('http://localhost:3000/api/menu6-entries', { entries: mockEntries }).subscribe({
                next: () => {
                  let savedCount = 0;
                  years.forEach(year => {
                    this.http.post(`http://localhost:3000/api/plan-rows/${year}`, rowsMap[year]).subscribe({
                      next: () => {
                        savedCount++;
                        if (savedCount === years.length) {
                          if (!auto) {
                            alert('จำลองข้อมูล 5 ปีงบประมาณลงฐานข้อมูลสำเร็จแล้ว (พ.ศ. 2564 - 2568)!');
                            window.location.reload();
                          } else {
                            this.loadData();
                          }
                        }
                      },
                      error: (err) => {
                        console.error(`Error saving plan rows for ${year}:`, err);
                      }
                    });
                  });
                }
              });
            }
          });
        },
        error: (err) => {
          console.error('Error resetting backend DB, using local only:', err);
          if (!auto) {
            alert('จำลองข้อมูลสำเร็จ (บันทึกเฉพาะในเบราว์เซอร์)!');
            window.location.reload();
          } else {
            this.loadData();
          }
        }
      });
    } catch (err) {
      console.error(err);
      if (!auto) alert('เกิดข้อผิดพลาดในการจำลองข้อมูล');
    }
  }

  private getCategoryBaseAmount(index: number): number {
    const bases = [400000, 150000, 120000, 80000, 200000, 100000, 90000, 140000, 60000, 50000, 40000];
    return bases[index] || 50000;
  }

  private getDefaultPlanRowsTemplate(): any[] {
    return [
      { item: 'ค่ายาและเวชภัณฑ์', subRows: [{ name: 'ค่ายาและเวชภัณฑ์', hidden: false }] },
      {
        item: 'ค่าวัสดุ',
        subRows: [
          { name: 'วัสดุสำนักงาน', hidden: false },
          { name: 'วัสดุงานบ้านงานครัว', hidden: false },
          { name: 'วัสดุไฟฟ้าและวิทยุ', hidden: false },
          { name: 'วัสดุน้ำมันเชื้อเพลิงและหล่อลื่น', hidden: false },
          { name: 'วัสดุคอมพิวเตอร์', hidden: false },
          { name: 'วัสดุก่อสร้าง', hidden: false },
          { name: 'วัสดุโฆษณาและเผยแพร่', hidden: false },
          { name: 'วัสดุการเกษตร', hidden: false },
          { name: 'วัสดุยานพาหนะและขนส่ง', hidden: false },
          { name: 'วัสดุวิทยาศาสตร์', hidden: false },
          { name: 'วัสดุการแพทย์', hidden: false },
          { name: 'วัสดุทันตกรรม', hidden: false },
          { name: 'วัสดุอื่นๆ.........................', hidden: false }
        ]
      },
      {
        item: 'ค่าตอบแทนทางการแพทย์',
        subRows: [
          { name: 'ค่าตอบแทนการทางการแพทย์และฝ่ายสนับสนุนอื่นๆ', hidden: false },
          { name: 'ค่าตอบแทนอื่นๆ', hidden: false }
        ]
      },
      { item: 'ค่าบริการทางการแพทย์', subRows: [] },
      {
        item: 'ค่าครุภัณฑ์ ที่ดิน และสิ่งก่อสร้าง',
        subRows: [
          { name: 'ครุภัณฑ์สำนักงาน', hidden: false },
          { name: 'ครุภัณฑ์คอมพิวเตอร์', hidden: false },
          { name: 'ครุภัณฑ์การเกษตร', hidden: false },
          { name: 'ครุภัณฑ์โฆษณาและเผยแพร่', hidden: false },
          { name: 'ครุภัณฑ์งานบ้านงานครัว', hidden: false },
          { name: 'ครุภัณฑ์ยานพาหนะและขนส่ง', hidden: false },
          { name: 'ครุภัณฑ์วิทยาศาสตร์และการแพทย์', hidden: false },
          { name: 'ครุภัณฑ์ไฟฟ้าและวิทยุ', hidden: false },
          { name: 'วัสดุการแพทย์', hidden: false },
          { name: 'ครุภัณฑ์อื่นๆ (ต่ำกว่าเกณฑ์)', hidden: false },
          { name: 'ที่ดินและสิ่งกอสรางของโรงพยาบาลและหนวยบริการสาธารณสุข', hidden: false },
          { name: 'ซ่อมแซมหลังคาห้องฉุกเฉิน', hidden: false },
          { name: 'อื่นๆ................................', hidden: false }
        ]
      },
      {
        item: 'ค่าใช้สอย',
        subRows: [
          { name: 'ค่าจ้างเหมาบริการผู้ช่วยทันตกรรม', hidden: false },
          { name: 'จ้างเหมาบริการแม่บ้าน', hidden: false },
          { name: 'ค่าจ้างเหมาบริการคนสวน', hidden: false },
          { name: 'จ้างเหมาบริการเจ้าหน้าที่การเงิน การบัญชี', hidden: false },
          { name: 'จ้างเหมาบริการเจ้าหน้าที่ธุรการ', hidden: false },
          { name: 'จ้างเหมาบริการนักวิชาการสาธารณสุข', hidden: false },
          { name: 'จ้างเหมาบริการ ผู้ช่วยแพทย์แผนไทย', hidden: false },
          { name: 'ค่าจ้างเก็บขนและกำจัดขยะติดเชื้อ', hidden: false },
          { name: 'ค่าจ้างเหมาบริการอื่น ๆ', hidden: false }
        ]
      },
      {
        item: 'ค่าสาธารณูปโภค',
        subRows: [
          { name: 'ไฟฟ้า', hidden: false },
          { name: 'ประปา', hidden: false },
          { name: 'โทรศัพท์', hidden: false },
          { name: 'ค่าบริการสื่อสารและโทรนาคม', hidden: false },
          { name: 'ค่าเก็บขนและกำจัดขยะมูลฝอย', hidden: false },
          { name: 'อื่นๆ .............................', hidden: false }
        ]
      },
      {
        item: 'ค่าจ้างลูกจ้างชั่วคราว',
        subRows: [
          { name: 'ค่าจ้างลูกจ้างกลุ่มวิชาชีพ', hidden: false },
          { name: 'พยาบาล', hidden: false },
          { name: 'นักวิชาการสาธารณสุข', hidden: false },
          { name: 'เจ้าพนักงานสาธารณสุข', hidden: false },
          { name: 'ทันตสาธาณณสุข', hidden: false },
          { name: 'แพทย์แผนไทย', hidden: false },
          { name: 'ค่าจ้างลูกจ้างกลุ่มสนับสนุนบริการ', hidden: false },
          { name: 'ค่าจ้างลูกจ้างบันทึกข้อมูล', hidden: false },
          { name: 'ค่าจ้างลูกจ้างผู้ช่วยเหลือคนไข้ (ผู้ช่วยเจ้าหน้าที่สาธารณสุข)', hidden: false },
          { name: 'ค่าจ้างลูกจ้างทำความสะอาด พนักงานขับรถ  คนสวน  (พนักงานทั่วไป)', hidden: false },
          { name: 'ค่าจ้างผู้ช่วยแพทย์แผนไทย…….', hidden: false },
          { name: 'อื่น ๆ (ระบุ) ..............................', hidden: false }
        ]
      },
      {
        item: 'ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ',
        subRows: [
          { name: 'ค่าตอบแทนปฏิบัติงานนอกเวลาราชการและวันหยุดราชการ', hidden: false },
          { name: 'ค่าตอบแทนปฏิบัติงานเชิงรุก', hidden: false },
          { name: 'อื่นๆ..........................', hidden: false }
        ]
      },
      {
        item: 'ค่าใช้จ่ายการเดินทางไปราชการ/ค่าใช้จ่ายในการเข้ารับการฝึกอบรม',
        subRows: [
          { name: 'ค่าใช้จ่ายในการเดินทางไปราชการ', hidden: false },
          { name: 'ค่าเบี้ยเลี้ยง', hidden: false },
          { name: 'ค่าพาหนะ', hidden: false },
          { name: 'ค่าลงทะเบียน', hidden: false },
          { name: 'ค่าที่พัก', hidden: false },
          { name: 'อื่นๆ ..........................', hidden: false }
        ]
      },
      {
        item: 'ค่าใช้จ่ายอื่นที่จำเป็นที่เกี่ยวข้องกับการสาธารณสุข',
        subRows: [
          { name: 'เงินสมทบประกันสังคมส่วนของนายจ้าง', hidden: false },
          { name: 'ภาษีหัก ณ ที่จ่าย', hidden: false },
          { name: 'ค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย สำหรับ พกส/ลูกจ้างชั่วคราว', hidden: false },
          { name: 'ค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย สำหรับข้าราชการ', hidden: false },
          { name: 'อื่น (ระบุ)...................................', hidden: false }
        ]
      }
    ];
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.updateCharts();
  }

  setTrendViewMode(mode: string) {
    this.trendViewMode = mode;
    if (this.trendChartInstance) {
      this.trendChartInstance.destroy();
      this.trendChartInstance = null;
    }
    setTimeout(() => {
      this.drawTrendChart();
    }, 50);
  }

  updateCharts() {
    this.updateFilters();
    if (this.activeTab !== 'charts') return;

    // Destroy existing chart instances to prevent canvas reuse errors
    if (this.donutChartInstance) { this.donutChartInstance.destroy(); this.donutChartInstance = null; }
    if (this.barChartInstance) { this.barChartInstance.destroy(); this.barChartInstance = null; }
    if (this.trendChartInstance) { this.trendChartInstance.destroy(); this.trendChartInstance = null; }

    // Run chart rendering in next tick to ensure canvas elements are loaded in DOM
    setTimeout(() => {
      this.drawDonutChart();
      this.drawBarChart();
      this.drawTrendChart();
    }, 100);
  }

  private getChartData() {
    const selectYearInt = parseInt(this.selectedYear) || 2568;
    const calYear = selectYearInt - 543;

    // 12 months array (Oct of calYear-1 to Sep of calYear)
    const monthlySpent = new Array(12).fill(0);
    const monthlyPlan = new Array(12).fill(0);
    const categoriesData: { [key: string]: number } = {};

    // Group actual spent entries
    this.savedEntries.forEach(entry => {
      if (!entry.date) return;
      const date = new Date(entry.date);
      if (isNaN(date.getTime())) return;
      
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      const amount = parseFloat(entry.withdraw) || 0;
      
      if (year === calYear - 1 && month >= 9) {
        monthlySpent[month - 9] += amount;
      } else if (year === calYear && month <= 8) {
        monthlySpent[month + 3] += amount;
      }
    });

    // Group planned rows
    const savedPlan = localStorage.getItem(`allPlanRows-${this.selectedYear}`);
    if (savedPlan) {
      try {
        const data = JSON.parse(savedPlan);
        if (data.rows) {
          data.rows.forEach((row: any) => {
            const categoryName = row.item || 'อื่นๆ';
            const totalPlan = parseFloat(row.total) || 0;
            if (totalPlan > 0) {
              categoriesData[categoryName] = (categoriesData[categoryName] || 0) + totalPlan;
            }
            
            const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
            months.forEach((m, idx) => {
              monthlyPlan[idx] += parseFloat(row[m]) || 0;
            });
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Determine the last month with actual spending recorded
    let lastActualMonthIndex = -1;
    this.savedEntries.forEach(entry => {
      if (!entry.date) return;
      const date = new Date(entry.date);
      if (isNaN(date.getTime())) return;
      const year = date.getFullYear();
      const month = date.getMonth();
      
      if (year === calYear - 1 && month >= 9) {
        const idx = month - 9;
        if (idx > lastActualMonthIndex) lastActualMonthIndex = idx;
      } else if (year === calYear && month <= 8) {
        const idx = month + 3;
        if (idx > lastActualMonthIndex) lastActualMonthIndex = idx;
      }
    });

    return { monthlySpent, monthlyPlan, categoriesData, lastActualMonthIndex };
  }

  private drawDonutChart() {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas) return;

    const { categoriesData } = this.getChartData();
    const labels = Object.keys(categoriesData);
    const data = Object.values(categoriesData);

    if (labels.length === 0) {
      // Draw placeholder text if no data
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Sarabun';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText('ไม่มีข้อมูลแผนงบประมาณในปีนี้', canvas.width / 2, canvas.height / 2);
      }
      return;
    }

    const palette = ['#0f4c81', '#00b4d8', '#06d6a0', '#ffd60a', '#f59e0b', '#ef476f', '#a78bfa', '#64748b', '#6366f1', '#f43f5e', '#34d399'];

    this.donutChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: palette.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { family: 'Sarabun', size: 11 },
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const val = context.raw as number;
                return ` ${context.label}: ${val.toLocaleString(undefined, {minimumFractionDigits: 2})} บาท`;
              }
            }
          }
        }
      }
    });
  }

  private drawBarChart() {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;

    const { monthlyPlan, monthlySpent } = this.getChartData();
    const labels = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];

    this.barChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'แผนการใช้จ่าย',
            data: monthlyPlan,
            backgroundColor: 'rgba(15, 76, 129, 0.85)',
            borderColor: '#0f4c81',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'จ่ายจริง',
            data: monthlySpent,
            backgroundColor: 'rgba(239, 71, 111, 0.85)',
            borderColor: '#ef476f',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Sarabun', size: 11 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { family: 'Sarabun', size: 10 },
              callback: function(value) { return Number(value).toLocaleString(); }
            }
          },
          x: {
            ticks: { font: { family: 'Sarabun', size: 10 } }
          }
        }
      }
    });
  }

  private drawTrendChart() {
    const canvas = document.getElementById('trendChart') as HTMLCanvasElement;
    if (!canvas) return;

    const { monthlyPlan, monthlySpent, lastActualMonthIndex } = this.getChartData();

    let labels: string[];
    let cumulativePlan: number[] = [];
    let cumulativeSpent: any[] = [];
    let forecastedSpent: any[] = [];

    const totalAllocated = this.financialPlans.find(p => {
      const pYear = p.date && p.date.length >= 4 ? p.date.slice(0, 4) : p.date;
      return pYear === this.selectedYear;
    });

    if (this.trendViewMode === 'monthly') {
      labels = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
      let planSum = 0;
      monthlyPlan.forEach(val => {
        planSum += val;
        cumulativePlan.push(planSum);
      });

      cumulativeSpent = new Array(12).fill(null);
      forecastedSpent = new Array(12).fill(null);
      let spentSum = 0;

      if (lastActualMonthIndex >= 0) {
        // 1. Fill actual cumulative spend up to lastActualMonthIndex
        for (let i = 0; i <= lastActualMonthIndex; i++) {
          spentSum += monthlySpent[i];
          cumulativeSpent[i] = spentSum;
        }

        // 2. Fill forecast trend line starting from the last actual spent point
        forecastedSpent[lastActualMonthIndex] = spentSum;
        const avgSpentPerMonth = spentSum / (lastActualMonthIndex + 1);
        
        for (let i = lastActualMonthIndex + 1; i < 12; i++) {
          spentSum += avgSpentPerMonth;
          forecastedSpent[i] = spentSum;
        }
      } else {
        // If no spent data, start forecast from 0 based on average monthly plan
        forecastedSpent[0] = 0;
        const maxBudget = totalAllocated ? parseFloat(totalAllocated.name) || 0 : planSum || 1000000;
        const step = maxBudget / 12;
        for (let i = 0; i < 12; i++) {
          forecastedSpent[i] = step * (i + 1);
        }
      }
    } else {
      // Quarterly mode
      labels = ['Q1 (ต.ค.-ธ.ค.)', 'Q2 (ม.ค.-มี.ค.)', 'Q3 (เม.ย.-มิ.ย.)', 'Q4 (ก.ค.-ก.ย.)'];
      
      const q1Plan = monthlyPlan[0] + monthlyPlan[1] + monthlyPlan[2];
      const q2Plan = q1Plan + monthlyPlan[3] + monthlyPlan[4] + monthlyPlan[5];
      const q3Plan = q2Plan + monthlyPlan[6] + monthlyPlan[7] + monthlyPlan[8];
      const q4Plan = q3Plan + monthlyPlan[9] + monthlyPlan[10] + monthlyPlan[11];
      cumulativePlan = [q1Plan, q2Plan, q3Plan, q4Plan];

      cumulativeSpent = new Array(4).fill(null);
      forecastedSpent = new Array(4).fill(null);

      const lastQIndex = lastActualMonthIndex >= 0 ? Math.floor(lastActualMonthIndex / 3) : -1;
      
      if (lastQIndex >= 0) {
        // Calculate cumulative actual spent for each completed/active quarter
        for (let q = 0; q <= lastQIndex; q++) {
          const limit = Math.min(lastActualMonthIndex, (q * 3) + 2);
          let sum = 0;
          for (let i = 0; i <= limit; i++) {
            sum += monthlySpent[i];
          }
          cumulativeSpent[q] = sum;
        }

        // Initialize forecast starting from the last actual spent point
        forecastedSpent[lastQIndex] = cumulativeSpent[lastQIndex];
        const totalMonthsCount = lastActualMonthIndex + 1;
        const avgSpentPerMonth = cumulativeSpent[lastQIndex] / totalMonthsCount;
        const avgSpentPerQuarter = avgSpentPerMonth * 3;

        for (let q = lastQIndex + 1; q < 4; q++) {
          forecastedSpent[q] = forecastedSpent[q - 1] + avgSpentPerQuarter;
        }
      } else {
        // No spent data, start forecast from 0 using allocated budget divided by quarters
        forecastedSpent[0] = 0;
        const maxBudget = totalAllocated ? parseFloat(totalAllocated.name) || 0 : q4Plan || 1000000;
        const step = maxBudget / 4;
        for (let q = 0; q < 4; q++) {
          forecastedSpent[q] = step * (q + 1);
        }
      }
    }

    this.trendChartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'แผนใช้จ่ายสะสม',
            data: cumulativePlan,
            borderColor: '#0f4c81',
            backgroundColor: 'rgba(15, 76, 129, 0.05)',
            borderWidth: 2,
            fill: true,
            tension: 0.15
          },
          {
            label: 'จ่ายจริงสะสม',
            data: cumulativeSpent,
            borderColor: '#059669',
            backgroundColor: 'transparent',
            borderWidth: 3,
            pointBackgroundColor: '#059669',
            pointRadius: 4,
            tension: 0.15
          },
          {
            label: 'ประมาณการแนวโน้ม (Forecast)',
            data: forecastedSpent,
            borderColor: '#ef476f',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0,
            tension: 0.15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Sarabun', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const val = context.raw as number;
                return ` ${context.dataset.label}: ${val.toLocaleString(undefined, {maximumFractionDigits: 0})} บาท`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { family: 'Sarabun', size: 10 },
              callback: function(value) { return Number(value).toLocaleString(); }
            }
          },
          x: {
            ticks: { font: { family: 'Sarabun', size: 10 } }
          }
        }
      }
    });
  }
}