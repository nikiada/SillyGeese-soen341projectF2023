import {Component, OnInit} from '@angular/core';
import {user} from "@angular/fire/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IconSetService} from '@coreui/icons-angular';
import {cilBath, cilBed, cilRoom} from '@coreui/icons';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FirebaseApi} from "../api/firebase-api";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Property} from "../dto/property";

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  protected readonly user = user;
  firebaseApi: FirebaseApi;
  properties: Property[] = [];
  images = new Map<string, any[]>();

  async ngOnInit() {

    this.properties = await this.firebaseApi.getAllProperties();

    for (const property of this.properties) {
      if (property.id != null) {
        await this.getFileList(property.id)
        console.log("TESTS " + this.images)
      }
    }
    console.log(this.properties[0].brokerId);
  }

  constructor(private storage: AngularFireStorage, public iconSet: IconSetService, private db: AngularFirestore, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
    iconSet.icons = {cilBed, cilBath, cilRoom};
    this.firebaseApi = new FirebaseApi(fireModule, auth);

  }

  async getFileList(listingId: string) {
    const ref = this.storage.ref('images/' + listingId + '/');
    let urls: String[] = [];
    await ref.listAll().forEach((value) => {
      value.items.forEach(async (file) => {
        let url: String = await file.getDownloadURL();
        urls.push(url)
      })
    })
    this.images.set(listingId, urls);
  }
}
