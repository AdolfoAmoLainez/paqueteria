import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute,Params} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit,OnDestroy {

  error: string;
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.error = this.route.snapshot.params['error'];
    this.paramsSubscription=this.route.params.subscribe(
      (params: Params) => {
        //console.log(params);
        this.error = params['error'];
      }
     );
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

}
