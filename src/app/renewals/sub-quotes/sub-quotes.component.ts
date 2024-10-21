import { Component } from '@angular/core';
import { RenewalsService } from '../renewals.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

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

  constructor(private renewalService:RenewalsService,
    private router:Router,private toast: NgToastService
  ){}

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
        if(res.success){
          this.subQuotesList=res.data;
        }
        else{
          this.toast.error({ detail: "Error", summary: "Failed to generate Subquotes List.", duration: 1000 });
        }
      },
      (err)=>{
        this.toast.error({ detail: "Error", summary: "Error while generating Subquotes List.", duration: 1000 });
      }
    )
  }
  backSubquotes(){
    this.subQuotes=false;
  }
  handleAction(renewObject:any,event:any){
      console.log("proposer PolicyNumber",renewObject.policyNumber);
      this.renewalService.setPolicyState(renewObject.policyNumber, event);
      this.router.navigate(["renewals/payment"]);
  }
}
