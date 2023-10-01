import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'golf-pwd-reset',
  templateUrl: './pwd-reset.component.html',
  styleUrls: ['./pwd-reset.component.scss']
})
export class PwdResetComponent {
  emailAddress: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  submitPwdReset(): void {
    this.authService.resetPassword(this.emailAddress);
    this.router.navigate(['/leader']);
  }
}
