import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '../../services/auth.service';
import { Messages } from './../../models/constants';
import { GolfStoreFacade } from './../../store/golf.store.facade';

@Component({
  selector: 'golf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  config = new MatSnackBarConfig();
  hide: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private golfFacade: GolfStoreFacade
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).then(
      () => {
        this.email = this.password = '';
        this.openSnackBar(Messages.userLoginSuccess);
        this.golfFacade.loadUserPicks();
        this.router.navigate(['/leader']);
      },
      (err: FirebaseError) => {
        const message = Messages.userLoginFail;
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
