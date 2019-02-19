import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public user: string;
    constructor(private firebaseAuth: AngularFireAuth) {
    }

    signup(email: string, password: string) {
        email.toLowerCase();
        return new Promise<any>((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
                .then(res => {
                    localStorage.setItem('user', email);
                    this.user = email;
                    resolve(res);
                }, err => reject(err));
        });
    }

    getCurrentUser() {
        if (this.user === undefined) {
            this.user = localStorage.getItem('user');
        }
        return this.user.toLowerCase();
    }

    login(email: string, password: string) {
        email.toLowerCase();
        return new Promise<any>((resolve, reject) => {
            this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    localStorage.setItem('user', email);
                    this.user = email;
                    resolve(res);
                }, err => reject(err));
        });
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();
        this.user = '';
        localStorage.removeItem('user');
    }
}
