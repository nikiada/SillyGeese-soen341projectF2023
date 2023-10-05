import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Login} from "./login-dialog/login";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;
import {FirebaseApi} from "./api/firebase-api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'house';
  firebaseApi: FirebaseApi

  constructor(private dialog: MatDialog, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
    this.firebaseApi = new FirebaseApi(fireModule, auth)
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.openLoginDialog()
      }
    })

  }

  private openLoginDialog(): void {
    var dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '270px',
      height: '270px'
    });
    dialogRef
      .afterClosed()
      .subscribe((result: Login | undefined) => {
        if (!result) {
          return this.openLoginDialog();
        }
        if (result.email != null && result.password != null) {
          this.firebaseApi.authenticate(result).catch((error) => {
            console.log(error.message)
            window.alert(error.message)
            return this.openLoginDialog();
          });
        } else {
          return this.openLoginDialog();
        }
      });
  }



  public logout() {
    this.firebaseApi.signOut();
  }
}
