import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
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
  config = new MatSnackBarConfig();

  constructor(private router: Router, public authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
    this.openSnackBar();
    this.router.navigate(['/leader']);
  }

  openSnackBar() {
    this.config.duration = 2500;
    this.snackBar.open('Your account has been created', 'Close', this.config);
  }

}
