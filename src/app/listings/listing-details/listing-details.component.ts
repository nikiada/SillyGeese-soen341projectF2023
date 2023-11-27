import {Component, Input} from '@angular/core';
import {Property} from "../../dto/property";
import {FirebaseApi} from "../../api/firebase-api";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IconSetService} from "@coreui/icons-angular";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {lastValueFrom, Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {cilBath, cilBed, cilRoom, cilListFilter, cilBuilding, cilCalendar, cilMoney, cilGraph} from '@coreui/icons';
import firebase from "firebase/compat";
import {Offer} from "../../dto/offer";
import {ListingFormComponent} from "../../listing-form/listing-form.component";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../dto/user";


@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent {
  property: Property = {};
  firebaseApi: FirebaseApi;
  images = new Map<string, any[]>();
  properties: Property[] = [];
  currentUserId: string | undefined = "";
  offerValue: string = "";
  offerSubmited: boolean = false;
  broker : User = {};
  mortgageSalePrice = undefined;
  mortgageDownPayment = undefined;
  mortgageIntrestRate = undefined;
  mortgageLoanTerm = undefined;
  isMortgageSalePriceValid = true;
  isMortgageDownPaymentValid = true;
  isMortgageIntrestRateValid = true;
  isMortgageLoanTermValid = true;
  mortgageResult: string | undefined = undefined;
  readonly MAX_MORTGAGE_SALEPRICE_DEFAULT = 1000000000000;
  @Input() id = "";

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get("id") || '';
      if (this.id) {
        this.property = await this.firebaseApi.getProperty(this.id);
        this.broker = await this.firebaseApi.getUser(this.property.brokerId!);
        this.offerValue = this.property.price ?? "";
        await this.getBrokerProperties();
        this.images = await this.loadImagesForProperties();
        this.images.forEach((img) => {
          for (let i = 0; i < img.length; i++) {
            img[i] = {src: img[i]}
          }
        });
      }
    });
  }

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private storage: AngularFireStorage, public iconSet: IconSetService, private db: AngularFirestore, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.firebaseApi = new FirebaseApi(fireModule, auth);
    iconSet.icons = {cilBed, cilBath, cilRoom, cilListFilter, cilBuilding, cilCalendar, cilMoney, cilGraph};
    auth.onAuthStateChanged((user) => {
      this.currentUserId = user?.uid;
    });
  }

  async loadImagesForProperties() {
    const images = new Map<string, string[]>();


    if (this.property?.id != null) {
      let urls: string[] = await lastValueFrom(this.getImagesForListing(this.property.id) ?? []);
      if (urls.length == 0) {
        urls = await lastValueFrom(this.getDefaultImage())
      }
      images.set(this.property.id, urls);
    }

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

  async getBrokerProperties() {
    let properties = await lastValueFrom(this.firebaseApi.getPropertiesByBroker(this.property.brokerId ?? "", this.property.id ?? ""));
    if(properties.length > 1){
      this.properties.push(properties[0]);
      this.properties.push(properties[1]);
    }
  }

  makeOffer() {
    let offer: Offer = new Offer("", this.property.brokerId, this.currentUserId, this.property.id, Offer.PENDING, this.offerValue);
    this.firebaseApi.createOffer(offer);
    this.offerSubmited = true;
  }

  openUpdateListingForm(property: Property) {
    var dialogRef;
    dialogRef = this.dialog.open(ListingFormComponent, {
      width: 'fit-content',
      height: 'fit-content'
    });
    dialogRef.componentInstance.newListing = false;
    dialogRef.componentInstance.updatedProperty = property;
  }

  deleteListing(id: string) {

    if (this.property.id) {
      this.firebaseApi.deleteProperty(this.property);
      this.deleteImages(this.property.id);
    }
    this.router.navigateByUrl('/listings');
  }


  deleteImages(propertyId: string) {
    const imageRef = this.storage.ref('images/' + propertyId + '/');
    imageRef.listAll().subscribe(
      (listAllResult) => {
        listAllResult.items.map((item) =>
          item.delete()
        );
      }
    );
  }

  calculateMortgage() {
    if (!this.mortgageSalePrice) this.isMortgageSalePriceValid = false
    if (!this.mortgageDownPayment) this.isMortgageDownPaymentValid = false
    if (!this.mortgageLoanTerm) this.isMortgageLoanTermValid = false
    if (!this.mortgageIntrestRate) this.isMortgageIntrestRateValid = false
    if (this.isMortgageSalePriceValid && this.isMortgageDownPaymentValid && this.isMortgageLoanTermValid && this.isMortgageIntrestRateValid) {
      let p = this.mortgageSalePrice!! - this.mortgageDownPayment!!;
      let r = (this.mortgageIntrestRate!! / 100) / 12;
      let n = this.mortgageLoanTerm!! * 12;
      this.mortgageResult = (p * ((r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1))).toFixed(2);
    }
  }

  protected readonly localStorage = localStorage;
}
