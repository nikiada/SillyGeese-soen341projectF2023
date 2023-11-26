import { CanActivateFn } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from './dto/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.firestore
            .collection('user')
            .doc(user.uid)
            .get()
            .pipe(
              map((doc) => {
                let userData: User = User.createUserFromDocumentSnapshot(user.uid, doc.data()); 
                return userData?.type === 'BROKER' || userData?.type === 'ADMIN';
              })
            )
            .subscribe((isBrokerOrAdmin) => {
              if (isBrokerOrAdmin) {
                resolve(true);
              } else {
                console.log('Access denied. User is not a broker or admin.');
                resolve(false);
              }
            });
        } else {
          console.log('Access denied. User is not authenticated.');
          resolve(false);
        }
      });
    });
  }
}