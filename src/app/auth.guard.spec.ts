import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';

// Mock AngularFireAuth and AngularFirestore
const mockAngularFireAuth = {
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.returnValue(of(null)),
};

const mockAngularFirestore = {
  collection: jasmine.createSpy('collection').and.returnValue({
    doc: jasmine.createSpy('doc').and.returnValue({
      get: jasmine.createSpy('get').and.returnValue(of({ data: () => ({ type: 'BROKER' }) })),
    }),
  }),
};

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: AngularFirestore, useValue: mockAngularFirestore },
      ],
    });
  });

  it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should allow access for BROKER user type', inject([AuthGuard], (guard: AuthGuard) => {
    mockAngularFireAuth.onAuthStateChanged.and.returnValue(of({ uid: 'fakeUserId' }));
    guard.canActivate().then((result) => {
      expect(result).toBe(true);
    });
  }));

  it('should allow access for ADMIN user type', inject([AuthGuard], (guard: AuthGuard) => {
    mockAngularFireAuth.onAuthStateChanged.and.returnValue(of({ uid: 'fakeUserId' }));
    mockAngularFirestore.collection().doc().get.and.returnValue(of({ data: () => ({ type: 'ADMIN' }) }));
    guard.canActivate().then((result) => {
      expect(result).toBe(true);
    });
  }));

  it('should deny access for other user types', inject([AuthGuard], (guard: AuthGuard) => {
    mockAngularFireAuth.onAuthStateChanged.and.returnValue(of({ uid: 'fakeUserId' }));
    mockAngularFirestore.collection().doc().get.and.returnValue(of({ data: () => ({ type: 'CLIENT' }) }));
    guard.canActivate().then((result) => {
      expect(result).toBe(false);
    });
  }));

  it('should deny access for unauthenticated users', inject([AuthGuard], (guard: AuthGuard) => {
    guard.canActivate().then((result) => {
      expect(result).toBe(false);
    });
  }));
});