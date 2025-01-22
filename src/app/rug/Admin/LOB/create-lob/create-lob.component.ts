import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})
export class CreateLobComponent implements OnInit {
  createLob!: FormGroup;
  isUpdate: boolean = false;
  submitted: boolean = false;
  AxisProcess: any[] = [" Inbound Phone Banking", "Outbound Call Center (OCC)"];
  SoloJourney: any[] = [" Enabled", "Disabled"];
  DualJourney: any[] = [" Enabled", "Disabled"];
  isToshow: boolean = false;
  lobData: any;
  selectedUserId: any | null = null;
  AllManageLOB: any[] = [];
  PatchAllAv: any;
  joy: any;


  constructor(private fb: FormBuilder, private router: Router, private matdialogue: MatDialog, private adminServise: AdminService, private route: ActivatedRoute) {
   
  }

  ngOnInit(): void {
    this.inItForm();
    this.route.paramMap.subscribe(params => {
      this.selectedUserId = params.get('lobName');
      this.isUpdate = !!this.selectedUserId;
      console.log('Selected User ID:', this.selectedUserId);
      if (this.selectedUserId) {
        this.getAllLob();
      }
    });
    this.isUpdate = !!this.route.snapshot.paramMap.get('lobName');

  }

  inItForm() {
    this.createLob = this.fb.group({
      lobId: [0],
      lobName: ['', Validators.required],
      soloJourney: [''],
      dualJourney: [''],
      axisProcess: ['', Validators.required]
    });
  }

  getAllLob() {
    const endPoint = 'getAllManageLob/' + this.selectedUserId;
    this.adminServise.getAllManageLOB(endPoint).subscribe((response: any) => {
      const parsedData = JSON.parse(response.data);
      console.log('Full API Response:', parsedData);
  
      // Accessing the relevant part of the response
      this.AllManageLOB = parsedData?.data?.allManageLobs || [];
      this.PatchAllAv = this.AllManageLOB.filter(
        (res: any) => res.lobName === this.selectedUserId
      );
  
      console.log('Filtered Data (PatchAllAv):', this.PatchAllAv);
  
      // Patch form with the filtered data
      if (this.PatchAllAv && this.PatchAllAv.length > 0) {
        const patchData = this.PatchAllAv[0];
        this.createLob.patchValue({
          lobId: patchData.lobId || 0,
          lobName: patchData.lobName || '',
          soloJourney: patchData.soloJourney || '', // Corrected property name
          dualJourney: patchData.dualJourney || '', // Corrected property name
          axisProcess: patchData.axisProcess || ''
        });
        this.createLob.updateValueAndValidity();
      } else {
        console.error('No matching data found for selectedUserId');
      }
    });
  }
  
  

  backToLOBList() {
    this.router.navigate(['rug/manage-LOB']);
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.createLob.valid) {
      const reqData: any = {
        lobId: this.createLob.get('lobId')?.value || 0, 
        lobName: this.createLob.get('lobName')?.value.trim(),
        axisProcess: this.createLob.get('axisProcess')?.value,
        createdBy: 'teleadmin2',
      };
  
      if (!this.isUpdate) {
        reqData.isSoloJourney =
          this.createLob.get('soloJourney')?.value?.trim() === 'Enabled';
        reqData.isDualJourney =
          this.createLob.get('dualJourney')?.value?.trim() === 'Enabled';
  
        if (reqData.isSoloJourney === reqData.isDualJourney) {
          const errorMessage = reqData.isSoloJourney
            ? "An LOB cannot have both Journey's Enabled"
            : "An LOB cannot have both Journey's Disabled";
          this.matdialogue.open(SuccesspopupComponent, {
            width: '500px',
            data: errorMessage,
          });
          return;
        }
      }
      this.adminServise.createLob(reqData).subscribe((res: any) => {
          console.log('API Response:', res);
          this.router.navigate(['rug/manage-LOB']);
        },
        (error) => {
          console.error('API error:', error);
        }
      );
    } else {
      console.error('Form is invalid. Please check the required fields.');
    }
  }
  
}
