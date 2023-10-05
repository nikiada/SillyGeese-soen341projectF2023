import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";

export class FirebaseApi {
  constructor(private fireModule: AngularFirestore, private auth: AngularFireAuth) {
  }
}
