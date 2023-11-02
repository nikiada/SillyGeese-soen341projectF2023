import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser, User} from "../dto/user";
import firebase from "firebase/compat";
import {Login} from "../login-dialog/login";
import UserCredential = firebase.auth.UserCredential;
import {Property} from "../dto/property";
import {Observable} from "rxjs";

export class FirebaseApi {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
  }

  private readonly USER_PATH = 'user';
  private readonly PROPERTY_PATH = 'property';


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
    return this.firestore.collection(this.USER_PATH).doc(id).set({email: user.email, type: user.type})
  }

  public createProperty(id: string, address: string, brokerId: string, details: string, nBathrooms: number, nBedrooms: number,
                        nRooms: number,postalCode: string,price: number, propertyType: string,yearBuilt: number) {
    return this.firestore.collection(this.PROPERTY_PATH).doc(id)
      .set({address: address, 
        brokerId: brokerId, 
        details: details,
        nBathrooms: nBathrooms, 
        nBedrooms: nBedrooms, 
        nRooms: nRooms,
        postalCode: postalCode,
        price: price,
        propertyType: propertyType,
        yearBuilt: yearBuilt
        })
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

  public async getAllPropertiesByPrice(minPrice:number, maxPrice:number):Promise<Property[]>{
    return new Promise<any>((resolve)=> {
          this.firestore.collection(this.PROPERTY_PATH, ref => ref.where('price', '<=', maxPrice).where('price', '>=', minPrice)).valueChanges().subscribe(supplier => resolve(supplier))
        })
  }

  public getUser(id: string): Promise<IUser | void> {
    return this.firestore.collection(this.USER_PATH)
      .doc(id).ref
      .get().then(it => {
        return User.createUserFromDocumentSnapshot(it.id, it.data())
      })
      .catch(() => console.log("user not found"))
  }

  public updateProperty(id: string | undefined, address: string, details: string, nBathrooms: number, nBedrooms: number,
    nRooms: number,postalCode: string,price: number, propertyType: string,yearBuilt: number): Promise<void> {
    return this.firestore.collection(this.PROPERTY_PATH)
      .doc(id)
      .set({address: address, 
        details: details,
        nBathrooms: nBathrooms, 
        nBedrooms: nBedrooms, 
        nRooms: nRooms,
        postalCode: postalCode,
        price: price,
        propertyType: propertyType,
        yearBuilt: yearBuilt
        })
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
