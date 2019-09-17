import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/classes/alert';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertLevel } from 'src/app/classes/alert-level.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  
})
export class AlertComponent implements OnInit {

  alertLevel = AlertLevel;
  alert: Alert;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getObservable().subscribe((alert: Alert) => this.alert = alert);
  }

  convertLevelToCssClass(level: AlertLevel) {
    switch (level) {
      case AlertLevel.Success:
        return 'success';
      case AlertLevel.Error:
        return 'danger';
      case AlertLevel.Info:
        return 'info';
      case AlertLevel.Warning:
        return 'warning';
    }
  }

}
