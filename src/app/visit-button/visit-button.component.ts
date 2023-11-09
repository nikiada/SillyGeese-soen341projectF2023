import { Component } from '@angular/core';

@Component({
  selector: 'app-visit-button',
  templateUrl: './visit-button.component.html',
  styleUrls: ['./visit-button.component.css'],
})
export class VisitButtonComponent {
  openCalendly() {
    const calendlyURL = 'https://calendly.com/sillygeese341/book-visit-time';
    window.open(calendlyURL, '_blank');
  }
}
