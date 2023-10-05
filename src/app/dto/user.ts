import {UserType} from "./user-type";

export interface IUser{
  email: string,
  type: UserType
}

export class User implements IUser {
  email: string;
  type: UserType;

  constructor(email: string, type: UserType) {
    this.email = email;
    this.type = type;
  }

}
