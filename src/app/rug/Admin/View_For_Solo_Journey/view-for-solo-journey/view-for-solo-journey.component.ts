import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-for-solo-journey',
  templateUrl: './view-for-solo-journey.component.html',
  styleUrls: ['./view-for-solo-journey.component.scss']
})
export class ViewForSoloJourneyComponent implements OnInit{
  soloJourneyForm!:FormGroup
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedAVs: any[] = [];
  searchTerm: string = '';
  today: string = '';

  filterAllAvs = [];
constructor(private fb:FormBuilder){

}
  ngOnInit(): void {
    
  }

  inItForm() {
      this.soloJourneyForm = this.fb.group({
        mobileno: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        leadid: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
        policyno: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        location: ['', Validators.required],
        lgdate: ['', Validators.required],
        pidate: ['', Validators.required],
        axisprocess: ['', Validators.required]
      });
    }


  onInput(event: any) {
    // this.searchTerm = event.target.value.toLowerCase();
    // this.displayedAVs = this.AllAVs.filter((option: any) =>
    //   option?.center?.toLowerCase().includes(this.searchTerm) ||
    //   option?.avId?.toLowerCase().includes(this.searchTerm) ||
    //   option?.avName?.toLowerCase().includes(this.searchTerm) ||
    //   option?.lefdate?.toLowerCase().includes(this.searchTerm) ||
    //   option?.letdate?.toLowerCase().includes(this.searchTerm) ||
    //   option?.status?.toLowerCase().includes(this.searchTerm) ||
    //   option?.axisprocess?.toLowerCase().includes(this.searchTerm)
    // );
  }
}
