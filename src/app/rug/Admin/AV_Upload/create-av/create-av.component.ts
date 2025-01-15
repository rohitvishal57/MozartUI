import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { NgToastService } from 'ng-angular-popup';




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
  PatchAllAv: any;
  joy: any;
  allAxisLocations: any[] = [];
  allAxisVendors: any[] = [];
  filteredVendors: any[] = [];
  selectedLocationId: any = '';
  selectedLocation: any;
  AxisProcess: any[] = [" Inbound Phone Banking", "Outbound Call Center (OCC)"];
  selectedUserId: any | null = null;
  isUpdate: boolean = false;
  filteredAxisVendors: any;
  dataToModify!: any

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private adminService: AdminService, private toast: NgToastService) {

  }
  ngOnInit(): void {
    this.inItForm();
    this.route.paramMap.subscribe(params => {
      this.selectedUserId = params.get('avId');
      console.log('Selected User ID:', this.selectedUserId);
      if (this.selectedUserId) {
        this.getAllAVs();
      }
    });
    this.isUpdate = !!this.route.snapshot.paramMap.get('avId');
    this.getAllVendorsAndLocation();
    this.getAllLOB();
  }

  getAllAVs() {
    const endPoint = "getallAv/" + this.selectedUserId;
    this.adminService.getAllAVs(endPoint).subscribe((response: any) => {
      this.joy = JSON.parse(response.data);
      this.PatchAllAv = this.joy.data.allAvDetails.filter((res: any) =>
        res.avId == this.selectedUserId);
      console.log('Joy', this.joy)
      console.log("pathValue", this.PatchAllAv)
      if (response) {
        this.createAvForm.patchValue({
          avid: this.PatchAllAv[0].avId,
          avname: this.PatchAllAv[0].avName,
          spcode: this.PatchAllAv[0].spCode,
          avcenter: this.PatchAllAv[0].center,
          axisprocess: this.PatchAllAv[0].axisProcess,
          lefdate: this.PatchAllAv[0].licenseExpiryFromDate,
          letdate: this.PatchAllAv[0].licenseExpiryToDate,
          tlid: this.PatchAllAv[0].tlid,
          tlName: this.PatchAllAv[0].tlName,
          imdCode: this.PatchAllAv[0].imdCode,
          axisVendor: this.PatchAllAv[0].axisVendor,
          axislob: this.PatchAllAv[0].axislob
        });
        this.createAvForm.updateValueAndValidity();
      }
      let selectedLocationId = this.allAxisLocations?.filter((location: any) => location.location == this.selectedLocation)[0].axisLocationId;
      this.filteredAxisVendors = this.allAxisVendors?.filter((vendor: any) => vendor.axisLocationId == selectedLocationId);
    })

  }

  getAllVendorsAndLocation() {
    this.adminService.getAllAxisLocationAndVenors().subscribe((response: any) => {
      const res = JSON.parse(response.data);
      this.allAxisLocations = res.data.allLocations;
      this.allAxisVendors = res.data.allVendors;
    });
  }

  onLocationChange(event: any) {
    let selectedValue: any;
    if (typeof (event) === "object") {
      selectedValue = event.target.value;
    } else {
      selectedValue = event
    }
    let selectedLocation = selectedValue;
    let selectedLocationId = this.allAxisLocations?.filter((location: any) => location.location == selectedLocation)[0].axisLocationId;
    this.filteredAxisVendors = this.allAxisVendors?.filter((vendor: any) => vendor.axisLocationId == selectedLocationId);
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
      axislob: ['', Validators.required]
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
      axisLob: this.createAvForm.value.axislob,
      spCode: this.createAvForm.value.spcode,
      createdBy: 'admin'
    };

    this.adminService.createAV(formData).subscribe((response: any) => {
      console.log('create AV successfully:', response);
      this.toast.success({ detail: "Success", summary: "Successful..", duration: 3000 })
    });
    this.router.navigate(['rug/av-list']);
    console.log('Form Submitted:', this.createAvForm.value);
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
