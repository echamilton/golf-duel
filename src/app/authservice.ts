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
        return new Promise<any>((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
                .then(res => {
                    resolve(res);
                }, err => reject(err))
        })
    }

    getCurrentUser() {
        if (this.user == undefined) {
            this.user = localStorage.getItem('user');
            console.log(this.user);
        }
        return this.user;
    }

    login(email: string, password: string) {
        return new Promise<any>((resolve, reject) => {
            this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    localStorage.setItem('user', email);
                    resolve(res);
                }, err => reject(err))
        })
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();
        this.user = '';
    }
}
