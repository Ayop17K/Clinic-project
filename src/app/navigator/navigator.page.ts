import { Component, OnInit, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.page.html',
  styleUrls: ['./navigator.page.scss'],
  standalone: false
})
export class NavigatorPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/login']);
      return;
    }
  }

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

  simulate5YearsData() {
    try {
      const years = ['2564', '2565', '2566', '2567', '2568'];
      const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
      
      // 1. Generate financial_plans (งบจัดสรรตั้งต้น)
      const financialPlans = years.map((y, idx) => {
        // Increment budget slightly each year (between 1.5M and 2.5M)
        const baseBudget = 1500000 + (idx * 200000) + Math.floor(Math.random() * 100000);
        return {
          name: baseBudget.toString(),
          date: y
        };
      });
      localStorage.setItem('financial_plans', JSON.stringify(financialPlans));

      // 2. Generate mock records (Menu-6 entries / savedEntries)
      // These represent spent amounts that subtract from the budget in RecordsPage
      const mockEntries: any[] = [];
      years.forEach((year) => {
        const yearInt = parseInt(year);
        // Add 3-5 random spending records per year
        const numRecords = 3 + Math.floor(Math.random() * 3);
        const spendTypes = ['ค่ายา', 'ค่าวัสดุสำนักงาน', 'ค่าตอบแทน OT', 'ค่าซ่อมบำรุง', 'ค่าประปา-ไฟฟ้า'];
        
        for (let i = 0; i < numRecords; i++) {
          const withdrawAmount = 20000 + Math.floor(Math.random() * 30000);
          mockEntries.push({
            itemName: spendTypes[Math.floor(Math.random() * spendTypes.length)] + ` (ครั้งที่ ${i + 1})`,
            withdraw: withdrawAmount.toString(),
            withdrawType: 'เงินบำรุง',
            date: `${yearInt - 543}-05-${10 + i}` // Store as standard YYYY-MM-DD
          });
        }
      });
      localStorage.setItem('menu6_entries', JSON.stringify(mockEntries));

      // 3. Generate allPlanRows-{year} for each of the 5 years
      years.forEach(year => {
        const rows = this.getDefaultPlanRowsTemplate().map((row, rIdx) => {
          // Generate simulated numbers for subRows
          if (row.subRows && row.subRows.length > 0) {
            row.subRows.forEach((sub: any) => {
              // Base amount depending on category
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
            
            // Calculate totals for main row from subRows
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

        const key = `allPlanRows-${year}`;
        localStorage.setItem(key, JSON.stringify({
          rows: rows,
          savedAt: new Date().toISOString()
        }));
      });

      alert('จำลองข้อมูล 5 ปีงบประมาณสำเร็จแล้ว (พ.ศ. 2564 - 2568)!');
      // Refresh current page
      window.location.reload();
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

@NgModule({
  declarations: [NavigatorPage],
  imports: [
    IonicModule,
    RouterModule
  ]
})
export class NavigatorPageModule {}
