import { Component, OnInit, Inject } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Ticket } from 'src/app/classes/ticket';
import { AppComponent } from 'src/app/app.component';
import { TicketListService } from 'src/app/services/ticket-list/ticket-list.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

  tickets: Array<Ticket> = [];

  constructor(@Inject(AppComponent) private parent: AppComponent, 
      private contractService: ContractService,
      private ticketListService: TicketListService) {}

  ngOnInit() {
    if (!this.parent.connected) return;
    this.contractService.getTickets().then(ticketArray => this.refresh(ticketArray));
    this.ticketListService.getObservable().subscribe(ticket => this.tickets.push(ticket));
  }

  refresh(tickets: Array<Ticket>) {
    this.tickets = tickets.sort(Ticket.compare);
  }

}
