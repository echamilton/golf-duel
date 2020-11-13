import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Messages, ServiceCodes } from './../../models/constants';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.authService.login(this.email, this.password).then(
      (res) => {
        this.email = this.password = '';
        this.openSnackBar(Messages.userLoginSuccess);
        this.router.navigate(['/leader']);
      },
      (err) => {
        const message =
          err.code == ServiceCodes.userFailCode
            ? Messages.userCreateFail
            : err.message;
        this.openSnackBar(message);
      }
    );
  }

  openSnackBar(message: string): void {
    this.config.duration = 3000;
    this.snackBar.open(message, 'Close', this.config);
  }

  forgotPassword(): void {
    this.router.navigate(['/reset']);
  }

  logout(): void {
    this.authService.logout();
  }
}
