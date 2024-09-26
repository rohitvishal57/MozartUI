import { Component } from '@angular/core';

@Component({
  selector: 'app-sub-quotes',
  templateUrl: './sub-quotes.component.html',
  styleUrls: ['./sub-quotes.component.scss']
})

export class SubQuotesComponent {

  subQuotes:boolean=false;
  selectedView: string = "list";

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
