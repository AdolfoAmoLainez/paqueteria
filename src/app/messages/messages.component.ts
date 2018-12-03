import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { MessagesService } from './messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit,OnDestroy {
  alerts: any[] = [];

  messagesSendedSubscription: Subscription;

  constructor(private messagesService: MessagesService) { }

  ngOnInit() {
    this.messagesSendedSubscription = this.messagesService.messageSend.subscribe(
      (alert: any) =>{
        this.alerts.push(alert);
      });
  }
 
  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  ngOnDestroy(){
    this.messagesSendedSubscription.unsubscribe();
  }

}
