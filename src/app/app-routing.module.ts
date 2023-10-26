import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BrokerComponent } from './broker/broker.component';
import { ListingsComponent } from './listings/listings.component';
import {NgModule} from "@angular/core";
const routes: Routes = [
  { path: 'brokers', component: BrokerComponent },
  { path: 'listings', component: ListingsComponent }
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
export class AppRoutingModule { }
