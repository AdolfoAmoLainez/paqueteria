import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class MessagesService {

  messageSend = new Subject<any>();

  sendMessage(message:string, tipo:string){

        const newMessage={
            type: tipo,
            msg: message,
            emitted: `${new Date().toLocaleTimeString()}`,
            timeout: 5000
        }


        this.messageSend.next(newMessage);

  }
}