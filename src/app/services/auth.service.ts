import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: string;
  constructor(private firebaseAuth: AngularFireAuth) {}

  signup(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(
        (res) => {
          localStorage.setItem('user', email);
          this.user = email.toLowerCase();
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  getCurrentUser(): string {
    if (this.user === undefined || this.user === null) {
      this.user = localStorage.getItem('user');
      if (this.user !== null) {
        this.user = this.user.toLowerCase();
      }
    }
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  resetPassword(emailAddress: string): any {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.sendPasswordResetEmail(emailAddress).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
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
        (err) => reject(err)
      );
    });
  }

  logout(): void {
    this.firebaseAuth.signOut();
    this.user = null;
    localStorage.removeItem('user');
  }
}
