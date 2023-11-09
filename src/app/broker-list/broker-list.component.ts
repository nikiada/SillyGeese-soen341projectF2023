import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BrokerSearchComponent } from '../broker-search/broker-search.component';
import {User} from "../dto/user";

@Component({
  selector: 'app-broker-list',
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.css']
})
export class BrokerListComponent implements OnInit {
  brokers: any[] = [];
  selectedBroker: any = null;
  isUpdating: boolean = false;
  filteredBrokers: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore.collection("user")
      .get()
      .subscribe(observer =>
        observer.docs.forEach(userDoc => {
            let user = User.createUserFromDocumentSnapshot(userDoc.id, userDoc.data());
            if(user.type === "BROKER"){
              this.brokers.push(user);
              this.filteredBrokers.push(user);
            }
          }
        ));
  }

  deleteBroker(brokerId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this broker?');

    if (confirmDelete) {
      console.log('Deleting broker with ID:', brokerId);
      const brokerRef = this.firestore.collection('user').doc(brokerId);

      brokerRef.delete()
        .then(() => {
          console.log('Broker deleted.');
        })
        .catch((error) => {
          console.error('Error deleting broker:', error);
        });
    }
  }

  updateBroker(brokerId: string) {
    const selectedBrokerRef = this.firestore.collection('user').doc(brokerId);

    selectedBrokerRef.valueChanges().subscribe((brokerData) => {
      if (brokerData) {
        this.selectedBroker = { ...brokerData, id: brokerId };
        this.isUpdating = true;
      } else {
        console.error('Broker not found for the given ID:', brokerId);
      }
    });
  }

updateSelectedBroker() {
  const brokerId = this.selectedBroker.id;

  if (!brokerId) {
    console.error('Invalid broker ID.');
    return;
  }

  const brokerRef = this.firestore.collection('user').doc(brokerId);

  const updatedBroker = { ...this.selectedBroker };
  delete updatedBroker.id;

  brokerRef.update(updatedBroker)
    .then(() => {
      console.log('Broker updated.');
      this.cancelUpdate();
    })
    .catch((error) => {
      console.error('Error updating broker:', error);
    });
}

cancelUpdate() {
  this.selectedBroker = null;
  this.isUpdating = false;
}

onSearch(query: string) {
  this.filteredBrokers = this.brokers.filter(broker =>
    broker.name.toLowerCase().includes(query.toLowerCase()) ||
    broker.email.toLowerCase().includes(query.toLowerCase())
  );
}


}
