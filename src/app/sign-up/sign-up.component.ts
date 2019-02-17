import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { IMsgHandle } from '../models';
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
    let response = {} as IMsgHandle;
    response = this.authService.signup(this.email, this.password);
    this.email = this.password = '';
    this.openSnackBar(response.success, response.message);
    if (response.success === true) {
      this.router.navigate(['/leader']);
    } else {
      console.log(response.message);
    }
  }

  openSnackBar(success:boolean, message: string) {
    let text: string;
    text = '';
    if (success === true) {
      text = 'Your account has been created';
    } else {
      text = message;
    }
    this.config.duration = 2500;
    this.snackBar.open(text, 'Close', this.config);
  }
}
