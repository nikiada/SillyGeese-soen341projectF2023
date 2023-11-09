import {Component, OnInit} from '@angular/core';
import {Offer} from "../dto/offer";
import {FirebaseApi} from "../api/firebase-api";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../dto/user";

import {cilContact, cilHouse, cilDollar, cilTask} from '@coreui/icons'
import {IconSetService} from "@coreui/icons-angular";
import {Property} from "../dto/property";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  firebaseApi: FirebaseApi;
  offers: Offer[] = [];
  dispOffers: Offer[] = [];
  user?: User

  async ngOnInit() {
    let uid = localStorage.getItem("currentUser");
    this.offers = await this.firebaseApi.getUserOffers(uid!!);
    this.offers.forEach( async offer =>{
      let client: User = await this.firebaseApi.getUser(offer!!.userId!!)
      let property: Property = await this.firebaseApi.getProperty(offer!!.propertyId!!)
      let offerCopy: Offer = offer;
      offerCopy.userId = client.name;
      offerCopy.propertyId = property.address
      this.dispOffers.push(offerCopy)
    })
    console.log(this.offers)
  }

  constructor(private storage: AngularFirestore, private auth: AngularFireAuth, inconSet: IconSetService) {
    this.firebaseApi = new FirebaseApi(storage, auth);
    inconSet.icons = {cilContact, cilHouse, cilDollar, cilTask};
  }

  acceptOffer(offer: Offer){
    offer.status = "ACCEPTED";
    this.firebaseApi.updateOffer(offer)
      .then(() =>window.alert("Offer accepted!"))
      .catch((e) => window.alert("Error: " + e));
  }

  refuseOffer(offer: Offer){
    offer.status = "REJECTED";
    this.firebaseApi.updateOffer(offer).then(() =>window.alert("Offer rejected!"));
  }
}
