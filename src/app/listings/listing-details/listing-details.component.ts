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


@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent {
property: Property={} ;
  firebaseApi: FirebaseApi;
  images = new Map<string, any[]>();
  properties: Property[] = [];
  currentUserId:string | undefined  = "";
  offerSubmited: boolean = false;
  @Input() id = "";
  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get("id") || '';
      if (this.id) {
        this.property = await this.firebaseApi.getProperty(this.id);
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
  constructor(private router: Router,private route: ActivatedRoute, private storage: AngularFireStorage, public iconSet: IconSetService, private db: AngularFirestore, private fireModule: AngularFirestore, private auth: AngularFireAuth) {
      = function() {
      return false;
    };
    this.firebaseApi = new FirebaseApi(fireModule, auth);
    iconSet.icons = {cilBed, cilBath, cilRoom, cilListFilter, cilBuilding, cilCalendar, cilMoney, cilGraph};
    auth.onAuthStateChanged((user) => {
      this.currentUserId = user?.uid;
    });
    console.log(this.id + "AAA")
    // route.params.subscribe(async val => {
    //   this.id = val['id'];
    //   if (this.id) {
    //     this.property = await this.firebaseApi.getProperty(this.id);
    //     await this.getBrokerProperties();
    //     this.images = await this.loadImagesForProperties();
    //     this.images.forEach((img) => {
    //       for (let i = 0; i < img.length; i++) {
    //         img[i] = {src: img[i]}
    //       }
    //     });
    //   }
    // });
  }

  async loadImagesForProperties() {
    const  images = new Map<string, string[]>();


      if (this.property?.id != null) {
        let urls:string[] = await lastValueFrom(this.getImagesForListing(this.property.id) ?? []);
        if(urls.length == 0){
          urls =  await lastValueFrom(this.getDefaultImage())
        }
        images.set(this.property.id, urls);
      }

    for (const property of this.properties) {
      if (property.id != null) {
        let urls:string[] = await lastValueFrom(this.getImagesForListing(property.id) ?? []);
        if(urls.length == 0){
          urls =  await lastValueFrom(this.getDefaultImage())
        }
        images.set(property.id, urls);
      }
    }
    return images;
  }
  getDefaultImage():Observable<string[]>{
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
  getImageUrls(id:string): any[]{
    return this.images.get(id) || [];
  }

  async getBrokerProperties() {
    this.properties = await lastValueFrom(this.firebaseApi.getPropertiesByBroker(this.property.brokerId ?? "", this.property.id ?? ""));
  }

  makeOffer(){
    let offer: Offer = new Offer("", this.property.brokerId,this.currentUserId, Offer.PENDING, "200000" );
    this.firebaseApi.createOffer(offer);
    this.offerSubmited = true;
  }
}
