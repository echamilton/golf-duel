import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseError } from '@firebase/util';
import { AuthService } from '../../services/auth.service';
import {
  INITIALIZED_VALUE,
  Messages,
  ServiceCodes
} from '../../models/constants';

@Component({
  selector: 'golf-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  email: string = INITIALIZED_VALUE;
  password: string = INITIALIZED_VALUE;
  config = new MatSnackBarConfig();
  hide: boolean = true;

  constructor(
    private router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  signup(): void {
    this.authService.signup(this.email, this.password).then(
      () => {
        this.email = this.password = INITIALIZED_VALUE;
        this.openSnackBar(Messages.userCreateSuccess);
        this.router.navigate(['/leader']);
      },
      (err: FirebaseError) => {
        const message =
          err.code === ServiceCodes.userFailCode
            ? Messages.userCreateFail
            : err.message;
        this.openSnackBar(message);
      }
    );
  }

  openSnackBar(message: string): void {
    this.config.duration = 3000;
    this.snackBar.open(message, 'Close', this.config);
  }
}
