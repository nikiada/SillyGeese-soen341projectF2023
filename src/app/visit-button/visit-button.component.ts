import { Component } from '@angular/core';

@Component({
  selector: 'app-visit-button',
  templateUrl: './visit-button.component.html',
  styleUrls: ['./visit-button.component.css'],
})
export class VisitButtonComponent {
  // Method to open Calendly in a new browser window
  openCalendly() {
    // Calendly URL for booking a visit
    const calendlyURL = 'https://calendly.com/sillygeese341/book-visit-time';
    
    // Opening the Calendly URL in a new browser window or tab
    window.open(calendlyURL, '_blank');
  }
}
