import {Component, OnInit} from '@angular/core';
import {user} from "@angular/fire/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IconSetService} from '@coreui/icons-angular';
import {cilBath, cilBed, cilRoom} from '@coreui/icons';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FirebaseApi} from "../api/firebase-api";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Property} from "../dto/property";
import {from, lastValueFrom, Observable, ObservedValueOf, of} from "rxjs";

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

    this.images = await this.loadImagesForProperties();
    this.images.forEach((img) => {
      for (let i = 0; i < img.length; i++) {
        img[i] = {src: img[i]}
      }
    });
    console.log(this.images);

  }

  constructor(private storage: AngularFireStorage, public iconSet: IconSetService, private db: AngularFirestore, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
    iconSet.icons = {cilBed, cilBath, cilRoom};
    this.firebaseApi = new FirebaseApi(fireModule, auth);
  }
  async loadImagesForProperties() {
    const  images = new Map<string, string[]>();

    for (const property of this.properties) {
      if (property.id != null) {
        const urls:string[] = await lastValueFrom(this.getImagesForChosenRestaurant(property.id) ?? []);
        images.set(property.id, urls);
      }
    }
    return images;
  }
  getImagesForChosenRestaurant(id: string): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      const imageRef = this.storage.ref('images/' + id + '/');
      imageRef.listAll().subscribe(
        (listAllResult) => {
          const imagesDownloadUrlsPromises = listAllResult.items.map((item) =>
            item.getDownloadURL()
          );
          Promise.all(imagesDownloadUrlsPromises)
            .then((downloadUrls) => {
              observer.next(downloadUrls);
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
  getImageUrls(id:string): any[]{
    return this.images.get(id) || [];
  }
}
