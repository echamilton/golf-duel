import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-comp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
    this.router.navigate(['/leader']);
  }

  logout() {
    this.authService.logout();
  }

}
