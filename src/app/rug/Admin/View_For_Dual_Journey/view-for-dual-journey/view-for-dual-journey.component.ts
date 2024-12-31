import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-for-dual-journey',
  templateUrl: './view-for-dual-journey.component.html',
  styleUrls: ['./view-for-dual-journey.component.scss']
})
export class ViewForDualJourneyComponent implements OnInit{
soloJourneyForm!: FormGroup
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedAVs: any[] = [];
  searchTerm: string = '';
  today: string = '';
  filterAllAvs = [];

  Location: any[] = ["Noida", "Hyderabad", "Bangalore", "Mumbai", "Kolkata"];
  AxisProcess: any[] = ["Inbound Phone Banking", "Outbound Call Center (OCC)"];
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.inItForm();
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

  clearFilter() {
    this.soloJourneyForm.reset();
  }

  audit(index: any) {
    // let value = this.AllAVs[index]
    // const dialogRef = this.dialog.open(AuditComponent, {
    //   width: "1000px",
    //   autoFocus: false,
    //   data: {
    //     value: value
    //   }
    // })
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    // this.getAllAVs();
  }

}
