import {AngularFirestore, DocumentReference} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../dto/user";
import firebase from "firebase/compat";
import {Login} from "../login-dialog/login";
import {UserType} from "../dto/user-type";
import UserCredential = firebase.auth.UserCredential;

export class FirebaseApi {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
  }


  public createUser(user: User): Promise<DocumentReference<any>> {
    return this.firestore.collection('user').add({email: user.email, type: user.type})
  }

  public authenticate(login: Login): Promise<UserCredential> {
    if (login.isRegistering) {
      this.createUser(new User(login.email, UserType.CLIENT))
      return this.auth.createUserWithEmailAndPassword(login.email, login.password)
    } else {
      return this.auth.signInWithEmailAndPassword(login.email, login.password);
    }
  }

  signOut() {
    this.auth.signOut();
  }
}
