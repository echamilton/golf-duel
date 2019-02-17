import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public authState$: Observable<firebase.User>;
    public email: string;
    public user: any;

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
        if (this.user !== undefined) {
            return this.user.user.email;
        }
    }

    login(email: string, password: string) {
        return new Promise<any>((resolve, reject) => {
            this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    this.user = res;
                    resolve(res);
                }, err => reject(err))
        })
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();
        this.email = '';
        this.user = undefined;
    }
}
