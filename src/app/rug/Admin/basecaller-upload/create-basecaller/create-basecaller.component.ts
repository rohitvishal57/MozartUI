import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-basecaller',
  templateUrl: './create-basecaller.component.html',
  styleUrls: ['./create-basecaller.component.scss']
})
export class CreateBasecallerComponent implements OnInit {
  createBaseCallerForm!: FormGroup;
  isUpdate: boolean = false;
  selectedBaseCallerId: any | null = null;
  submitted: boolean = false;
  allAxisLocations: any[] = [];
  allAxisVendors: any[] = [];
  filteredVendors: any[] = [];
  selectedLocationId: any = '';
  selectedLocation:any = '';
  filteredAxisVendors: any;
  AllManageLOB: any[] = [];
  domainId:any;
  PatchAllAv: any;
  joy: any;
  pageNo:number=1;
  noOfRows:number=100;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toast: NgToastService,
    private router: Router,
    private route: ActivatedRoute) { }
  ngOnInit() {
    this.inItForm();
    this.getAllVendorsAndLocation();
    this.getAllLOB();
    this.route.paramMap.subscribe(params => {
      this.domainId = params.get('domainId');
      console.log('Selected Domain ID:', this.domainId);
      if (this.domainId) {
        this.getAllBaseCaller();
      }
    });
    this.isUpdate = !!this.route.snapshot.paramMap.get('domainId');
  }

  getAllBaseCaller() {
    this.adminService.getAllBaseCaller(this.pageNo, this.noOfRows).subscribe(
      (response: any) => {
        try {
          const parsedData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
          const allBaseCaller = parsedData?.data?.allBaseCaller;
  
          if (!allBaseCaller || !Array.isArray(allBaseCaller)) {
            console.error("Unexpected response structure:", response);
            return;
          }
  
          this.PatchAllAv = allBaseCaller.filter((res: any) => res.domainId == this.domainId);

          this.createBaseCallerForm.patchValue({
            domainId: this.PatchAllAv[0].domainId,
            baseCallerEmpId: this.PatchAllAv[0].baseCallerEmpId,
            baseCallerName: this.PatchAllAv[0].baseCallerName,
            tlId: this.PatchAllAv[0].tlId,
            tlName: this.PatchAllAv[0].tlName,
            amId: this.PatchAllAv[0].amid,
            amName: this.PatchAllAv[0].amName,
            omId: this.PatchAllAv[0].omid,
            omName: this.PatchAllAv[0].omName,
            center: this.PatchAllAv[0].center,
            lob: this.PatchAllAv[0].lob,
            vendor: this.PatchAllAv[0].vendor,
            abhiSalesManager: this.PatchAllAv[0].abhiSalesManager,
            abhiAreaHead: this.PatchAllAv[0].abhiAreaHead,
            recruitedMonitoringManager: this.PatchAllAv[0].recruitedMonitoringManagerCode,
            imdCode: this.PatchAllAv[0].imdCode
          });
  
          this.createBaseCallerForm.updateValueAndValidity();
  
          const selectedLocation = this.allAxisLocations.find(
            (location: any) => location.location === this.selectedLocation
          );
  
          const selectedLocationId = selectedLocation?.axisLocationId;
          this.filteredAxisVendors = this.allAxisVendors.filter(
            (vendor: any) => vendor.axisLocationId === selectedLocationId
          );
  
        } catch (error) {
          console.error("Error parsing or processing response:", error);
        }
      },
      (error) => {
        console.error("Error fetching base caller data:", error);
      }
    );
  }
  


  inItForm() {
    this.createBaseCallerForm = this.formBuilder.group({
      domainId: ['', [Validators.required]],
      baseCallerEmpId: ['', [Validators.required]],
      baseCallerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      tlId: ['', [Validators.required]],
      tlName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      amId: ['', [Validators.required]],
      amName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      omId: ['', [Validators.required]],
      omName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      center: ['', [Validators.required]],
      lob: ['', Validators.required],
      vendor: ['', Validators.required],
      abhiSalesManager: ['', [Validators.required]],
      abhiAreaHead: ['', [Validators.required]],
      recruitedMonitoringManager: ['', [Validators.required]],
      imdCode: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    console.log(this.createBaseCallerForm.value);
    this.submitted = true;
    if (this.createBaseCallerForm.invalid) {
      const firstInvalidControl = Object.keys(this.createBaseCallerForm.controls).find(
        control => this.createBaseCallerForm.get(control)?.invalid
      );
      if (firstInvalidControl) {
        const invalidElement = document.getElementById(firstInvalidControl);
        invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const formData = {
      domainId: this.createBaseCallerForm.value.domainId,
      baseCallerEmpId: this.createBaseCallerForm.value.baseCallerEmpId,
      baseCallerName: this.createBaseCallerForm.value.baseCallerName,
      status: 'Active',
      tlId: this.createBaseCallerForm.value.tlId,
      tlName: this.createBaseCallerForm.value.tlName,
      amid: this.createBaseCallerForm.value.amId,
      amName: this.createBaseCallerForm.value.amName,
      omid: this.createBaseCallerForm.value.omId,
      omName: this.createBaseCallerForm.value.omName,
      center: this.createBaseCallerForm.value.center,
      lob: this.createBaseCallerForm.value.lob,
      vendor: this.createBaseCallerForm.value.vendor,
      abhiSalesManager: this.createBaseCallerForm.value.abhiSalesManager,
      abhiAreaHead: this.createBaseCallerForm.value.abhiAreaHead,
      recruitedMonitoringManagerCode: this.createBaseCallerForm.value.recruitedMonitoringManager,
      imdCode: this.createBaseCallerForm.value.imdCode,
      createdBy: 'teleadmin2'
    };
    this.adminService.createUpdatebaseCaller(formData).subscribe((response: any) => {
      console.log('create BaseCaller successfully:', response);
      this.toast.success({ detail: "Success", summary: "Successful..", duration: 3000 })
    });
    this.router.navigate(['rug/basecaller']);
    console.log('Form Submitted:', this.createBaseCallerForm.value);
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
}
