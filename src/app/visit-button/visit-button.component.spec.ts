import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitButtonComponent } from './visit-button.component';

describe('VisitButtonComponent', () => {
  let component: VisitButtonComponent;
  let fixture: ComponentFixture<VisitButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitButtonComponent]
    });
    fixture = TestBed.createComponent(VisitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
