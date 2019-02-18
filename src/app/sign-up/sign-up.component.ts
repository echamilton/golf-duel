import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { Messages, ServiceCodes } from '../constants';
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
  config = new MatSnackBarConfig();

  constructor(private router: Router, public authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  signup() {
    this.authService.signup(this.email, this.password)
      .then(res => {
        this.email = this.password = '';
        this.openSnackBar(Messages.userCreateSuccess);
        this.router.navigate(['/leader']);
      }, err => {
        let message: string;
        if (err.code == ServiceCodes.userFailCode) {
          message = Messages.userCreateFail;
        } else {
          message = err.message;
        }

        this.openSnackBar(message);
      });
  }

  openSnackBar(message: string) {
    this.config.duration = 3000;
    this.snackBar.open(message, 'Close', this.config);
  }
}
