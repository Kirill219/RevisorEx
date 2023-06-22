import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../login/auth.service";
import {Router} from "@angular/router";
import {AddUserService} from "./add-user.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
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
    private router: Router,
    private addUserService: AddUserService
    ) {}

  register(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.addUserService.registerUser(userData).subscribe(
        (response) => {
          this.registerForm.reset();
        }
      );
    } else {
      this.errorMessage = 'Користувач вже існує';
    }
  }
}
