import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.page.html',
  styleUrls: ['./navigator.page.scss'],
  standalone: false
})
export class NavigatorPage implements OnInit {
  isAdmin: boolean = false;

  // Dashboard properties
  financialPlans: any[] = [];
  savedEntries: any[] = [];
  availableYears: string[] = [];
  selectedYear: string = '';

  // Dashboard stats
  totalBudget: number = 0;
  totalSpent: number = 0;
  remainingBudget: number = 0;
  spentPercentage: number = 0;

  // Dashboard breakdown
  monthlySpent: { monthName: string, amount: number }[] = [];
  recentTransactions: any[] = [];
  categorySpent: { name: string, amount: number }[] = [];

  constructor(public router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.checkUserRole();
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    this.checkUserRole();
    this.loadDashboardData();
  }

  isDashboardActive(): boolean {
    return this.router.url === '/navigator' || this.router.url === '/navigator/dashboard';
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  getFiscalYear(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      if (/^\d{4}$/.test(dateStr)) {
        const num = parseInt(dateStr, 10);
        return num > 2100 ? num.toString() : (num + 543).toString();
      }
      return dateStr;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    const fiscalCalendarYear = month >= 10 ? year + 1 : year;
    return (fiscalCalendarYear + 543).toString();
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

  loadDashboardData() {
    this.http.get<any[]>('http://localhost:3000/api/menu6-entries').subscribe({
      next: (entries) => {
        this.savedEntries = entries || [];
        this.fetchFinancialPlans();
      },
      error: (err) => {
        console.error('Error loading entries:', err);
        const entries = localStorage.getItem('menu6_entries');
        this.savedEntries = entries ? JSON.parse(entries) : [];
        this.fetchFinancialPlans();
      }
    });
  }

  fetchFinancialPlans() {
    this.http.get<any[]>('http://localhost:3000/api/financial-plans').subscribe({
      next: (plans) => {
        this.financialPlans = plans || [];
        this.processDashboardStats();
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        const plans = localStorage.getItem('financial_plans');
        this.financialPlans = plans ? JSON.parse(plans) : [];
        this.processDashboardStats();
      }
    });
  }

  processDashboardStats() {
    const yearsSet = new Set<string>();
    this.financialPlans.forEach(plan => {
      if (plan.date) {
        const y = plan.date.length >= 4 ? plan.date.slice(0, 4) : plan.date;
        if (y) yearsSet.add(y);
      }
    });
    this.availableYears = Array.from(yearsSet).sort();

    if (!this.selectedYear && this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[this.availableYears.length - 1];
    }

    if (!this.selectedYear) {
      this.totalBudget = 0;
      this.totalSpent = 0;
      this.remainingBudget = 0;
      this.spentPercentage = 0;
      this.monthlySpent = [];
      this.recentTransactions = [];
      this.categorySpent = [];
      this.cdr.detectChanges();
      return;
    }

    const activePlan = this.financialPlans.find(plan => {
      const y = plan.date && plan.date.length >= 4 ? plan.date.slice(0, 4) : plan.date;
      return y === this.selectedYear;
    });
    this.totalBudget = activePlan ? (parseFloat(activePlan.name) || 0) : 0;

    const activeEntries = this.savedEntries.filter(entry => {
      return this.getFiscalYear(entry.date) === this.selectedYear;
    });

    this.totalSpent = activeEntries.reduce((sum, entry) => {
      const val = parseFloat(entry.withdraw) || 0;
      return sum + val;
    }, 0);

    this.remainingBudget = this.totalBudget - this.totalSpent;
    this.spentPercentage = this.totalBudget > 0 ? (this.totalSpent / this.totalBudget) * 100 : 0;

    const fiscalMonths = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
    const monthlySum = new Array(12).fill(0);

    activeEntries.forEach(entry => {
      if (!entry.date) return;
      const d = new Date(entry.date);
      if (isNaN(d.getTime())) return;
      const m = d.getMonth() + 1;
      const mIdx = (m >= 10) ? (m - 10) : (m + 2);
      if (mIdx >= 0 && mIdx < 12) {
        monthlySum[mIdx] += (parseFloat(entry.withdraw) || 0);
      }
    });

    this.monthlySpent = fiscalMonths.map((name, idx) => ({
      monthName: name,
      amount: monthlySum[idx]
    }));

    const sortedEntries = activeEntries.slice().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    this.recentTransactions = sortedEntries.slice(0, 5);

    const catMap = new Map<string, number>();
    activeEntries.forEach(entry => {
      const type = entry.withdrawType || 'เงินบำรุง';
      const val = parseFloat(entry.withdraw) || 0;
      catMap.set(type, (catMap.get(type) || 0) + val);
    });
    this.categorySpent = Array.from(catMap.entries()).map(([name, amount]) => ({
      name: name,
      amount: amount
    }));

    this.cdr.detectChanges();
  }

  onYearChange(event: any) {
    this.selectedYear = event.detail.value;
    this.processDashboardStats();
  }

  checkUserRole() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.username) {
      this.router.navigate(['/home']);
      return;
    }
    const username = (user.username || '').toString().trim().toLowerCase();
    this.isAdmin = !!user.isAdmin || username === 'admin';
    this.cdr.detectChanges();
  }

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

  simulate5YearsData() {
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
        return {
          name: baseBudget.toString(),
          date: y
        };
      });
      localStorage.setItem('financial_plans', JSON.stringify(financialPlans));

      // 2. Generate mock spent records (Menu-6 entries / savedEntries)
      // These represent spent amounts that subtract from the budget in RecordsPage
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
        
        // Generate monthly spending entries
        for (let mIdx = 0; mIdx < maxMonths; mIdx++) {
          const withdrawAmount = Math.round((targetSpent / 12) * (0.85 + Math.random() * 0.3));
          
          // Construct date based on fiscal calendar (Oct of calYear-1 to Sep of calYear)
          let itemYear = calYear;
          let itemMonth = 1; // January
          if (mIdx < 3) {
            // Oct, Nov, Dec
            itemYear = calYear - 1;
            itemMonth = 10 + mIdx; // 10, 11, 12
          } else {
            // Jan to Sep
            itemMonth = mIdx - 2; // 1, 2, 3, 4, 5, 6, 7, 8, 9
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

      // 3. Generate allPlanRows-{year} for each of the 5 years
      years.forEach(year => {
        const baseBudget = budgetMap[year] || 1200000;
        
        const rows = this.getDefaultPlanRowsTemplate().map((row, rIdx) => {
          // Generate simulated numbers for subRows
          if (row.subRows && row.subRows.length > 0) {
            row.subRows.forEach((sub: any) => {
              // Base amount depending on category
              const base = this.getCategoryBaseAmount(rIdx);
              // split 40% budget_op, 60% budget_fund roughly
              sub.budget_op = Math.floor(base * 0.4 * (1 + Math.random() * 0.3));
              sub.budget_fund = Math.floor(base * 0.6 * (1 + Math.random() * 0.3));
              
              // distribute budget_fund into 12 months roughly
              let monthlySum = 0;
              months.forEach(m => {
                const mVal = Math.floor((sub.budget_fund / 12) * (0.8 + Math.random() * 0.4));
                sub[m] = mVal;
                monthlySum += mVal;
              });
              sub.total = monthlySum; // spent plan total
            });
            
            // Sum subRows info into parent row
            row.budget_op = row.subRows.reduce((sum: number, s: any) => sum + (s.budget_op || 0), 0);
            row.budget_fund = row.subRows.reduce((sum: number, s: any) => sum + (s.budget_fund || 0), 0);
            months.forEach(m => {
              row[m] = row.subRows.reduce((sum: number, s: any) => sum + (s[m] || 0), 0);
            });
            row.total = row.subRows.reduce((sum: number, s: any) => sum + (s.total || 0), 0);
            
          } else {
            // Main row only (no subRows)
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
                          alert('จำลองข้อมูล 5 ปีงบประมาณลงฐานข้อมูลสำเร็จแล้ว (พ.ศ. 2564 - 2568)!');
                          window.location.reload();
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
          alert('จำลองข้อมูลสำเร็จ (บันทึกเฉพาะในเบราว์เซอร์)!');
          window.location.reload();
        }
      });
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการจำลองข้อมูล');
    }
  }

  private getCategoryBaseAmount(index: number): number {
    const bases = [
      400000, // ค่ายาและเวชภัณฑ์
      150000, // ค่าวัสดุ
      120000, // ค่าตอบแทนทางการแพทย์
      80000,  // ค่าบริการทางการแพทย์
      200000, // ค่าครุภัณฑ์ ที่ดิน
      100000, // ค่าใช้สอย
      90000,  // ค่าสาธารณูปโภค
      140000, // ค่าจ้างลูกจ้างชั่วคราว
      60000,  // ค่าตอบแทน OT
      50000,  // ค่าเดินทาง
      40000   // ค่าใช้จ่ายอื่น
    ];
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
          { name: 'ค่าจ้างเหมาซ่อมแซมยานพาหนะ', hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์ทางการแพทย์', hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์ไฟฟ้า', hidden: false },
          { name: 'ค่าจ้างเหมาซอมแซมครุภัณฑ์สำนักงาน', hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์งานบ้านงานครัว', hidden: false },
          { name: 'ค่าจ้างเหมาซอมแซมครุภัณฑ์คอมพิวเตอร์', hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมสิ่งก่อสร้าง', hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมเครื่องปรับอากาศ…………..', hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมรั้ว ห้องบริการ อื่นๆ', hidden: false },
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

}
