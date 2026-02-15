import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-actual-paid',
  templateUrl: './actual-paid.page.html',
  styleUrls: ['./actual-paid.page.scss'],
  standalone: false // This is not a standalone component
})
export class ActualPaidPage implements OnInit {
  planRows: any[] = [];
  availableYears: string[] = [];
  selectedYear: string = '';

  constructor(private location: Location) { }

  ngOnInit() {
    // Find all years with saved data
    this.availableYears = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      const match = key.match(/^allPlanRows-(\d{4})$/);
      if (match) {
        this.availableYears.push(match[1]);
      }
    }
    this.availableYears = this.availableYears.sort().reverse();
    this.selectedYear = this.availableYears[0] || '';
    this.loadPlanRowsForYear(this.selectedYear);
  }

  onYearChange(event: any) {
    this.loadPlanRowsForYear(this.selectedYear);
  }

  loadPlanRowsForYear(year: string) {
    if (!year) {
      this.planRows = [];
      return;
    }
    const saved = localStorage.getItem(`allPlanRows-${year}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.planRows = (data !== undefined && data.rows) ? data.rows : [];
      } catch {
        this.planRows = [];
      }
    } else {
      this.planRows = [];
    }
  }

  goBack() {
    this.location.back();
  }
}
