import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice';
import { AngularFireDatabase } from 'angularfire2/database';
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
  successMessage: string;
  constructor(private router: Router, public authService: AuthService, private dataB: AngularFireDatabase, ) { }

  ngOnInit() {

  }
  signup() {
    this.authService.signup(this.email, this.password);


    const userProfile = {
      teamName: '',
      email: '',
    };

    userProfile.email = this.email;
    userProfile.teamName = this.team;

    this.dataB.list('userProfile').push(userProfile)
      .then(_ => {
        console.log('success');

      });
    this.email = this.password = '';
    this.successMessage = 'Your account has been created';
  }
}
