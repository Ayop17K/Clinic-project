import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-financial-plans',
  templateUrl: './financial-plans.page.html',
  styleUrls: ['./financial-plans.page.scss'],
  standalone: false // This is not a standalone component
})
export class FinancialPlansPage implements OnInit {
  planName: string = '';
  planSaved: boolean = false;
  planDate: string = '';
  showDatePicker: boolean = false;
  editIndex: number | null = null;
  today = new Date();
  selectedYear: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/login']); // or show an error
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['edit'] !== undefined) {
        const index = +params['edit'];
        const existing = localStorage.getItem('financial_plans');
        const plans = existing ? JSON.parse(existing) : [];
        const plan = plans[index];
        if (plan) {
          this.editIndex = index;
          this.planName = plan.name;
          this.planDate = plan.date;
        }
      }
    });
  }

  savePlan() {
    const existing = localStorage.getItem('financial_plans');
    let plans: { name: string, date: string }[] = existing ? JSON.parse(existing) : [];
    const nowDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (this.planName.trim()) {
      const dateToSave = this.planDate && this.planDate.trim() !== '' ? this.planDate : nowDate;
      if (this.editIndex !== null) {
        plans[this.editIndex] = {
          name: this.planName.trim(),
          date: dateToSave
        };
        this.editIndex = null;
      } else {
        plans.push({
          name: this.planName.trim(),
          date: dateToSave
        });
      }
      localStorage.setItem('financial_plans', JSON.stringify(plans));
      this.planSaved = true;
      setTimeout(() => this.planSaved = false, 2000);
      this.planName = '';
      this.planDate = '';
      this.router.navigate(['/records']); // Optional: redirect after save
    }
  }

  resetDateToNow() {
    this.planDate = new Date().toISOString().slice(0, 10);
  }

  get savedEntries(): { name: string, date: string }[] {
    const existing = localStorage.getItem('financial_plans');
    return existing ? JSON.parse(existing) : [];
  }

  get filteredEntries() {
    if (!this.selectedYear) return this.savedEntries;
    return this.savedEntries.filter((entry: { name: string, date: string }) => {
      if (!entry.date) return false;
      const entryYear = entry.date.length >= 4 ? entry.date.slice(0, 4) : entry.date;
      return entryYear === this.selectedYear;
    });
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
}
