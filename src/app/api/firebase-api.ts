import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser, User} from "../dto/user";
import firebase from "firebase/compat";
import {Login} from "../login-dialog/login";
import UserCredential = firebase.auth.UserCredential;
import {Property} from "../dto/property";
import {lastValueFrom, map, Observable} from "rxjs";
import {Offer} from "../dto/offer";
import {doc} from "@angular/fire/firestore";

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

  public deleteProperty(property: Property){
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
      .set({email: user.email, type: user.type})
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
  public getPropertiesContainingString(searchString: string){
    return this.firestore.collection(this.PROPERTY_PATH)
      .get()
      .pipe(map((querySnapshot) => {
        const properties: any[] =[];
        querySnapshot.forEach(async (doc) => {
          const data = <any>doc.data();
          for(const key in data){
            if(key === "price" || key === "nRooms" || key === "nBedrooms" || key === "nBathrooms"){
              continue;
            }
            if(key === "brokerId"){
              let brokerRef =  await this.getUser(data[key]);
              if(brokerRef){
                let broker = <IUser> brokerRef;
                if(broker.name?.toUpperCase().includes(searchString.toUpperCase()) || broker.email?.toUpperCase().includes(searchString.toUpperCase())){
                  properties.push(Property.createPropertyFromDocumentSnapshot(doc.id, doc.data()));
                  //console.log(properties);
                  break;
                }
              }

            }else{
              if(data.hasOwnProperty(key) && (data[key].toString().toUpperCase()).includes(searchString.toUpperCase())){
                properties.push(Property.createPropertyFromDocumentSnapshot(doc.id, doc.data()));
                break;
              }
            }

          }
        });
        return properties;
      }));
  }

  public getUser(id: string): Promise<IUser | void> {
    return this.firestore.collection(this.USER_PATH)
      .doc(id).ref
      .get().then(it => {
        return User.createUserFromDocumentSnapshot(it.id, it.data())
      })
      .catch(() => console.log("user not found"))
  }
  public getProperty(id: string): Promise<Property>{
    return this.firestore.collection(this.PROPERTY_PATH)
      .doc(id).ref
      .get().then(it => {
        return Property.createPropertyFromDocumentSnapshot(it.id, it.data())
      })
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

}
