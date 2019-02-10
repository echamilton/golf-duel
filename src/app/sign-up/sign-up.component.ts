import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  email: string;
  password: string;
  team: string;
  successMessage: string;
  constructor(private router: Router, public authService: AuthService ) { }

  ngOnInit() {
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
    this.successMessage = 'Your account has been created';
    this.router.navigate(['/leader']);
  }
}
