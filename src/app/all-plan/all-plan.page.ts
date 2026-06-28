import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-plan',
  templateUrl: './all-plan.page.html',
  styleUrls: ['./all-plan.page.scss'],
  standalone: false // This is not a standalone component
})

export class AllPlanPage implements OnInit {
  allSubRowsCollapsed = true;

  // Collapse/Expand all sub-rows for all main rows
  toggleAllSubRows(): void {
    this.allSubRowsCollapsed = !this.allSubRowsCollapsed;
    if (this.planRows && Array.isArray(this.planRows)) {
      this.planRows.forEach((row: any) => {
        row.subRowsCollapsed = this.allSubRowsCollapsed;
      });
    }
  }
  currentDate: Date = new Date();
  // Safely returns a number for summary row display
  getSafeNumber(val: any): number {
    return isNaN(val) || val == null || val === '' ? 0 : Number(val);
  }
  // Helper for sub-item table header for subItems table
  getMonthName(m: string): string {
    const map: any = {
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
    return map[m] || m;
  }
  months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
  subItems: Array<any> = [];
  showSubItems: boolean = false;
  planRows: any[] = [
    { 
      item: 'ค่ายาและเวชภัณฑ์', 
      subItems: [], 
      showSubItems: false,
      subRowsCollapsed: false,
      subRows: [
        {
          name: 'ค่ายาและเวชภัณฑ์',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        }
      ]
    },
    { 
      item: 'ค่าวัสดุ', 
      subRowsCollapsed: true,
      subRows: [
        {
          name: 'วัสดุสำนักงาน',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุงานบ้านงานครัว',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุไฟฟ้าและวิทยุ',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุน้ำมันเชื้อเพลิงและหล่อลื่น',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุคอมพิวเตอร์',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุก่อสร้าง',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุโฆษณาและเผยแพร่',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุการเกษตร',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุยานพาหนะและขนส่ง',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุวิทยาศาสตร์',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุการแพทย์',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุทันตกรรม',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'วัสดุอื่นๆ.........................',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        }
      ]
    },
    { 
      item: 'ค่าตอบแทนทางการแพทย์', 
      subRowsCollapsed: true,
      subRows: [
        {
          name: 'ค่าตอบแทนการทางการแพทย์และฝ่ายสนับสนุนอื่นๆ',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        },
        {
          name: 'ค่าตอบแทนอื่นๆ',
          budget_op: 0,
          budget_fund: 0,
          oct: 0,
          nov: 0,
          dec: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          total: 0,
          hidden: false
        }
      ]
    },
    { 
      item: 'ค่าบริการทางการแพทย์', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: []
    },
    { 
      item: 'ค่าครุภัณฑ์ ที่ดิน และสิ่งก่อสร้าง', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: [
        { name: 'ครุภัณฑ์สำนักงาน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์คอมพิวเตอร์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์การเกษตร', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์โฆษณาและเผยแพร่', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์งานบ้านงานครัว', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์ยานพาหนะและขนส่ง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์วิทยาศาสตร์และการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์ไฟฟ้าและวิทยุ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'วัสดุการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ครุภัณฑ์อื่นๆ (ต่ำกว่าเกณฑ์)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'อื่นๆ................................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'รวม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: '5.2 ที่ดินและสิ่งกอสรางของโรงพยาบาลและหนวยบริการสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ซ่อมแซมหลังคาห้องฉุกเฉิน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'รวม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
      ]
    },
    { 
      item: 'ค่าใช้สอย', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: [
        { name: 'ค่าจ้างเหมาบริการผู้ช่วยทันตกรรม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'จ้างเหมาบริการแม่บ้าน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาบริการคนสวน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'จ้างเหมาบริการเจ้าหน้าที่การเงิน การบัญชี', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'จ้างเหมาบริการเจ้าหน้าที่ธุรการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'จ้างเหมาบริการนักวิชาการสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'จ้างเหมาบริการ ผู้ช่วยแพทย์แผนไทย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเก็บขนและกำจัดขยะติดเชื้อ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมยานพาหนะ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์ทางการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์ไฟฟ้า', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซอมแซมครุภัณฑ์สำนักงาน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์งานบ้านงานครัว', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซอมแซมครุภัณฑ์คอมพิวเตอร์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมสิ่งก่อสร้าง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมเครื่องปรับอากาศ…………..', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาซ่อมแซมรั้ว ห้องบริการ อื่นๆ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างเหมาบริการอื่น ๆ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
      ]
    },
    { 
      item: 'ค่าสาธารณูปโภค', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: [
        { name: 'ไฟฟ้า', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ประปา', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'โทรศัพท์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าบริการสื่อสารและโทรนาคม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าเก็บขนและกำจัดขยะมูลฝอย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'อื่นๆ .............................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
      ]
    },
    { 
      item: 'ค่าจ้างลูกจ้างชั่วคราว', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: [
        { name: 'ค่าจ้างลูกจ้างกลุ่มวิชาชีพ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'พยาบาล', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'นักวิชาการสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'เจ้าพนักงานสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ทันตสาธาณณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'แพทย์แผนไทย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างลูกจ้างกลุ่มสนับสนุนบริการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างลูกจ้างบันทึกข้อมูล', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างลูกจ้างผู้ช่วยเหลือคนไข้ (ผู้ช่วยเจ้าหน้าที่สาธารณสุข)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างลูกจ้างทำความสะอาด พนักงานขับรถ  คนสวน  (พนักงานทั่วไป)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าจ้างผู้ช่วยแพทย์แผนไทย…….', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'อื่น ๆ (ระบุ)…จพ.การเงินการบัญชี', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
      ]
    },
    { 
      item: 'ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: [
        { name: 'เบี้ยเลี้ยง(ค่าอาหาร)นอกเวลาราชการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าตอบแทนเหมาจ่าย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าล่วงเวลา/ค่าเวรยาม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
      ]
    },
    { 
      item: 'ค่าใช้จ่ายการเดินทางไปราชการ/ค่าใช้จ่ายในการเข้ารับการฝึกอบรม', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: [
        { name: 'ค่าเบี้ยเลี้ยง ค่าเช่าที่พัก และค่าพาหนะ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าลงทะเบียนต่าง ๆ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าใช้จ่ายอื่น ๆ ที่จำเป็น', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าใช้จ่ายเครื่องเชื้อเพลิงและน้ำมันหล่อลื่นของ รย.สำหรับขบ.ราชการและอบรม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        { name: 'ค่าใช้จ่ายบำรุงรักษาพาหนะของ รย.(สำหรับขบ.ราชการและอบรม)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
      ]
    },
    { 
      item: 'ค่าใช้จ่ายอื่นที่จำเป็นที่เกี่ยวข้องกับการสาธารณสุข', 
      subRowsCollapsed: true,
      budget_op: 0,
      budget_fund: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      total: 0,
      subRows: []
    }
  ];
  originalPlanRows: any[] = [];
  summary: any = {};
  planYear: string = '2568';

  constructor(private router: Router, private location: Location) {
    // Initialize data immediately in constructor
    this.initializeDefaultData();
  }
  goBack() {
    this.location.back();
  }

  addSubItem(row: any): void {
    if (!row.subItems) {
      row.subItems = [];
    }
    row.subItems.push({
      name: '',
      budget_op: '',
      budget_fund: '',
      oct: '',
      nov: '',
      dec: '',
      jan: '',
      feb: '',
      mar: '',
      apr: '',
      may: '',
      jun: '',
      jul: '',
      aug: '',
      sep: '',
      total: ''
    });
  }

  removeSubItem(sub: any, row: any): void {
    if (!row.subItems) return;
    const idx = row.subItems.indexOf(sub);
    if (idx > -1) {
      row.subItems.splice(idx, 1);
      this.calculateSummary();
    }
  }

  addRow() {
    this.planRows.push({
      item: '',
      budget_op: '',
      budget_fund: '',
      oct: '',
      nov: '',
      dec: '',
      jan: '',
      feb: '',
      mar: '',
      apr: '',
      may: '',
      jun: '',
      jul: '',
      aug: '',
      sep: '',
      total: ''
    });
    this.calculateSummary();
  }

  addSubRow(rowIndex: number) {
    if (!this.planRows[rowIndex].subRows) {
      this.planRows[rowIndex].subRows = [];
    }
    this.planRows[rowIndex].subRows.push({
      name: '',
      budget_op: '',
      budget_fund: '',
      oct: '',
      nov: '',
      dec: '',
      jan: '',
      feb: '',
      mar: '',
      apr: '',
      may: '',
      jun: '',
      jul: '',
      aug: '',
      sep: '',
      total: '',
      hidden: false
    });
    this.calculateMainRowFromSubRows(rowIndex);
  }
  toggleSubRowHidden(rowIndex: number, subIndex: number) {
    const subRow = this.planRows[rowIndex]?.subRows?.[subIndex];
    if (subRow) {
      subRow.hidden = !subRow.hidden;
    }
  }

  deleteSubRow(subIndex: number, rowIndex: number) {
    if (this.planRows[rowIndex]?.subRows) {
      this.planRows[rowIndex].subRows.splice(subIndex, 1);
      this.calculateMainRowFromSubRows(rowIndex);
    }
  }

  // Navigation methods for buttons
  goToPlanRecord() {
    if (this.router && this.router.navigate) {
      this.router.navigate(['/plan-record']);
    } else {
      window.location.href = '/plan-record';
    }
  }

  async confirmClear() {
    if (confirm('คุณแน่ใจหรือไม่ที่จะล้างข้อมูลทั้งหมด?')) {
      this.clearAll();
    }
  }
  getAllocatedBudget(): number {
    const plans = JSON.parse(localStorage.getItem('financial_plans') || '[]');
    const plan = plans.find((p: any) => {
      const pYear = p.date && p.date.length >= 4 ? p.date.slice(0, 4) : p.date;
      return pYear === this.planYear;
    });
    return plan ? parseFloat(plan.name) || 0 : 0;
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/login']); // or show an error
      return;
    }
    
    // Initialize default data with sub-rows if not already present
    this.initializeDefaultData();
    
    // Try to load the latest year if any
    const years = this.getAllSavedYears();
    if (years.length > 0) {
      const latestYear = years.sort().reverse()[0];
      this.planYear = latestYear;
      const saved = localStorage.getItem(`allPlanRows-${latestYear}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.rows) {
            this.planRows = data.rows;
            // Re-initialize default data after loading from localStorage
            this.initializeDefaultData();
          }
        } catch {}
      }
    }
    // Store original plan rows for filtering operations
    this.originalPlanRows = JSON.parse(JSON.stringify(this.planRows));
    this.calculateSummary();
  }

  initializeDefaultData() {
    // Ensure all rows have proper structure
    this.planRows.forEach((row, index) => {
      if (!row.hasOwnProperty('subRowsCollapsed')) {
        row.subRowsCollapsed = index === 0 ? false : true; // First row expanded, others collapsed
      }
      if (!row.subRows) {
        row.subRows = [];
      }
      
      // Add default sub-row to first row if it doesn't exist
      if (index === 0 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          {
            name: 'ค่ายาและเวชภัณฑ์',
            budget_op: 0,
            budget_fund: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            total: 0,
            hidden: false
          }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to second row (ค่าวัสดุ) if it doesn't exist
      if (index === 1 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'วัสดุสำนักงาน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุงานบ้านงานครัว', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุไฟฟ้าและวิทยุ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุน้ำมันเชื้อเพลิงและหล่อลื่น', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุคอมพิวเตอร์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุก่อสร้าง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุโฆษณาและเผยแพร่', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุการเกษตร', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุยานพาหนะและขนส่ง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุวิทยาศาสตร์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุทันตกรรม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุอื่นๆ.........................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-row to third row (ค่าตอบแทนทางการแพทย์) if it doesn't exist
      if (index === 2 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          {
            name: 'ค่าตอบแทนการทางการแพทย์และฝ่ายสนับสนุนอื่นๆ',
            budget_op: 0,
            budget_fund: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            total: 0,
            hidden: false
          },
          {
            name: 'ค่าตอบแทนอื่นๆ',
            budget_op: 0,
            budget_fund: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            total: 0,
            hidden: false
          }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to fifth row (ค่าครุภัณฑ์ ที่ดิน และสิ่งก่อสร้าง) if it doesn't exist
      if (index === 4 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'ครุภัณฑ์สำนักงาน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์คอมพิวเตอร์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์การเกษตร', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์โฆษณาและเผยแพร่', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์งานบ้านงานครัว', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์ยานพาหนะและขนส่ง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์วิทยาศาสตร์และการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์ไฟฟ้าและวิทยุ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'วัสดุการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ครุภัณฑ์อื่นๆ (ต่ำกว่าเกณฑ์)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },     
          { name: 'ที่ดินและสิ่งกอสรางของโรงพยาบาลและหนวยบริการสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ซ่อมแซมหลังคาห้องฉุกเฉิน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
           { name: 'อื่นๆ................................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to sixth row (ค่าใช้สอย) if it doesn't exist
      if (index === 5 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'ค่าจ้างเหมาบริการผู้ช่วยทันตกรรม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'จ้างเหมาบริการแม่บ้าน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาบริการคนสวน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'จ้างเหมาบริการเจ้าหน้าที่การเงิน การบัญชี', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'จ้างเหมาบริการเจ้าหน้าที่ธุรการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'จ้างเหมาบริการนักวิชาการสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'จ้างเหมาบริการ ผู้ช่วยแพทย์แผนไทย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเก็บขนและกำจัดขยะติดเชื้อ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมยานพาหนะ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์ทางการแพทย์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์ไฟฟ้า', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซอมแซมครุภัณฑ์สำนักงาน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมครุภัณฑ์งานบ้านงานครัว', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซอมแซมครุภัณฑ์คอมพิวเตอร์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมสิ่งก่อสร้าง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมเครื่องปรับอากาศ…………..', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาซ่อมแซมรั้ว ห้องบริการ อื่นๆ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างเหมาบริการอื่น ๆ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to seventh row (ค่าสาธารณูปโภค) if it doesn't exist
      if (index === 6 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'ไฟฟ้า', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ประปา', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'โทรศัพท์', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าบริการสื่อสารและโทรนาคม', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าเก็บขนและกำจัดขยะมูลฝอย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'อื่นๆ .............................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to eighth row (ค่าจ้างลูกจ้างชั่วคราว) if it doesn't exist
      if (index === 7 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'ค่าจ้างลูกจ้างกลุ่มวิชาชีพ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'พยาบาล', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'นักวิชาการสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'เจ้าพนักงานสาธารณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ทันตสาธาณณสุข', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'แพทย์แผนไทย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างลูกจ้างกลุ่มสนับสนุนบริการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างลูกจ้างบันทึกข้อมูล', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างลูกจ้างผู้ช่วยเหลือคนไข้ (ผู้ช่วยเจ้าหน้าที่สาธารณสุข)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างลูกจ้างทำความสะอาด พนักงานขับรถ  คนสวน  (พนักงานทั่วไป)', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าจ้างผู้ช่วยแพทย์แผนไทย…….', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'อื่น ๆ (ระบุ) ..............................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to ninth row (ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ) if it doesn't exist
      if (index === 8 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'ค่าตอบแทนปฏิบัติงานนอกเวลาราชการและวันหยุดราชการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าตอบแทนปฏิบัติงานเชิงรุก', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'อื่นๆ..........................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to tenth row (ค่าใช้จ่ายการเดินทางไปราชการ/ค่าใช้จ่ายในการเข้ารับการฝึกอบรม) if it doesn't exist
      if (index === 9 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'ค่าใช้จ่ายในการเดินทางไปราชการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าเบี้ยเลี้ยง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าพาหนะ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าลงทะเบียน', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าที่พัก', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'อื่นๆ ..........................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }

      // Add default sub-rows to eleventh row (ค่าใช้จ่ายอื่นที่จำเป็นที่เกี่ยวข้องกับการสาธารณสุข) if it doesn't exist
      if (index === 10 && (!row.subRows || row.subRows.length === 0)) {
        row.subRows = [
          { name: 'เงินสมทบประกันสังคมส่วนของนายจ้าง', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ภาษีหัก ณ ที่จ่าย', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย สำหรับ พกส/ลูกจ้างชั่วคราว', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'ค่าตอบแทนเบี้ยเลี้ยงเหมาจ่าย สำหรับข้าราชการ', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false },
          { name: 'อื่น (ระบุ)...................................', budget_op: 0, budget_fund: 0, oct: 0, nov: 0, dec: 0, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, total: 0, hidden: false }
        ];
        
        // Calculate main row values from sub-rows
        this.calculateMainRowFromSubRows(index);
      }
    });
  }

  getAllSavedYears(): string[] {
    // Find all keys matching allPlanRows-<year>
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

  private calculationTimeout: any = null;

  updateTotal(row: any) {
    const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
    let sum = 0;
    for (const m of months) {
      const val = parseFloat(row[m] || '0');
      if (!isNaN(val)) {
        sum += val;
      }
    }
    row.total = sum;
    // Debounce the summary calculation
    if (this.calculationTimeout) {
      clearTimeout(this.calculationTimeout);
    }
    this.calculationTimeout = setTimeout(() => {
      this.calculateSummary();
      this.calculationTimeout = null;
    }, 100);
  }

  clearAll() {
    const keys = [
      'budget_op', 'budget_fund', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar',
      'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'total'
    ];

    if (!Array.isArray(this.planRows)) return;

    this.planRows.forEach(row => {
      // Preserve structural keys like 'item', 'subRows', 'subRowsCollapsed'
      keys.forEach(k => row[k] = '');

      // If the row has subRows, clear their data too but keep the subRows array
      if (Array.isArray(row.subRows)) {
        row.subRows.forEach((sub: any) => {
          keys.forEach(k => sub[k] = '');
        });
      }
    });

    // Recalculate derived totals/summary
    this.calculateSummary();
  }

  calculateSummary() {
    const keys = [
      'budget_op', 'budget_fund', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar',
      'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'total'
    ];
    this.summary = {};
    keys.forEach(key => {
      this.summary[key] = this.planRows.reduce((sum, row) => {
        // Only sum main rows (skip subRows themselves)
        if (row && row.hasOwnProperty('item')) {
          return sum + (parseFloat(row[key]) || 0);
        }
        return sum;
      }, 0);
    });
  }

  exportToCSV() {
    // Define columns for export (including headers in Thai)
    const headers = [
      'ลำดับที่',
      'รายการ',
      'งบประมาณ อปท.',
      'เงินบำรุง',
      'ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.',
      'รวม'
    ];
    const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
    // Map planRows to CSV rows
    const rows = this.planRows.map((row, idx) => [
      (idx + 1).toString(),
      row.item || '',
      row.budget_op || '',
      row.budget_fund || '',
      ...months.map(m => row[m] || ''),
      row.total || ''
    ]);
    // Add summary row
    const summaryRow = [
      '',
      'รวม',
      this.summary['budget_op'] || '',
      this.summary['budget_fund'] || '',
      ...months.map(m => this.summary[m] || ''),
      this.summary['total'] || ''
    ];
    // Combine all rows
    const csvData = [headers, ...rows, summaryRow]
      .map(r => r.map(val => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    // Download as CSV
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hospital_budget_plan.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  calculateSubRowTotal(sub: any, rowIndex: number) {
    const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
    let total = 0;
    
    for (const month of months) {
      const value = parseFloat(sub[month]) || 0;
      total += value;
    }
    
    sub.total = total;
    this.calculateMainRowFromSubRows(rowIndex);
  }

  calculateMainRowFromSubRows(rowIndex: number) {
    const row = this.planRows[rowIndex];
    if (!row || !row.subRows) return;

    const months = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
    
    // Initialize totals
    let totalBudgetOp = 0;
    let totalBudgetFund = 0;
    let monthlyTotals: any = {};
    let grandTotal = 0;

    // Sum all sub-rows
    for (const sub of row.subRows) {
      if (!sub.hidden) {
        totalBudgetOp += parseFloat(sub.budget_op) || 0;
        totalBudgetFund += parseFloat(sub.budget_fund) || 0;
        
        for (const month of months) {
          if (!monthlyTotals[month]) monthlyTotals[month] = 0;
          monthlyTotals[month] += parseFloat(sub[month]) || 0;
        }
        
        grandTotal += parseFloat(sub.total) || 0;
      }
    }

    // Update main row with calculated totals
    row.budget_op = totalBudgetOp;
    row.budget_fund = totalBudgetFund;
    
    for (const month of months) {
      row[month] = monthlyTotals[month] || 0;
    }
    
    row.total = grandTotal;
    
    // Update summary
    this.calculateSummary();
  }

  saveData() {
    if (!this.planYear || !/^\d{4}$/.test(this.planYear)) {
      alert('กรุณาระบุปีงบประมาณให้ถูกต้อง');
      return;
    }

    // Check if all sub-rows are empty or missing
    const allSubRowsEmpty = this.planRows.every(row => {
      if (!row.subRows || row.subRows.length === 0) return true;
      // Check if every sub-row in this row is empty (all fields blank or zero)
      return row.subRows.every((sub: any) => {
        // Check if all relevant fields are empty/zero/blank
        return [
          'name','budget_op','budget_fund','oct','nov','dec','jan','feb','mar','apr','may','jun','jul','aug','sep','total'
        ].every(key => !sub[key] || sub[key] === 0 || sub[key] === '0');
      });
    });
    if (allSubRowsEmpty) {
      const confirmed = confirm('ยังไม่มีข้อมูลในรายการย่อย คุณต้องการบันทึกต่อหรือไม่?');
      if (!confirmed) return;
    }

    // Check if there is already saved data for this year in plan-record
    const key = `allPlanRows-${this.planYear}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const overwrite = confirm('มีข้อมูลบันทึกแผนสำหรับปีนี้อยู่แล้ว ต้องการเขียนทับหรือไม่?');
      if (!overwrite) return;
    }

    try {
      const data = {
        rows: this.planRows,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(data));
      alert('บันทึกข้อมูลสำเร็จ');
    } catch (err) {
      console.error('Error saving data:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }

  debugPlanRows() {
    console.log('PlanRows:', this.planRows);
    console.log('First row:', this.planRows[0]);
    console.log('First row subRows:', this.planRows[0]?.subRows);
    console.log('First row subRowsCollapsed:', this.planRows[0]?.subRowsCollapsed);
    
    // Clear localStorage and reinitialize
    if (confirm('Clear localStorage and reinitialize data?')) {
      localStorage.removeItem(`allPlanRows-${this.planYear}`);
      this.initializeDefaultData();
      this.calculateSummary(); // Recalculate summary after reinit
      alert('Data cleared and reinitialized. Sub-row should now appear!');
      console.log('After reinit - First row subRows:', this.planRows[0]?.subRows);
      console.log('After reinit - First row values:', {
        budget_fund: this.planRows[0]?.budget_fund,
        oct: this.planRows[0]?.oct,
        total: this.planRows[0]?.total
      });
    } else {
      alert('Check console for planRows data');
    }
  }

calculateRowTotal(row: any) {
  this.updateTotal(row);
}

onMainRowChange(i: number) {
  this.updateTotal(this.planRows[i]); // If you have a row total calculation
  this.calculateSummary();
}
}