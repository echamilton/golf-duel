import { Injectable } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { INITIALIZED_VALUE } from './../models/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string = INITIALIZED_VALUE;
  private auth: Auth;
  constructor() {
    this.auth = getAuth();
  }

  signup(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (res) => {
          localStorage.setItem('userId', res.user.uid);
          this.userId = res.user.uid;
          resolve(res);
        },
        (err: FirebaseError) => reject(err)
      );
    });
  }

  getCurrentUser(): string {
    if (this.userId === undefined || this.userId === INITIALIZED_VALUE) {
      const storedUser = localStorage.getItem('userId');
      this.userId = storedUser !== null ? storedUser : INITIALIZED_VALUE;
    }
    return this.userId;
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
          localStorage.setItem('userId', res.user.uid);
          this.userId = res.user.uid;
          resolve(res);
        },
        (err: FirebaseError) => reject(err)
      );
    });
  }

  logout(): void {
    signOut(this.auth);
    this.userId = INITIALIZED_VALUE;
    localStorage.removeItem('userId');
  }
}
