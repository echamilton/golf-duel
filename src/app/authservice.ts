import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public user: firebase.User;
    public authState$: Observable<firebase.User>;
    public email: string;
    public user1: any;
    constructor(private firebaseAuth: AngularFireAuth) {
        this.user = null;

        // this.authState$ = firebaseAuth.authState;
        // this.authState$.subscribe((user: firebase.User) => {
        //     this.user = user;
        //     if (this.user != undefined) {
        //         this.email = this.user.email;
        //     }
        // });
    }

    signup(email: string, password: string) {
        this.firebaseAuth
            .auth
            .createUserWithEmailAndPassword(email, password)
            .then(value => {
                this.user1 = value;
            })
            .catch(err => {
                console.log('Something went wrong:', err.message);
            });
    }

    getCurrentUser() {
        if(this.user1 != undefined){
            return this.user1.user.email;
        }
    }

    login(email: string, password: string) {
        this.firebaseAuth
            .auth
            .signInWithEmailAndPassword(email, password)
            .then(value => {
                this.user1 = value;
                return true;
            })
            .catch(err => {
                console.log('Something went wrong:', err.message);
            });
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();
        this.email = '';
        this.user1 = undefined;

    }

    isUserLoggedIn(): Observable<boolean> {
        return this.firebaseAuth.authState.pipe(map(user => user !== null));
    }
}
