import {Component, OnInit} from '@angular/core';
import {user} from "@angular/fire/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IconSetService} from '@coreui/icons-angular';
import {cilBath, cilBed, cilRoom, cilListFilter} from '@coreui/icons';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FirebaseApi} from "../api/firebase-api";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Property} from "../dto/property";
import {from, lastValueFrom, Observable, ObservedValueOf, of} from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { ListingFormComponent } from '../listing-form/listing-form.component';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  protected readonly user = user;
  firebaseApi: FirebaseApi;
  properties: Property[] = [];
      properties12: Property[] = [];
  images = new Map<string, any[]>();
  visible = false;
  selectedOption: string = 'properties';


  async ngOnInit() {

    this.properties = await this.firebaseApi.getAllProperties();

    this.images = await this.loadImagesForProperties();
    this.images.forEach((img) => {
      for (let i = 0; i < img.length; i++) {
        img[i] = {src: img[i]}
      }
    });

  }


  constructor(private dialog: MatDialog, private storage: AngularFireStorage, public iconSet: IconSetService, private db: AngularFirestore, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
    iconSet.icons = {cilBed, cilBath, cilRoom, cilListFilter};
    this.firebaseApi = new FirebaseApi(fireModule, auth);
  }
  async loadImagesForProperties() {
    const  images = new Map<string, string[]>();

    for (const property of this.properties) {
      if (property.id != null) {
        let urls:string[] = await lastValueFrom(this.getImagesForChosenRestaurant(property.id) ?? []);
        if(urls.length == 0){
          urls =  await lastValueFrom(this.getDefaultImage())
        }
        images.set(property.id, urls);
      }
    }
    return images;
  }
  getDefaultImage():Observable<string[]>{
    return this.getImagesForChosenRestaurant('default');
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

  toggleCollapse(): void {
    this.visible = !this.visible;
  }
  onSortByChange(select: any): void {
    switch (select.target.value){
      case "price":
        this.properties.sort(function (a, b) {
          return parseInt(a.price ?? "") - parseInt(b.price ?? "");
        });
        break;
      case "title":
        this.properties.sort((a,b) =>
          (a.address ?? "").localeCompare(b.address ?? ""));
        break;
      case "year":
        this.properties.sort(function (a, b) {
          return parseInt(a.yearBuilt ?? "") - parseInt(b.yearBuilt ?? "");
        });
        break;
    }
  }

  openUpdateListingForm(property: Property){
    var dialogRef;
      dialogRef = this.dialog.open(ListingFormComponent, {
      width: '400px',
      height: '270px'
    });
    dialogRef.componentInstance.newListing = false;
    dialogRef.componentInstance.updatedProperty = property;
  }

  openPopUp(){
    var dialogRef;
      dialogRef = this.dialog.open(ListingFormComponent, {
      width: '400px',
      height: '270px'
    }).componentInstance.newListing = true;
  }

  deleteListing(id: string){
    let prop: Property;
    for (prop of this.properties) {
      if (prop.id = id) {
        this.firebaseApi.deleteProperty(prop);
      }
    }
  }
}
