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
  isGroupJourney!:boolean;
  isRetailsJourney!:boolean;

  constructor(private router:Router){

  }

  ngOnInit(): void {
    this.agentCode = localStorage.getItem("agentCode");
    
  }

  Group_Journey() {
    this.router.navigate(['rug/hdfc_createBataLeads']);
    this.isGroupJourney = true;
    this.isRetailsJourney = false;
  
    // Flags ko localStorage me store karna
    localStorage.setItem('isGroupJourney', 'true');
    localStorage.setItem('isRetailsJourney', 'false');
  }
  
  Retail_Journey() {
    this.router.navigate(['rug/hdfc_createBataLeads']);
    this.isRetailsJourney = true;
    this.isGroupJourney = false;
  
    // Flags ko localStorage me store karna
    localStorage.setItem('isRetailsJourney', 'true');
    localStorage.setItem('isGroupJourney', 'false');
  }
}
