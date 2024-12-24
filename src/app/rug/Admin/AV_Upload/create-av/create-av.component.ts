import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { NgToastService } from 'ng-angular-popup';
import { endOfDay } from 'date-fns';




@Component({
  selector: 'app-create-av',
  templateUrl: './create-av.component.html',
  styleUrls: ['./create-av.component.scss']
})
export class CreateAVComponent implements OnInit {
  createAvForm!: FormGroup;
  action: String = '';
  submitted: boolean = false;
  today: string = '';
  AllManageLOB: any[] = [];
  isEditMode: boolean = false;
  allAxisLocations: any[] = []; 
  allAxisVendors: any[] = [];   
  filteredVendors: any[] = [];  
  selectedLocationId:any = ''; 
  selectedUserId: string | null = null;

  center: any[] = ["Noida", "Bengalore", "Hyderabad", "Mumbai", "Kolkata", "Ahemedabad"];
  AxisProcess: any[] = [" Inbound Phone Banking", "Outbound Call Center (OCC)"];
  AxisVendor: any[] = ["ALTRUIST", "CONNEQT", "HGS", "COGENT", "GENPACT", "ONROLL"];
  AxisLob: any[] = ["OCC Priority", "OCC Burgundy", "OCC CLCM", "OCC NDRM", "OCC CASA Domestic", "OCC NRI Acq",
    "AFF", "BGY", "Credit Cards", "FASTag", "PRI", "Retail Assets", "Retail Banking",
    "testocc"
  ];


  constructor(private formBuilder: FormBuilder, private router: Router, private adminService: AdminService, private toast: NgToastService) {

  }
  ngOnInit(): void {

    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state?.['data'];

    if (stateData) {
      this.isEditMode = true;
      this.createAvForm.patchValue(stateData);
    }

    this.inItForm();
    this.getAllVendorsAndLocation();
    this.getAllLOB();
  }

  getAllVendorsAndLocation() {
    this.adminService.getAllAxisLocationAndVenors().subscribe((response: any) => {
      // Parsing the response
      const res = JSON.parse(response.data);
      this.allAxisLocations = res.data.allLocations;
      this.allAxisVendors = res.data.allVendors;
    });
  }
 
  onLocationChange(selectedLocationId: number) {
    console.log('Location Changed:', selectedLocationId);  // Check if this is triggered
    this.filteredVendors = this.allAxisVendors.filter(vendor => 
      vendor.axisLocationId == selectedLocationId);
   console.log('vendors', this.filteredVendors);
  }

  getAllLOB() {
    this.adminService.getAllManageLOB().subscribe(
      (response: any) => {
        response = JSON.parse(response.data);
        console.log('Full API Response:', response); 
        if (response?.data?.allManageLobs) {
          this.AllManageLOB = response.data.allManageLobs.map((item: any) => item.lobName);
          console.log('LOB Names:', this.AllManageLOB);
        } else {
          console.error('allManageLobs not found or invalid API Response:', response);
          this.AllManageLOB = []; 
        }
      },
      (error) => {
        console.error('Error fetching LOB data:', error);
        this.AllManageLOB = []; 
      }
    );
  }
  
  

  inItForm() {
    this.createAvForm = this.formBuilder.group({
      avid: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      avname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      spcode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      avcenter: ['', Validators.required],
      axisprocess: ['', Validators.required],
      lefdate: ['', Validators.required],
      letdate: ['', Validators.required],
      tlid: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      tlName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      imdCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      axisVendor: ['', Validators.required],
      axisLob: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.createAvForm.invalid) {
      const firstInvalidControl = Object.keys(this.createAvForm.controls).find(
        control => this.createAvForm.get(control)?.invalid
      );
      if (firstInvalidControl) {
        const invalidElement = document.getElementById(firstInvalidControl);
        invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return; 
    }
    const formData = {
      avId: this.createAvForm.value.avid,
      avName: this.createAvForm.value.avname,
      center: this.createAvForm.value.avcenter,
      axisProcess: this.createAvForm.value.axisprocess,
      status: 'Active',
      licenseExpiryFromDate: this.createAvForm.value.lefdate,
      licenseExpiryToDate: this.createAvForm.value.letdate,
      tlid: this.createAvForm.value.tlid,
      tlName: this.createAvForm.value.tlName,
      imdCode: this.createAvForm.value.imdCode,
      axisVendor: this.createAvForm.value.axisVendor,
      axisLob: this.createAvForm.value.axisLob,
      spCode: this.createAvForm.value.spcode,
      createdBy: 'admin'
    };

    this.adminService.createAV(formData).subscribe((response: any) => {
        console.log('create AV successfully:', response);
        this.toast.success({ detail: "SUCCESS", summary: "URL copied to clipboard!", duration: 3000 })
      });
    this.router.navigate(['rug/av-list']);
    console.log('Form Submitted:', this.createAvForm.value);
  }

  updateData() {
  
  }
  

  backToAV() {
    this.router.navigate(['rug/av-list']);
  }

  isNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/; // Only allow digits
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block non-numeric input
    }
  }


  isCharacter(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (!/[a-zA-Z ]/.test(char)) {
      event.preventDefault();
    }
  }
  campnoSelected() { }
  SETAUDATA() { }
  SETIDFCDATA() { }
  validate() { }
  sendOTP() { }
}
