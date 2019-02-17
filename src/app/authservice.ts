import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { IMsgHandle } from './models';
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
        let response: IMsgHandle;
        this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(value => {
                this.user = value;
                response.success = true;
                response.message = 'Created user';
            })
            .catch(err => {
                response.success = false;
                response = err.message;
            });
        return response;
    }


    getCurrentUser() {
        if (this.user !== undefined) {
            return this.user.user.email;
        }
    }

    login(email: string, password: string) {
        this.firebaseAuth
            .auth
            .signInWithEmailAndPassword(email, password)
            .then(value => {
                this.user = value;
                return true;
            })
            .catch(err => {
                console.log('Something went wrong:', err.message);
                return false;
            });
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();
        this.email = '';
        this.user = undefined;
    }
}
