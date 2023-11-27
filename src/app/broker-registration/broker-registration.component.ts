import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseApi } from "../api/firebase-api";

@Component({
  selector: 'app-broker-registration',
  templateUrl: './broker-registration.component.html',
  styleUrls: ['./broker-registration.component.css']
})
export class BrokerRegistrationComponent {
  brokerName: string = '';
  brokerEmail: string = '';
  brokerPassword: string = '';
  successMessage: string = '';
  isFormVisible: boolean = false;
  errorMessage: string = '';

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firebaseApi: FirebaseApi
  ) {}

  /**
   * Toggles the visibility of the registration form.
   */
  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
    console.log('Form visibility toggled:', this.isFormVisible);
  }

  /**
   * Closes the registration form.
   */
  closeForm() {
    this.isFormVisible = false;
    console.log('Form closed');
  }

  /**
   * Registers a new broker using the provided name, email, and password.
   * Displays success or error messages accordingly.
   */
  registerBroker() {
    this.firebaseApi.registerBroker(this.brokerEmail, this.brokerPassword, this.brokerName)
      .then(() => {
        this.successMessage = 'Broker registration successful!';
        this.brokerName = '';
        this.brokerEmail = '';
        this.brokerPassword = '';
      })
      .catch((error) => {
        this.errorMessage = `Error registering broker: ${error}`;
      });
  }
}
