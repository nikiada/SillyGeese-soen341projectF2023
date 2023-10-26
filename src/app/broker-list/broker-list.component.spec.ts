import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerListComponent } from './broker-list.component';

describe('BrokerListComponent', () => {
  let component: BrokerListComponent;
  let fixture: ComponentFixture<BrokerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerListComponent]
    });
    fixture = TestBed.createComponent(BrokerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
