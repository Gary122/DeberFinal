import { Injectable, OnInit } from '@angular/core';
import { Alert } from 'src/app/classes/alert';
import { AlertLevel } from 'src/app/classes/alert-level.enum';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LotteryState } from 'src/app/classes/lottery-state.enum';
import { Ticket } from 'src/app/classes/ticket';
import { TicketListService } from '../ticket-list/ticket-list.service';
import contractAbi from 'src/assets/contract-abi.json';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  public contractAddress: string = '0xdD2E5a84b7884F6C4EACF982667c8821b694Be05';
  private web3: Web3;
  private contract: Web3.eth.Contract;

  constructor(private alertService: AlertService,
      private ticketListService: TicketListService) {}

  public connect(): Promise<boolean> {
    return new Promise(resolve => resolve(false))
      .then(() => {
        this.web3 = this.getWeb3Instance();
        if (this.web3 == null) return false;
      })
      .then(() => {
        this.contract = this.getContract();
        if (this.contract == null) return false;
      })
      .then(() => this.confirmDappBrowser())
  }
  private async confirmDappBrowser(): Promise<boolean> {
    if(!window['ethereum']) return false;
    return window['ethereum'].enable()
      .then(() => true)
      .catch(() => {
        let DappBrowserRejected = new Alert({
          message: 'Access to Dapp enabled browser or extension was Rejected.',
          level: AlertLevel.Error
        });
        this.alertService.alert(DappBrowserRejected);
        return false;
      });
  }

  private getContract(): Web3.eth.Contract {
    return new this.web3.eth.Contract(contractAbi, this.contractAddress);
  }

  private getWeb3Instance(): Web3 {
    let web3Instance: Web3 = null;
    
    if (window['web3'] != null) {
      web3Instance = new Web3(window['web3'].currentProvider);
      this.checkNetworkVersion(web3Instance);
    } else {
      let noWeb3DetectedAlert = new Alert({
        message: 'No Web3 provider detected. Are you using Metamask or Mist?',
        level: AlertLevel.Error
      });
      this.alertService.alert(noWeb3DetectedAlert);
    }

    return web3Instance;
  }

  private checkNetworkVersion(web3instance: Web3) {
    web3instance.eth.net.getId()
    .then(versionId => {
      if (versionId != 4) {
        let connectToNetworkAlert = new Alert({
          message: 'Please connect to Rinkeby test network.', 
          level: AlertLevel.Error
        });
        this.alertService.alert(connectToNetworkAlert);
      }
    });
  }

  public async restartLottery(): Promise<void> {
    return this.contract.methods.restartLottery()
      .send({from: await this.getUserAddress()})
      .on('transactionHash', (txHash) => {
        this.alertService.alert(this.buildWaitingOnConfirmationAlert(txHash));
      })
      .then(receipt => {
        this.alertService.alert(this.buildTransactionSuccessAlert(receipt.transactionHash));
      })
      .catch(receipt => {
        if(receipt['transactionHash']) 
            this.alertService.alert(this.buildFailedTransactionAlert(receipt.transactionHash));
        else
            this.alertService.alert(this.buildFailedTransactionByUserAlert());
      });
  }

  public async revealWinners(): Promise<Array<string>> {
    return this.contract.methods.revealWinners()
      .send({from: await this.getUserAddress()})
      .on('transactionHash', (txHash) => {
        this.alertService.alert(this.buildWaitingOnConfirmationAlert(txHash));
      })
      .then(() => this.getWinners().then((winners: Array<string>) => {
        this.alertService.alert(this.buildWinnersAlert(winners))
        })
      )
      .catch(receipt => {
        if(receipt['transactionHash']) 
            this.alertService.alert(this.buildFailedTransactionAlert(receipt.transactionHash));
        else
            this.alertService.alert(this.buildFailedTransactionByUserAlert());
      });
  }

  private buildWinnersAlert(winners: Array<string>): Alert {
    return new Alert({
      message: 'The winners are: ' + winners.join(", "),
      level: AlertLevel.Success
    });
  }

  private async getWinners(): Promise<Array<string>> {
    return this.contract.methods.getWinners().call() as Promise<Array<string>>;
  }

  public async closeTicketSales(): Promise<void> {
    return this.contract.methods.closeLottery()
      .send({from: await this.getUserAddress()})
      .on('transactionHash', (txHash) => {
        this.alertService.alert(this.buildWaitingOnConfirmationAlert(txHash));
      })
      .then(receipt => {
        this.alertService.alert(this.buildTransactionSuccessAlert(receipt.transactionHash));
      })
      .catch(receipt => {
        if(receipt['transactionHash']) 
            this.alertService.alert(this.buildFailedTransactionAlert(receipt.transactionHash));
        else
            this.alertService.alert(this.buildFailedTransactionByUserAlert());
      });
  }

  public async buyTicket(gambleNumber: number) {
    let options = {
      from: await this.getUserAddress(),
      value: (await this.getTicketPrice())
    }

    this.contract.methods.buyTicket(gambleNumber).send(options)
      .on('transactionHash', (txHash) => {
        this.alertService.alert(this.buildWaitingOnConfirmationAlert(txHash));
      })
      .then(receipt => {
        this.alertService.alert(this.buildTransactionSuccessAlert(receipt.transactionHash));
        this.ticketListService.add(new Ticket({owner: options.from, gambleNumber: gambleNumber}));
      })
      .catch(receipt => {
        if(receipt['transactionHash']) 
            this.alertService.alert(this.buildFailedTransactionAlert(receipt.transactionHash));
        else
            this.alertService.alert(this.buildFailedTransactionByUserAlert());
      });
  }

  private buildFailedTransactionByUserAlert(): Alert {
    return new Alert({
      message: 'The transaction was interrupted.',
      level: AlertLevel.Error
    });
  }

  private buildFailedTransactionAlert(txHash): Alert {
    return new Alert({
      message: 'Transaction Failed to execute. ' + this.createEtherScanHtmlLink(txHash),
      level: AlertLevel.Error
    });
  }

  private buildTransactionSuccessAlert(txHash): Alert {
    return new Alert({
      message: 'Transaction completed. ' + this.createEtherScanHtmlLink(txHash),
      level: AlertLevel.Success
    });
  }

  private buildWaitingOnConfirmationAlert(txHash): Alert {
    return new Alert({
      message: 'Waiting on confirmation... ' + this.createEtherScanHtmlLink(txHash),
      level: AlertLevel.Warning
    });
  }

  private createEtherScanHtmlLink(txHash: string): string {
    return 'View on <a href="https://rinkeby.etherscan.io/tx/'
        + txHash + '" target="_blank">EtherScan</a>';
  }

  public async getTickets(): Promise<Array<Ticket>> {
    let tickets: Array<Ticket> = [];
    let promise = new Promise<Array<Ticket>>(resolve => resolve(tickets));
    let ticketCount: number = await this.contract.methods.getTicketCount().call();

    for (let i = 0; i < ticketCount; i++) {
      promise.then(() => {
        this.contract.methods.tickets(i).call().then((ticket: Ticket) => tickets.push(ticket));
      });
    }

    return promise;
  }

  public async getUserAddress(): Promise<string> {
    return this.web3.eth.getAccounts().then(aa => aa[0]) as Promise<string>;
  }

  public async getJackpot(): Promise<number> {
    return this.contract.methods.jackpot().call()
        .then(jackpot => Number(jackpot)) as Promise<number>;
  }

  public async getTicketPrice(): Promise<number> {
    return this.contract.methods.ticketPrice().call()
    .then(ticketPrice => Number(ticketPrice)) as Promise<number>;
  }

  public async getChairmanAdress(): Promise<string> {
    return this.contract.methods.chairman().call() as Promise<string>;
  }

  public async getLotteryState(): Promise<LotteryState> {
    return this.contract.methods.state().call()  as Promise<LotteryState>;
  }  
}
