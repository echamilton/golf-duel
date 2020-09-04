import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }
}
