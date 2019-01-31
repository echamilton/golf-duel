import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-user-comp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(private snackBar: MatSnackBar, private snack: MatSnackBarModule, private router: Router, public authService: AuthService) { }

  ngOnInit() {

  }


  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
    this.router.navigate(['/leader']);
    // this.snackBar.open('You are now logged in!', 'Close'); {
    // }
  }

  logout() {
    this.authService.logout();
  }

}
