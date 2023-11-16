import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BrokerComponent } from './broker/broker.component';
import { ListingsComponent } from './listings/listings.component';
import {ListingDetailsComponent} from "./listings/listing-details/listing-details.component";
import {NgModule} from "@angular/core";
import {OffersComponent} from "./offers/offers.component";

const routes: Routes = [
    {path: '', component: ListingsComponent},
    {path: 'brokers', component: BrokerComponent},
    {
        path: 'listings', component: ListingsComponent
    },
    {
        path: 'listings/:id', component: ListingDetailsComponent
    },
    {path: 'offers', component: OffersComponent}
];

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
  }
)
export class AppRoutingModule {
}
