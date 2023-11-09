import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerSearchComponent } from './broker-search.component';

describe('BrokerSearchComponent', () => {
  let component: BrokerSearchComponent;
  let fixture: ComponentFixture<BrokerSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerSearchComponent]
    });
    fixture = TestBed.createComponent(BrokerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
