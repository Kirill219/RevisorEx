import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(6))
  });

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.authService.login(email!, password!).subscribe({
      next: response => {
        localStorage.setItem('token', response.token);
        if (localStorage.getItem('token')) {
          if (response.user.role === 'Адмін') {
            this.router.navigate(['/addUser']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          console.error('Token not found in localStorage');
        }
      },
      error: () => {
        this.errorMessage = 'Помилка, не вдалося знайти користувача';
      }
    });
  }
}
