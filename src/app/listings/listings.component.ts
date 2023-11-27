import {Component, Input, OnInit} from '@angular/core';
import {user} from "@angular/fire/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IconSetService} from '@coreui/icons-angular';
import {cilBath, cilBed, cilRoom, cilListFilter, cilBookmark} from '@coreui/icons';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FirebaseApi} from "../api/firebase-api";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Property} from "../dto/property";
import {from, lastValueFrom, Observable, ObservedValueOf, of} from "rxjs";
import {MatDialog} from '@angular/material/dialog';
import {ListingFormComponent} from '../listing-form/listing-form.component';
import {DOCUMENT} from '@angular/common';
import {Router} from "@angular/router";

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
  visible = false;
  isLoading: boolean = false;
  currentUserId: string | undefined = "";
  isMainPage = true;
  nBathrooms = "any";
  nBedrooms = "any";
  nRooms = "any";
  minPriceRange="";
  maxPriceRange="";
  filterValue = "";

  @Input() productId = '';

  async ngOnInit() {
    if (this.router.url === "/listings") {
      await this.getBrokerProperties();
      this.isMainPage = false;
    } else {
      this.properties = await this.firebaseApi.getAllProperties();
      this.isMainPage = true;
    }
    this.images = await this.loadImagesForProperties();
    this.images.forEach((img) => {
      for (let i = 0; i < img.length; i++) {
        img[i] = {src: img[i]}
      }
    });

  }


  constructor(private dialog: MatDialog, private storage: AngularFireStorage, public iconSet: IconSetService, private db: AngularFirestore, private fireModule: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    iconSet.icons = {cilBed, cilBath, cilRoom, cilListFilter, cilBookmark};
    this.firebaseApi = new FirebaseApi(fireModule, auth);
  }

  async getBrokerProperties() {
    this.properties = await lastValueFrom(this.firebaseApi.getPropertiesByBroker(localStorage.getItem("currentUser") ?? ""));
  }

  async loadImagesForProperties() {
    const images = new Map<string, string[]>();

    for (const property of this.properties) {
      if (property.id != null) {
        let urls: string[] = await lastValueFrom(this.getImagesForListing(property.id) ?? []);
        if (urls.length == 0) {
          urls = await lastValueFrom(this.getDefaultImage())
        }
        images.set(property.id, urls);
      }
    }
    return images;
  }

  getDefaultImage(): Observable<string[]> {
    return this.getImagesForListing('default');
  }

  getImagesForListing(id: string): Observable<string[]> {
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

  getImageUrls(id: string): any[] {
    return this.images.get(id) || [];
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  onSortByChange(select: any): void {
    switch (select.target.value) {
      case "price":
        this.properties.sort(function (a, b) {
          return parseInt(a.price ?? "") - parseInt(b.price ?? "");
        });
        break;
      case "title":
        this.properties.sort((a, b) =>
          (a.address ?? "").localeCompare(b.address ?? ""));
        break;
      case "year":
        this.properties.sort(function (a, b) {
          return parseInt(a.yearBuilt ?? "") - parseInt(b.yearBuilt ?? "");
        });
        break;
    }
  }

  onPriceFilterChange(input: any): void {
    if (input.target.id == "minPriceRange") {
      let maxPrice = <HTMLInputElement>document.getElementById("maxPriceRange");
      if (!(input.target.value < parseInt(maxPrice?.value))) {
        maxPrice.value = String(parseInt(input.target.value) + 1);
      }
    } else if (input.target.id == "maxPriceRange") {
      let minPrice = <HTMLInputElement>document.getElementById("minPriceRange");
      if (!(input.target.value > parseInt(minPrice?.value))) {
        minPrice.value = String(parseInt(input.target.value) - 1);
      }
    }
  }

  async onSubmitFilterForm() {
    this.isLoading = true;
    this.properties = [];
    console.log(this.filterValue);
    let propertiesResults = await this.firebaseApi.getPropertiesContainingString(this.filterValue);
    console.log(propertiesResults)
    console.log(propertiesResults.length)
    propertiesResults = this.applyBathroomsFilter(propertiesResults);
    propertiesResults = this.applyBedroomFilter(propertiesResults);
    propertiesResults = this.applyRoomsFilter(propertiesResults);
    propertiesResults = this.applyPriceFilter(propertiesResults);
    this.properties = propertiesResults;
    this.isLoading = false;
    this.toggleCollapse();
  }

  private applyBathroomsFilter(properties: Property[]) {
    console.log(properties)
    console.log(properties.length)
    let propertiesResults: any[] = [];
    if (this.nBathrooms == "any") {
      return properties;
    }
    let nBathrooms = parseInt(this.nBathrooms);
    for (let property of properties) {
      if (nBathrooms == 10 && parseInt(property.nBathrooms!) >= nBathrooms) {
        propertiesResults.push(property);
      } else if (parseInt(property.nBathrooms!) == nBathrooms) {
        propertiesResults.push(property);
      }
    }
    return propertiesResults;
  }

  private applyBedroomFilter(properties: Property[]) {
    let propertiesResults: any[] = [];
    let nBedrooms = parseInt(this.nBedrooms);
    if (this.nBedrooms == "any") {
      return properties;
    }
    for (let property of properties) {
      if (nBedrooms == 10 && parseInt(<string>property.nBedrooms) >= nBedrooms) {
        propertiesResults.push(property);
      } else if (parseInt(<string>property.nBedrooms) == nBedrooms) {
        propertiesResults.push(property);
      }
    }
    return propertiesResults;

  }


  private applyRoomsFilter(properties: Property[]) {
    let propertiesResults: any[] = [];
    let nRooms = parseInt(this.nRooms);
    if (this.nRooms == "any") {
      return properties;
    }
    for (let property of properties) {
      if (nRooms == 10 && parseInt(<string>property.nRooms) >= nRooms) {
        propertiesResults.push(property);
      } else if (parseInt(<string>property.nRooms) == nRooms) {
        propertiesResults.push(property);
      }
    }
    return propertiesResults;
  }

  private applyPriceFilter(properties: Property[]) {
    let propertiesResults: any[] = [];
    let minPriceRange = parseInt(this.minPriceRange);
    let maxPriceRange = parseInt(this.maxPriceRange);

    for (let property of properties) {
      if (!isNaN(minPriceRange) && !isNaN(maxPriceRange)) {
        if (minPriceRange <= parseInt(<string>property.price) && maxPriceRange >= parseInt(<string>property.price)) {
          propertiesResults.push(property);
        }
      } else {
        return properties;
      }
    }
    return propertiesResults;
  }

  openPopUp() {
    var dialogRef;
    dialogRef = this.dialog.open(ListingFormComponent, {
      width: 'fit-content',
      height: 'fit-content'
    }).componentInstance.newListing = true;
  }

}
