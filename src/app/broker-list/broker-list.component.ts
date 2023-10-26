import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-broker-list',
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.css']
})
export class BrokerListComponent implements OnInit {
  brokers: any[] = []; 
  selectedBroker: any = null;
  isUpdating: boolean = false;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore
      .collection('broker')
      .valueChanges()
      .subscribe((brokers) => {
        this.brokers = brokers;
      });
  }

  deleteBroker(brokerId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this broker?');
  
    if (confirmDelete) {
      console.log('Deleting broker with ID:', brokerId);
      const brokerRef = this.firestore.collection('broker').doc(brokerId);
  
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
    const selectedBrokerRef = this.firestore.collection('broker').doc(brokerId);
  
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

  const brokerRef = this.firestore.collection('broker').doc(brokerId);

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

}