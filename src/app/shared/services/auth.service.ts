import { Injectable, NgZone } from '@angular/core';
import { User } from '../../models/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { first } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router, public ngZone: NgZone  ) {

    this.afAuth.authState.subscribe((user) => {
      if(user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      }
      else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!)
      }
    });
   }
   

  // user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  async returnUserId() {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    return user.uid;
  }

   // Update Profile
   async updateProfile(changedDisplayName: string){
    const profile = {
      displayName: changedDisplayName
    }
    location.reload;
    return (await this.afAuth.currentUser).updateProfile(profile)
   }
   

   // Signing in with email and password - takes email and password as a string and sets the user data in the set user data function and if the user is valid navigates to dashboard
   SignIn(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email,password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if(user) {
            this.router.navigate(['home']);  
          }
        })
      })
   }

   SendVerificationMail(){
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
   }

   SignUp(email: string, password: string){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      })
   }

   // logic for signing out
   SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

   SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  
  
}
