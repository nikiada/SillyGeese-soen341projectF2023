import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentReference, DocumentSnapshot
} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser, User} from "../dto/user";
import firebase from "firebase/compat";
import {Login} from "../login-dialog/login";
import {UserType} from "../dto/user-type";
import UserCredential = firebase.auth.UserCredential;
import {Observable} from "rxjs";
import {Optional} from "@angular/core";

export class FirebaseApi {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
  }


  public createUser(id: string, user: User) {
    return this.firestore.collection('user').doc(id).set({email: user.email, type: user.type})
  }

  public getAllUsers(): User[] {
    let users: User[] = []
    this.firestore.collection('user')
      .get()
      .subscribe(observer =>
        observer.docs.forEach(userDoc => {
            users.push(User.createUserFromDocumentSnapshot(userDoc.id, userDoc.data()))
          }
        ))
    return users;
  }

  public getUser(id: string): Promise<IUser | void> {
    return this.firestore.collection('user')
      .doc(id).ref
      .get().then(it => {
        console.log(it.get('email'))
        return User.createUserFromDocumentSnapshot(it.id, it.data())
      })
      .catch(() => console.log("user not found"))
  }


  /*public getUser(): User {

  }*/

  /*public updateUser(user: User) : Promise<DocumentReference<any>> {

  }*/

  public authenticate(login: Login): Promise<UserCredential> {
    if (login.isRegistering) {
      return this.auth.createUserWithEmailAndPassword(login.email, login.password)
    } else {
      return this.auth.signInWithEmailAndPassword(login.email, login.password);
    }
  }

  signOut() {
    this.auth.signOut();
  }
}
