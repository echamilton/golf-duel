import { Injectable } from '@angular/core';
import {
  Auth,
  sendPasswordResetEmail,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';
import { INITIALIZED_VALUE } from './../models/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: string = INITIALIZED_VALUE;
  constructor(private auth: Auth) {}

  signup(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (res) => {
          localStorage.setItem('user', email);
          this.user = email.toLowerCase();
          resolve(res);
        },
        (err: FirebaseError) => reject(err)
      );
    });
  }

  getCurrentUser(): string {
    if (this.user === undefined || this.user === INITIALIZED_VALUE) {
      const storedUser = localStorage.getItem('user');
      this.user =
        storedUser !== null ? storedUser.toLowerCase() : INITIALIZED_VALUE;
    }
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== INITIALIZED_VALUE;
  }

  resetPassword(emailAddress: string): any {
    return new Promise<any>((resolve, reject) => {
      sendPasswordResetEmail(this.auth, emailAddress).then(
        (res) => {
          resolve(res);
        },
        (err: FirebaseError) => reject(err)
      );
    });
  }

  login(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password).then(
        (res) => {
          localStorage.setItem('user', email);
          this.user = email.toLowerCase();
          resolve(res);
        },
        (err: FirebaseError) => reject(err)
      );
    });
  }

  logout(): void {
    signOut(this.auth);
    this.user = INITIALIZED_VALUE;
    localStorage.removeItem('user');
  }
}
