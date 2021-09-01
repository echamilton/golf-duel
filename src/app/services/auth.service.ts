import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { INITIALIZED_VALUE } from './../models/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: string = INITIALIZED_VALUE;
  constructor(private firebaseAuth: AngularFireAuth) {}

  signup(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(
        (res) => {
          localStorage.setItem('user', email);
          this.user = email.toLowerCase();
          resolve(res);
        },
        (err: firebase.FirebaseError) => reject(err)
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
      this.firebaseAuth.sendPasswordResetEmail(emailAddress).then(
        (res) => {
          resolve(res);
        },
        (err: firebase.FirebaseError) => reject(err)
      );
    });
  }

  login(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password).then(
        (res) => {
          localStorage.setItem('user', email);
          this.user = email.toLowerCase();
          resolve(res);
        },
        (err: firebase.FirebaseError) => reject(err)
      );
    });
  }

  logout(): void {
    this.firebaseAuth.signOut();
    this.user = INITIALIZED_VALUE;
    localStorage.removeItem('user');
  }
}
