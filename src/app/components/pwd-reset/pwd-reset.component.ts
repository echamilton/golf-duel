import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'golf-pwd-reset',
  templateUrl: './pwd-reset.component.html',
  styleUrls: ['./pwd-reset.component.scss']
})
export class PwdResetComponent implements OnInit {
  emailAddress: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  submitPwdReset(): void {
    this.authService.resetPassword(this.emailAddress);
    this.router.navigate(['/leader']);
  }
}
