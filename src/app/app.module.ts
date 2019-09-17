import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { BuyTicketComponent } from './components/buy-ticket/buy-ticket.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { LotteryInfoComponent } from './components/lottery-info/lottery-info.component';
import { HeaderComponent } from './components/header/header.component';
import { AlertComponent } from './components/alert/alert.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    BuyTicketComponent,
    TicketListComponent,
    LotteryInfoComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
