import { Injectable } from '@angular/core';
import { Ticket } from 'src/app/classes/ticket';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketListService {
  private subject = new Subject<Ticket>();

  getObservable(): Observable<Ticket> {
    return this.subject.asObservable();
  }

  add(ticket: Ticket) {
    this.subject.next(ticket);
  }
}
