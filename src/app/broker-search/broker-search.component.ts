import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-broker-search',
  templateUrl: './broker-search.component.html',
  styleUrls: ['./broker-search.component.css']
})
export class BrokerSearchComponent {
  searchQuery: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  search() {
    this.searchEvent.emit(this.searchQuery);
  }
}
