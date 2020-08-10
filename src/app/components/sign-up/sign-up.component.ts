import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authservice';
import { Messages, ServiceCodes } from '../../models/constants';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
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
        const message = err.code === ServiceCodes.userFailCode ? Messages.userCreateFail : err.message;
        this.openSnackBar(message);
      });
  }

  openSnackBar(message: string) {
    this.config.duration = 3000;
    this.snackBar.open(message, 'Close', this.config);
  }
}
