import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../login/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errorMessage: string = '';
  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    secondName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router) {}

  register(): void {
    if (this.registerForm.valid) {
      const emailData = `Ім'я: ${this.registerForm.value.secondName} ${this.registerForm.value.firstName}\n` +
        `Пошта: ${this.registerForm.value.email}\n` +
        `Назва Служби: ${this.registerForm.value.company}\n` +
        `Пароль: ${this.registerForm.value.password}\n` +
        `Роль: ${this.registerForm.value.role}`;

      window.open(`mailto:kirilich219@gmail.com?subject=Запит на створення облікового запису&body=${encodeURIComponent(emailData)}`);
      this.router.navigate(['']);
    } else {
      this.errorMessage = 'Сталося помилка, спробуйте ще';
    }
  }
}
