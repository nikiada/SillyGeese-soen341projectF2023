import {UserType} from "./user-type";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export interface IUser {
  id?: string
  email?: string,
  type?: string
}

export class User implements IUser {
  id?: string
  email?: string;
  type?: string;

  constructor(id?: string, email?: string, type?: string ) {
    this.id = id;
    this.email = email;
    this.type = type;
  }

  public static createUserFromDocumentSnapshot(id?: string, doc?: any): IUser {
    return new User(
      id,
      doc.email,
      doc.type
    )
  }

}
