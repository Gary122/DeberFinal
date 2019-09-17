import { Component, OnInit, Inject } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service';
import { LotteryState } from 'src/app/classes/lottery-state.enum';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-lottery-info',
  templateUrl: './lottery-info.component.html',
  styleUrls: ['./lottery-info.component.scss']
})
export class LotteryInfoComponent implements OnInit {

  lotteryStateEnum = LotteryState;

  constructor(@Inject(AppComponent) private parent: AppComponent) {}

  ngOnInit() {
    
  }

  getDisplayableStringFromAddress(address: string) {
    return address.slice(0,4) + '...' + address.slice(37, address.length);
  }

}
