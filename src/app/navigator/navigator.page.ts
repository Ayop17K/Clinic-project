import { Component, OnInit, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.page.html',
  styleUrls: ['./navigator.page.scss'],
  standalone: false // This is not a standalone component
})
export class NavigatorPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.isAdmin) {
      this.router.navigate(['/login']); // or show an error
      return;
    }
  }


  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

  confirmClear() {
    // Stub: implement if needed
  }

  saveData() {
    // Stub: implement if needed
  }

}

@NgModule({
  declarations: [NavigatorPage],
  imports: [
    IonicModule,
    RouterModule, // <-- Add this line
    // ...other modules
  ]
})
export class NavigatorPageModule {}
