import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
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

  constructor(private router: Router, public authService: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
    this.openSnackBar();
    this.router.navigate(['/leader']);
  }

  openSnackBar() {
    this.config.duration = 2500;
    this.snackBar.open('You have logged in', 'Close', this.config);
  }

  logout() {
    this.authService.logout();
  }
}
