import { Component, OnInit, Inject } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.scss']
})
export class BuyTicketComponent implements OnInit {

  constructor(@Inject(AppComponent) private parent: AppComponent,
      private contractService: ContractService) {}

  ngOnInit() {
  }

  buyTicket(gambleNumber) {
    if (!this.parent.connected) return;
    this.contractService.buyTicket(gambleNumber);
  }

}
