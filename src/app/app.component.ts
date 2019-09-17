import { Component } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service'
import { LotteryState } from 'src/app/classes/lottery-state.enum';
import { TicketListService } from './services/ticket-list/ticket-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private lotteryStateEnum = LotteryState;
  public lotteryState: LotteryState = LotteryState.Unknown;
  public ticketPrice: number = 0;
  public jackpot: number = 0;
  public chairmanAddress: string = "Not set";
  public userAddress: string;
  public connected: boolean;

  constructor(private contractService: ContractService,
      private ticketListService: TicketListService) {}

  ngOnInit() {
    this.contractService.connect().then((status) => {
    this.connected = status;
    if (!this.connected) return;
    this.contractService.getJackpot().then(jp => this.jackpot = jp / 1000000000000000000);
    this.contractService.getTicketPrice().then(tp => this.ticketPrice = tp / 1000000000000000000);
    this.contractService.getChairmanAdress().then(ca => this.chairmanAddress = ca);
    this.contractService.getLotteryState().then(ls => this.lotteryState = ls);
    this.contractService.getUserAddress().then(ua => this.userAddress = ua);
    this.ticketListService.getObservable().subscribe(() => this.jackpot += this.ticketPrice);
    });
  }

}
