import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false // This line can be omitted; default is false
})
export class HomePage {
  username = '';
  password = '';
  loginError = '';
  showPassword = false;
  rememberMe = false;
  isLoading = false;
  usernameError = '';
  passwordError = '';

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearUsername() {
    this.username = '';
    this.usernameError = '';
  }

  validateUsername() {
    if (!this.username) {
      this.usernameError = 'กรุณากรอกชื่อผู้ใช้';
    } else {
      this.usernameError = '';
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = 'กรุณากรอกรหัสผ่าน';
    } else if (this.password.length < 4) {
      this.passwordError = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
    } else {
      this.passwordError = '';
    }
  }

  onLogin() {
    this.isLoading = true;
    this.loginError = '';
    this.validateUsername();
    this.validatePassword();
    
    if (this.usernameError || this.passwordError) {
      this.isLoading = false;
      return;
    }
    
    // Simulate loading delay
    setTimeout(() => {
      if (this.username === 'admin' && this.password === 'admin') {
        this.loginError = '';
        localStorage.setItem('user', JSON.stringify({ username: 'admin', isAdmin: true }));
        this.router.navigate(['/navigator']);
      } else if (this.username === 'user' && this.password === '5678') {
        this.loginError = '';
        localStorage.setItem('user', JSON.stringify({ username: 'user', isAdmin: false }));
        this.router.navigate(['/plan-record']);
      } else {
        this.loginError = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
      }
      this.isLoading = false;
    }, 1000);
  }
}