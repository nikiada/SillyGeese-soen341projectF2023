import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseApi } from '../api/firebase-api';
import { user } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Property } from '../dto/property';

@Component({
  selector: 'app-listing-form',
  templateUrl: './listing-form.component.html',
  styleUrls: ['./listing-form.component.css']
})
export class ListingFormComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  protected readonly user = user;
  firebaseApi: FirebaseApi;
  newListing: boolean | undefined;
  constructor(public dialogRef: MatDialogRef<ListingFormComponent>, private fireModule: AngularFirestore, private auth: AngularFireAuth){
    this.firebaseApi = new FirebaseApi(fireModule, auth);
  }

  updateListing(form: NgForm){
    console.log("less epic stuff");
    this.firebaseApi.updateProperty("PropertyId", form.form.value.address, form.form.value.details, form.form.value.bathrooms, 
    form.form.value.bedrooms, form.form.value.rooms, form.form.value.postalcode, form.form.value.price, form.form.value.propertytype, form.form.value.yearbuilt);
  }

  closePopup() {
      this.dialogRef.close();
  }

  checkIfCreatingNew(form: NgForm){
    if(this.newListing){
      this.createListing(form);
    } else{
      this.updateListing(form);
    }
  }


  createListing(form: NgForm){
    console.log("epic stuff");
    console.log(form);
    console.log(form.form.value.bathrooms);
    console.log(form.form.value.bathrooms+2);
    this.firebaseApi.createProperty("PropertyId", form.form.value.address, "", form.form.value.details, form.form.value.bathrooms, 
    form.form.value.bedrooms, form.form.value.rooms, form.form.value.postalcode, form.form.value.price, form.form.value.propertytype, form.form.value.yearbuilt);
    
    this.closePopup();
  }
  
}
