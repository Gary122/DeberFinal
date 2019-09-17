import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert } from 'src/app/classes/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();

  getObservable(): Observable<Alert> {
    return this.subject.asObservable();
  }

  alert(alert: Alert) {
    this.subject.next(alert);
  }
}