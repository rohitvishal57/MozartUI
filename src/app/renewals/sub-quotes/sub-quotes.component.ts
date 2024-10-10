import { Component } from '@angular/core';
import { RenewalList } from 'src/app/interface/renewal-list.interface';
import { RenewalsService } from '../renewals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-quotes',
  templateUrl: './sub-quotes.component.html',
  styleUrls: ['./sub-quotes.component.scss']
})

export class SubQuotesComponent {

  subQuotes:boolean=false;
  selectedView: string = "list";
  subQuotesList:RenewalList[]=[]
  renewalInfo:any={}

  constructor(private renewalService:RenewalsService,private router: Router){
  }

  ngOnInit() {
    this.getRenewalInfo();
    // this.renewalService.getQuote().subscribe((policy:any) => {
    //   console.log('Received policy data:', policy);
    //   });
  }
  getRenewalInfo() {
    this.renewalService.getRenewalInfoApi("21-24-0002334-00", {}).subscribe(
      (res:any) => {
        this.renewalInfo = JSON.parse(res.data);
      },
      (err) => {
        console.log("Error coming from getRenewalInfo API", err);
      }
    );
  }
  handleAction(value:any, task:any){
  }
  
  compareQuotes(){
    this.subQuotes=true    
  }
  quotesView(view: string){
    this.selectedView = view;
  }

}
