import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Messages } from './../../models/constants';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {}

  login(): void {
    this.authService.login(this.email, this.password).then(
      () => {
        this.email = this.password = '';
        this.openSnackBar(Messages.userLoginSuccess);
        this.golfFacade.loadUserPicks();
        this.router.navigate(['/leader']);
      },
      (err: firebase.FirebaseError) => {
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
