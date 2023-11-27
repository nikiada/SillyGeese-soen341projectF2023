// Importing necessary modules from Angular
import { Component, Output, EventEmitter } from '@angular/core';

// Component decorator with metadata
@Component({
  selector: 'app-broker-search',
  templateUrl: './broker-search.component.html',
  styleUrls: ['./broker-search.component.css']
})
export class BrokerSearchComponent {
  // Property to store the search query
  searchQuery: string = '';

  // Event emitter to notify parent components of search events
  @Output() searchEvent = new EventEmitter<string>();

  // Method triggered when the search button is clicked
  search() {
    // Emitting the search query to notify parent components
    this.searchEvent.emit(this.searchQuery);
  }
}