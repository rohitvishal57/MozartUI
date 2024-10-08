import { Component } from '@angular/core';
import { RenewalList } from 'src/app/interface/renewal-list.interface';

@Component({
  selector: 'app-sub-quotes',
  templateUrl: './sub-quotes.component.html',
  styleUrls: ['./sub-quotes.component.scss']
})

export class SubQuotesComponent {

  subQuotes:boolean=false;
  selectedView: string = "list";
  subQuotesList:RenewalList[]=[]

  constructor(){}

  ngOnInit()
  {
  }

  compareQuotes()
  {
    this.subQuotes=true    
  }
  quotesView(view: string)
  {
    this.selectedView = view;
    console.log("subquotes method is calling",this.selectedView);
  }

}
