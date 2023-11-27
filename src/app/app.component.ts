import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Login} from "./login-dialog/login";
import {FirebaseApi} from "./api/firebase-api";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;
import {provideRouter} from "@angular/router";
import {User} from "./dto/user";
import {cilEnvelopeClosed} from '@coreui/icons'
import {IconSetService} from "@coreui/icons-angular";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'house';
  firebaseApi: FirebaseApi

  constructor(private dialog: MatDialog, private fireModule: AngularFirestore, private auth: AngularFireAuth, inconSet: IconSetService) {

    this.firebaseApi = new FirebaseApi(fireModule, auth)
    inconSet.icons={cilEnvelopeClosed}
    console.log(this.firebaseApi.getAllUsers());
    // Check if user is logged in.
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.openLoginDialog()
      } else {
        localStorage.setItem("currentUser", user.uid)
        console.log(user.uid)
        // This is how you get a user
        this.firebaseApi.getUser(user.uid)
          .then((fetchedUser) => {
            localStorage.setItem('user', JSON.stringify(fetchedUser))
            // These then() statements should be used to set your page's variable
            // This is necessary since stuff is async.

            // This if check whether the fetchedUser is present.
            if (fetchedUser) {
              console.log(fetchedUser.email)
              console.log(fetchedUser.id)
              console.log(fetchedUser.type)

              // THIS IS HOW YOU MODIFY
              /*if (fetchedUser.type) {
                fetchedUser.type = fetchedUser.type === "CLIENT" ? "ADMIN" : "CLIENT"
                this.firebaseApi.updateUser(fetchedUser)
                  .catch((e) => console.log("Something went wrong: " + e))
              }*/

              // THIS IS HOW YOU DELETE
              //this.firebaseApi.deleteUser(fetchedUser)
            }
          })
      }
    })

  }

  isBrokerOrAdmin(): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.fireModule
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

  private openLoginDialog(): void {
    var dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '30%',
      height: '80%'
    });
    dialogRef
      .afterClosed()
      .subscribe((result: Login | undefined) => {
        if (!result) {
          return this.openLoginDialog();
        }
        if (result.email != null && result.password != null) {
          this.firebaseApi.authenticate(result).then(it => {
            if (it.user && result.isRegistering) {
              this.firebaseApi.createUser(it.user.uid, new User(it.user.uid, result.email, result.name, "CLIENT"))
            }
          })
            .catch((error) => {
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

  protected readonly provideRouter = provideRouter;
}
