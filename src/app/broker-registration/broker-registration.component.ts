// broker-registration.component.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  closeForm() {
    this.isFormVisible = false;
  }

  registerBroker() {
    this.auth.createUserWithEmailAndPassword(this.brokerEmail, this.brokerPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          const userData = {
            name: this.brokerName,
            email: this.brokerEmail,
            uid: user.uid, // Associate the user with their Firebase UID
          };
          this.firestore.collection('broker').doc(user.uid).set(userData)
            .then(() => {
              this.successMessage = 'Broker registration successful!';
              this.brokerName = '';
              this.brokerEmail = '';
              this.brokerPassword = '';
            })
            .catch((error) => {
              console.error('Error setting user data in Firestore:', error);
            });
        } else {
          console.error('User is null. Cannot set data.');
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  }
  

}
