import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BrokerSearchComponent } from '../broker-search/broker-search.component';
import { User } from "../dto/user";

/**
 * Component to manage the list of brokers.
 */
@Component({
  selector: 'app-broker-list',
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.css']
})
export class BrokerListComponent implements OnInit {
  brokers: any[] = []; // Array to store broker data
  selectedBroker: any = null; // Currently selected broker
  isUpdating: boolean = false; // Flag to indicate whether an update is in progress
  filteredBrokers: any[] = []; // Array to store filtered broker data based on search

  /**
   * Constructor to inject AngularFirestore service.
   * @param firestore AngularFirestore service instance.
   */
  constructor(private firestore: AngularFirestore) {}

  /**
   * Lifecycle hook called after Angular initializes the component.
   */
  ngOnInit() {
    // Fetching user collection data from Firestore
    this.firestore.collection("user")
      .get()
      .subscribe(observer =>
        observer.docs.forEach(userDoc => {
            // Creating User object from document snapshot
            let user = User.createUserFromDocumentSnapshot(userDoc.id, userDoc.data());
            // Checking if the user is of type "BROKER"
            if(user.type === "BROKER"){
              // Adding broker to the list
              this.brokers.push(user);
              // Adding broker to the filtered list
              this.filteredBrokers.push(user);
            }
          }
        ));
  }

  /**
   * Method to delete a broker.
   * @param brokerId ID of the broker to be deleted.
   */
  deleteBroker(brokerId: string) {
    // Confirming deletion with user
    const confirmDelete = confirm('Are you sure you want to delete this broker?');

    if (confirmDelete) {
      // Logging deletion action
      console.log('Deleting broker with ID:', brokerId);
      // Reference to the broker document in Firestore
      const brokerRef = this.firestore.collection('user').doc(brokerId);

      // Deleting the broker document
      brokerRef.delete()
        .then(() => {
          console.log('Broker deleted.');
        })
        .catch((error) => {
          console.error('Error deleting broker:', error);
        });
    }
  }

  /**
   * Method to initiate the update process for a broker.
   * @param brokerId ID of the broker to be updated.
   */
  updateBroker(brokerId: string) {
    // Reference to the selected broker document in Firestore
    const selectedBrokerRef = this.firestore.collection('user').doc(brokerId);

    // Subscribing to changes in the selected broker document
    selectedBrokerRef.valueChanges().subscribe((brokerData) => {
      if (brokerData) {
        // Creating a copy of brokerData with an additional 'id' property
        this.selectedBroker = { ...brokerData, id: brokerId };
        // Setting the update flag to true
        this.isUpdating = true;
      } else {
        console.error('Broker not found for the given ID:', brokerId);
      }
    });
  }

  /**
   * Method to update the selected broker.
   */
  updateSelectedBroker() {
    // Extracting the ID of the selected broker
    const brokerId = this.selectedBroker.id;

    if (!brokerId) {
      console.error('Invalid broker ID.');
      return;
    }

    // Reference to the broker document in Firestore
    const brokerRef = this.firestore.collection('user').doc(brokerId);

    // Creating a copy of the selected broker without the 'id' property
    const updatedBroker = { ...this.selectedBroker };
    delete updatedBroker.id;

    // Updating the broker document in Firestore
    brokerRef.update(updatedBroker)
      .then(() => {
        console.log('Broker updated.');
        // Cancelling the update process
        this.cancelUpdate();
      })
      .catch((error) => {
        console.error('Error updating broker:', error);
      });
  }

  /**
   * Method to cancel the update process.
   */
  cancelUpdate() {
    this.selectedBroker = null;
    this.isUpdating = false;
  }

  /**
   * Method to filter brokers based on search query.
   * @param query Search query to filter brokers.
   */
  onSearch(query: string) {
    this.filteredBrokers = this.brokers.filter(broker =>
      broker.name.toLowerCase().includes(query.toLowerCase()) ||
      broker.email.toLowerCase().includes(query.toLowerCase())
    );
  }
}
