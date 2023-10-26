import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {environment} from '../environments/environment';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import { BrokerComponent } from './broker/broker.component';
import { AppRoutingModule } from './app-routing.module';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { ListingsComponent } from './listings/listings.component';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import { CarouselModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
    BrokerComponent,
    ListingsComponent
  ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        AppRoutingModule,
        MatMenuModule,
        MatButtonModule,
        MatCardModule,
        FlexModule,
        CarouselModule,
        IconModule
    ],
  providers: [IconSetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
