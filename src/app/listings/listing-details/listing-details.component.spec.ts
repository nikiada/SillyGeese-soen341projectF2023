import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingDetailsComponent } from './listing-details.component';

describe('ListingDetailsComponent', () => {
  let component: ListingDetailsComponent;
  let fixture: ComponentFixture<ListingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListingDetailsComponent]
    });
    fixture = TestBed.createComponent(ListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
