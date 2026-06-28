import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-financial-plans',
  templateUrl: './financial-plans.page.html',
  styleUrls: ['./financial-plans.page.scss'],
  standalone: false
})
export class FinancialPlansPage implements OnInit {
  planName: string = '';
  planSaved: boolean = false;
  planDate: string = '';
  planDateYear: string = '';   // NEW: year as plain number (พ.ศ.)
  showDatePicker: boolean = false;
  editIndex: number | null = null;
  today = new Date();
  selectedYear: string = '';
  savedEntries: { name: string, date: string }[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadPlans();

    this.route.queryParams.subscribe(params => {
      if (params['edit'] !== undefined) {
        const index = +params['edit'];
        this.loadPlans();
        const plan = this.savedEntries[index];
        if (plan) {
          this.editIndex = index;
          this.planName = plan.name;
          this.planDate = plan.date;
          // Convert stored date/year to Buddhist year for the new input
          this.planDateYear = this.getBuddhistYear(plan.date);
        }
      }
    });
  }

  loadPlans() {
    this.http.get<any[]>('http://localhost:3000/api/financial-plans').subscribe({
      next: (plans) => {
        this.savedEntries = plans || [];
      },
      error: (err) => {
        console.error('Error fetching plans in financial-plans page, using local fallback:', err);
        const existing = localStorage.getItem('financial_plans');
        this.savedEntries = existing ? JSON.parse(existing) : [];
      }
    });
  }

  deletePlan(index: number) {
    this.savedEntries.splice(index, 1);
    this.http.post('http://localhost:3000/api/financial-plans', { plans: this.savedEntries }).subscribe({
      next: () => {
        localStorage.setItem('financial_plans', JSON.stringify(this.savedEntries));
        this.loadPlans();
      },
      error: (err) => {
        console.error('Error deleting plan on backend:', err);
        localStorage.setItem('financial_plans', JSON.stringify(this.savedEntries));
        this.loadPlans();
      }
    });
  }

  editPlan(index: number) {
    const plan = this.savedEntries[index];
    if (plan) {
      this.editIndex = index;
      this.planName = plan.name;
      this.planDateYear = this.getBuddhistYear(plan.date);
    }
  }

  /** Handle year input — convert พ.ศ. to stored ค.ศ. ISO string */
  onYearInput(event: any) {
    const val = event?.detail?.value || this.planDateYear;
    this.planDateYear = val ? val.toString() : '';
  }

  savePlan() {
    if (!this.planName || this.planName.toString().trim() === '') return;
    if (!this.planDateYear || this.planDateYear.toString().trim() === '') return;

    // Store date as the พ.ศ. year string for consistency
    const dateToSave = this.planDateYear.toString().trim();

    if (this.editIndex !== null) {
      this.savedEntries[this.editIndex] = {
        name: this.planName.toString().trim(),
        date: dateToSave
      };
      this.editIndex = null;
    } else {
      this.savedEntries.push({
        name: this.planName.toString().trim(),
        date: dateToSave
      });
    }

    this.http.post('http://localhost:3000/api/financial-plans', { plans: this.savedEntries }).subscribe({
      next: () => {
        localStorage.setItem('financial_plans', JSON.stringify(this.savedEntries));
        this.planSaved = true;
        setTimeout(() => {
          this.planSaved = false;
          this.router.navigate(['/records']);
        }, 1500);

        this.planName = '';
        this.planDate = '';
        this.planDateYear = '';
      },
      error: (err) => {
        console.error('Error saving plan to backend:', err);
        localStorage.setItem('financial_plans', JSON.stringify(this.savedEntries));
        this.planSaved = true;
        setTimeout(() => {
          this.planSaved = false;
          this.router.navigate(['/records']);
        }, 1500);

        this.planName = '';
        this.planDate = '';
        this.planDateYear = '';
      }
    });
  }

  resetDateToNow() {
    const year = new Date().getFullYear() + 543;
    this.planDateYear = year.toString();
    this.planDate = new Date().toISOString().slice(0, 10);
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
    // If already a 4-digit year (could be พ.ศ. already stored)
    if (/^\d{4}$/.test(dateStr)) {
      const num = parseInt(dateStr, 10);
      // If > 2100 it's already พ.ศ., if < 2100 it's ค.ศ. — convert
      return num > 2100 ? num.toString() : (num + 543).toString();
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return (date.getFullYear() + 543).toString();
  }
}
