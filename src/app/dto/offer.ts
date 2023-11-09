import {UserType} from "./user-type";
import firebase from "firebase/compat";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
export class Offer {
  id?: string
  brokerId?: string;
  userId?: string;
  propertyId?: string;
  status?: string;
  offer?: string;

  static readonly PENDING = 'PENDING';
  static readonly REFUSED = 'REFUSED';
  static readonly ACCEPTED = 'ACCEPTED';


  constructor(id?: string,brokerId?: string,userId?: string,propertyId?: string, status?: string, offer?: string ) {
    this.id=id;
    this.brokerId = brokerId;
    this.userId = userId;
    this.propertyId = propertyId;
    this.status = status;
    this.offer = offer;
  }

  public static createUserFromDocumentSnapshot(id?: string, doc?: any): Offer {
    return new Offer(
      id,
      doc.brokerId,
      doc.userId,
      doc.propertyId,
      doc.status,
      doc.offer
    )
  }

}
