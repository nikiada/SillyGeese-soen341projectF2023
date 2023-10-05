import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Login} from "./login-dialog/login";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'house';

  constructor(private dialog: MatDialog, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
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
          this.authenticate(result).catch((error) => {
            console.log(error.message)
            window.alert(error.message)
            return this.openLoginDialog();
          });
        } else {
          return this.openLoginDialog();
        }
      });
  }

  private authenticate(login: Login): Promise<UserCredential> {
    if (login.isRegistering) {
      return this.auth.createUserWithEmailAndPassword(login.email, login.password);
    } else {
      return this.auth.signInWithEmailAndPassword(login.email, login.password);
    }
  }

  public logout() {
    this.auth.signOut();
  }
}
