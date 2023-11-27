import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser, User} from "../dto/user";
import firebase from "firebase/compat";
import {Login} from "../login-dialog/login";
import {Property} from "../dto/property";
import {from, map, Observable, switchMap} from "rxjs";
import {Offer} from "../dto/offer";
import UserCredential = firebase.auth.UserCredential;
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FirebaseApi {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
  }

  private readonly USER_PATH = 'user';
  private readonly PROPERTY_PATH = 'property';
  private readonly OFFER_PATH = "offers"

  public deleteUser(user: User) {
    // FIXME:: If necessary, we must also delete the entry in the firebase auth system.
    // Currently we can only delete the currently logged in user. This may or may not be a problem.
    return this.firestore.collection(this.USER_PATH).doc(user.id).delete()
      .then(() => this.auth.currentUser?.then(it => {
        if (it?.email === user.email) {
          it?.delete()
        }
      }))
  }

  public deleteProperty(property: Property) {
    return this.firestore.collection(this.PROPERTY_PATH).doc(property.id).delete()
  }

  public createUser(id: string, user: User) {
    return this.firestore.collection(this.USER_PATH).doc(id).set({email: user.email, name: user.name, type: user.type})
  }

  public createProperty(property: Property) {
    const copyProperty = {...property};
    delete copyProperty.id;
    return this.firestore.collection(this.PROPERTY_PATH).add(Object.assign({}, copyProperty)).then((docRef) => docRef.id);
  }

  public updateUser(user: User): Promise<void> {
    return this.firestore.collection(this.USER_PATH)
      .doc(user.id)
      .set({email: user.email, type: user.type, name: user.name})
  }

  public getAllUsers(): User[] {
    let users: User[] = []
    this.firestore.collection(this.USER_PATH)
      .get()
      .subscribe(observer =>
        observer.docs.forEach(userDoc => {
            users.push(User.createUserFromDocumentSnapshot(userDoc.id, userDoc.data()))
          }
        ))
    return users;
  }

  public async getAllProperties(): Promise<Property[]> {
    let properties: Property[] = []
    await this.firestore.collection(this.PROPERTY_PATH)
      .get().forEach(observer =>
        observer.docs.forEach(userDoc => {
            properties.push(Property.createPropertyFromDocumentSnapshot(userDoc.id, userDoc.data()))
          }
        ))
    return properties;
  }

  public getProperty(id: string): Promise<Property>{
    return this.firestore.collection(this.PROPERTY_PATH)
      .doc(id).ref
      .get().then(it => {
        return Property.createPropertyFromDocumentSnapshot(it.id, it.data())
      })
  }

  public createOffer(offer: Offer) {
    return this.firestore.collection(this.OFFER_PATH).doc().set({brokerId: offer.brokerId, userId: offer.userId,propertyId: offer.propertyId, status: offer.status, offer: offer.offer});
  }

  public getPropertiesByBroker(brokerId: string, propertyId:string = ""){
    return this.firestore.collection(this.PROPERTY_PATH)
      .get()
      .pipe(map((querySnapshot) => {
        const properties: any[] =[];
        querySnapshot.forEach(async (doc) => {
          const data = <any>doc.data();
          if(doc.id !== propertyId && data.brokerId === brokerId){
            properties.push(Property.createPropertyFromDocumentSnapshot(doc.id,doc.data()));
          }
        });
        return properties;
      }));
  }

  public async getPropertiesContainingString(searchString: string) {
    const allProperties = await this.getAllProperties();
    const results:Property[] = [];
    searchString = searchString.toUpperCase();
    for(let fullProperty of allProperties){
      let property = { ...fullProperty};
      delete property.nRooms;
      delete property.nBathrooms;
      delete property.nBedrooms;
      delete property.price;

      let broker = await this.getUser(property.brokerId!);
      if(JSON.stringify(property).toUpperCase().includes(searchString) || broker.name?.toUpperCase().includes(searchString)){
        results.push(fullProperty);
      }
    }
    console.log(results);
    return results;
  }

  public async getUser(id: string): Promise<User> {
    const it = await this.firestore.collection(this.USER_PATH)
      .doc(id).ref
      .get();
    return User.createUserFromDocumentSnapshot(it.id, it.data());
  }

public updateProperty(id: string , property:Property ){
    const brokerRef = this.firestore.collection(this.PROPERTY_PATH).doc(id);

    const updatedProperty = { ...property };
    delete updatedProperty.id;

    brokerRef.update(updatedProperty)
      .then(() => {
          console.log('Property updated.');
      });
  }


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

  public async getUserOffers(brokerId: string): Promise<Offer[]> {
    let brokerOffers: Offer[] = [];
    await this.firestore.collection(this.OFFER_PATH,
      offer => offer.where('brokerId', '==', brokerId).where('status', '!=' ,Offer.ACCEPTED)
    ).get().forEach(observer => observer.docs.forEach(offerDoc => {
      brokerOffers.push(Offer.createOfferFromDocumentSnapshot(offerDoc.id, offerDoc.data()))
    }))
    return brokerOffers;
  }

  updateOffer(offer: Offer) : Promise<void> {
    return this.firestore.collection(this.OFFER_PATH)
      .doc(offer.id)
      .update({
        brokerId: offer.brokerId,
        propertyId: offer.propertyId,
        price: offer.offer,
        status: offer.status,
        userId: offer.userId
      })
  }

  public registerBroker(brokerEmail: string, brokerPassword: string, brokerName: string): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(brokerEmail, brokerPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          const userData = {
            name: brokerName,
            email: brokerEmail,
            type: "BROKER"
          };

          return this.firestore.collection(this.USER_PATH).doc(user.uid).set(userData);
        } else {
          console.error('User is null. Cannot set data.');
          return Promise.reject('User is null. Cannot set data.');
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        return Promise.reject(error);
      });
  }
}
