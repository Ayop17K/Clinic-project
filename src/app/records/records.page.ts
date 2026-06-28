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

  getSpentPercentage(plan: any): number {
    const budget = parseFloat(plan.name) || 0;
    if (budget <= 0) return 0;
    const remaining = this.getRemainingBudget(plan);
    const spent = budget - remaining;
    return (spent / budget) * 100;
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

  simulate5YearsData() {
    try {
      const years = ['2564', '2565', '2566', '2567', '2568'];
      const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
      
      const financialPlans = years.map((y, idx) => {
        const baseBudget = 1500000 + (idx * 200000) + Math.floor(Math.random() * 100000);
        return { name: baseBudget.toString(), date: y };
      });
      localStorage.setItem('financial_plans', JSON.stringify(financialPlans));

      const mockEntries: any[] = [];
      years.forEach((year) => {
        const yearInt = parseInt(year);
        const numRecords = 3 + Math.floor(Math.random() * 3);
        const spendTypes = ['ค่ายา', 'ค่าวัสดุสำนักงาน', 'ค่าตอบแทน OT', 'ค่าซ่อมบำรุง', 'ค่าประปา-ไฟฟ้า'];
        
        for (let i = 0; i < numRecords; i++) {
          const withdrawAmount = 20000 + Math.floor(Math.random() * 30000);
          mockEntries.push({
            itemName: spendTypes[Math.floor(Math.random() * spendTypes.length)] + ` (ครั้งที่ ${i + 1})`,
            withdraw: withdrawAmount.toString(),
            withdrawType: 'เงินบำรุง',
            date: `${yearInt - 543}-05-${10 + i}`
          });
        }
      });
      localStorage.setItem('menu6_entries', JSON.stringify(mockEntries));

      years.forEach(year => {
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

        localStorage.setItem(`allPlanRows-${year}`, JSON.stringify({
          rows: rows,
          savedAt: new Date().toISOString()
        }));
      });

      alert('จำลองข้อมูล 5 ปีงบประมาณสำเร็จแล้ว (พ.ศ. 2564 - 2568)!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการจำลองข้อมูล');
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
}