import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hdfc-journey-selections',
  templateUrl: './hdfc-journey-selections.component.html',
  styleUrls: ['./hdfc-journey-selections.component.scss']
})
export class HdfcJourneySelectionsComponent implements OnInit{
  agentCode: any;
  isShowQCJourney:boolean = false;


  constructor(private router:Router){

  }

  ngOnInit(): void {
    this.agentCode = localStorage.getItem("agentCode");

    if(this.agentCode == 'QC'){
        this.isShowQCJourney = false;
    }

    
  }

  Group_Journey(){
    this.router.navigate(['rug/hdfc_createBataLeads']);
  }
}
