import { Component } from '@angular/core';

@Component({
  selector: 'app-commissionstatement',
  templateUrl: './commissionstatement.component.html',
  styleUrls: ['./commissionstatement.component.scss']
})
export class CommissionstatementComponent {


  commisonYears : any;
  commisonMonth : any = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  commsionsCycle : any = ['Cycle: 1st (1st to 15th of the month)', 'Cycle: 2nd (16th to End of the month)'];

  constructor(){}
  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.commisonYears= [currentYear,currentYear-1]
  }
}
