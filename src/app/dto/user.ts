import firebase from "firebase/compat";

export interface IUser {
  id?: string
  email?: string,
  name?: string,
  type?: string
}

export class User implements IUser {
  id?: string
  email?: string;
  name?: string;
  type?: string;

  constructor(id?: string, email?: string,name?: string, type?: string ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.type = type;
  }

  public static createUserFromDocumentSnapshot(id?: string, doc?: any): IUser {
    return new User(
      id,
      doc.email,
      doc.name,
      doc.type
    )
  }

}
