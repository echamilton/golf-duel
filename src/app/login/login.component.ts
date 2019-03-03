import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { Messages, ServiceCodes } from '../constants';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-comp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  config = new MatSnackBarConfig();

  constructor(private router: Router, public authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.email, this.password)
      .then(res => {
        this.email = this.password = '';
        this.openSnackBar(Messages.userLoginSuccess);
        this.router.navigate(['/leader']);
      }, err => {
        const message = err.code == ServiceCodes.userFailCode ? Messages.userCreateFail : err.message;
        this.openSnackBar(message);
      });
  }

  openSnackBar(message: string) {
    this.config.duration = 3000;
    this.snackBar.open(message, 'Close', this.config);
  }

  logout() {
    this.authService.logout();
  }
}
