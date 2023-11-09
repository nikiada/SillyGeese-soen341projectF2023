import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseApi } from '../api/firebase-api';
import { user } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Property } from '../dto/property';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-listing-form',
  templateUrl: './listing-form.component.html',
  styleUrls: ['./listing-form.component.css']
})
export class ListingFormComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    // throw new Error('Method not implemented.');
  }
  protected readonly user = user;
  firebaseApi: FirebaseApi;
  newListing: boolean | undefined;
  updatedProperty = new Property();
  selectedFiles: File[] = [];

  constructor(public dialogRef: MatDialogRef<ListingFormComponent>, private fireModule: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage){
    this.firebaseApi = new FirebaseApi(fireModule, auth);
  }

  updateListing(form: NgForm){
    this.firebaseApi.updateProperty(this.updatedProperty.id ?? "", this.updatedProperty);
    if(this.selectedFiles.length != 0){
      this.deleteImages(this.updatedProperty.id ?? "");
      this.uploadFiles(this.updatedProperty.id ?? "");
    }
    this.closePopup();
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

  async createListing(form: NgForm) {
    let user = await (this.auth.currentUser);

   this.updatedProperty.brokerId = user?.uid;
   await this.firebaseApi.createProperty(this.updatedProperty).then((id) => {
     console.log('New property created with ID:', id);
      this.uploadFiles(id);
     this.closePopup();
   })
  }
  onFileSelect(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadFiles(propertyId: string) {
    for (const file of this.selectedFiles) {
      const filePath = `images/${propertyId}/${file.name}`;
      const storageRef = this.storage.ref(filePath);
      storageRef.put(file);
    }
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


}
