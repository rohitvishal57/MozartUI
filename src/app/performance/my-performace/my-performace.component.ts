import { Component } from '@angular/core';

@Component({
  selector: 'app-my-performace',
  templateUrl: './my-performace.component.html',
  styleUrls: ['./my-performace.component.scss']
})
export class MyPerformaceComponent {
  selectedTabIndex: number = 0;
  docType = 'Monthly';
  detailedList: any;
  selectedView: string = "Monthly";
  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
  }
  toggleView(key: any){
    console.log(key);
    this.selectedView = key;
  }
}
