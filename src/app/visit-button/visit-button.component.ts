import { Component } from '@angular/core';

@Component({
  selector: 'app-visit-button',
  templateUrl: './visit-button.component.html',
  styleUrls: ['./visit-button.component.css'],
})
export class VisitButtonComponent {
  openCalendly() {
    const calendlyURL = 'https://calendly.com/d/4tz-x9j-9j9';
    window.open(calendlyURL, '_blank');
  }
}
