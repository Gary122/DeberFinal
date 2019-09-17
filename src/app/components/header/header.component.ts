import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { LotteryState } from 'src/app/classes/lottery-state.enum';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  lotteryState = LotteryState;

  constructor(@Inject(AppComponent) private parent: AppComponent,
      private contractService: ContractService) { }

  ngOnInit() {
  }

  closeTicketSales() {
    this.contractService.closeTicketSales()
        .then(() => {this.parent.lotteryState = LotteryState.Closed});
  }

  revealWinners() {
    this.contractService.revealWinners()
        .then(() => {
          this.parent.lotteryState = LotteryState.Finished;
          this.parent.jackpot = 0;
        });
  }

  restartLottery() {
    this.contractService.restartLottery().then(() => location.reload());
  }

}
