import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { MessagesService } from './messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class MessagesComponent implements OnInit,OnDestroy {
  alerts: any[] = [];

  messagesSendedSubscription: Subscription;

  constructor(private messagesService: MessagesService) { }

  ngOnInit() {
    this.messagesSendedSubscription = this.messagesService.messageSend.subscribe(
      (alert: any) =>{
        console.log(alert);
        
        this.alerts.push(alert);
      });
  }

  ngOnDestroy(){
    this.messagesSendedSubscription.unsubscribe();
  }

  remove(toast) {
    this.alerts = this.alerts.filter(t => t !== toast);
  }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
