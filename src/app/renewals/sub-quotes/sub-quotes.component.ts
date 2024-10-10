import { Component } from '@angular/core';
import { RenewalsService } from '../renewals.service';

@Component({
  selector: 'app-sub-quotes',
  templateUrl: './sub-quotes.component.html',
  styleUrls: ['./sub-quotes.component.scss']
})

export class SubQuotesComponent {

  subQuotes:boolean=false;
  selectedView: string = "list";
  policyNumber:string=''
  subQuotesList:any=[];
  selectedQuotes: any[] = [];
  selected: any = [];

  constructor(private renewalService:RenewalsService){}

  ngOnInit()
  {
    this.renewalService.policy$.subscribe(policy => {
      if(policy.policyNo){
      this.policyNumber=policy.policyNo;
   }});
   this.getSubquotes();
  }
  compareQuotes() {
    this.subQuotes = true; 
    this.selectedQuotes = this.subQuotesList.filter((quote: any) => quote.selected);  
    console.log("Selected Quotes:", this.selectedQuotes);
    this.selectedQuotes.forEach(quote => {
    if (typeof quote.nomineeDetails === 'string') {
        try {
          quote.nomineeDetails = JSON.parse(quote.nomineeDetails);
        } catch (e) {
          console.error("Error parsing nomineeDetails", e);
        }
      }
    if (typeof quote.members === 'string') {
        try {
          quote.members = JSON.parse(quote.members);  
        } catch (e) {
          console.error("Error parsing members", e);
        }
      }
      quote.members.forEach((member: any) => {
        member.roomCategory = null; 
        member.MemberproductComponents?.forEach((component: any) => {
          const roomCategoryComponent = component.productComponent?.find(
            (pc: any) => pc.productComponentName === 'RoomCategory'
          );
          if (roomCategoryComponent) {
            member.roomCategory = roomCategoryComponent.productComponentValue;
          }
        });
      });
    });
  }
  quotesView(view: string)
  {
    this.selectedView = view;
  }
  getSubquotes(){
    this.renewalService.getSubquotesApi("21-24-0002334-00",{}).subscribe(
      (res:any)=>{
        this.subQuotesList=res.data;
        console.log("subquotes data",this.subQuotesList)
      },
      (err)=>{
        console.log("error coming from sub quotes api",err);
      }
    )
  }
}
