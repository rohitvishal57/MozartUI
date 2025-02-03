
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';

import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-lob',
  templateUrl: './create-lob.component.html',
  styleUrls: ['./create-lob.component.scss']
})
export class CreateLobComponent {
  createLob!: FormGroup;
  isUpdate: boolean = false;
  submitted: boolean = false;
  AxisProcess: any[] = [" Inbound Phone Banking", "Outbound Call Center (OCC)"];
  SoloJourney: any[] = [" Enabled", "Disabled"];
  DualJourney: any[] = [" Enabled", "Disabled"];
  errorSameOption: boolean = false;
  selectedUserId: any | null = null;
  AllManageLOB:any;
  PatchAllLob:any;

  constructor(private fb:FormBuilder, private router: Router, private route: ActivatedRoute, private matdialogue: MatDialog, private adminServise:AdminService){

  }

    ngOnInit(): void {
      this.inItForm();
      this.route.paramMap.subscribe(params => {
        this.selectedUserId = params.get('lobName');
        this.isUpdate = !!this.selectedUserId;
        console.log('Selected User ID:', this.selectedUserId);
        if (this.selectedUserId) {
          this.getAllLOB();
        }
      });
      this.isUpdate = !!this.route.snapshot.paramMap.get('lobName');
    }

    inItForm() {
        this.createLob = this.fb.group({
        lobName:['', Validators.required],
        soloJourney:[''],
        dualJourney:[''],
        axisProcess:['', Validators.required]
        });
      }
    
    backToLOBList(){
      this.router.navigate(['rug/manage-LOB']);
    }

    getAllLOB(){
      const endPoint = 'getAllManageLob/' + this.selectedUserId;
      this.adminServise.getAllManageLOB(endPoint).subscribe((response: any) => {
        const parsedData = JSON.parse(response.data);
        console.log('Full API Response:', parsedData);
        
        this.AllManageLOB = parsedData?.data?.allManageLobs || [];
        this.PatchAllLob = this.AllManageLOB.filter((res: any) =>
          res.lobName === this.selectedUserId
        );
    
        console.log('Filtered Data (PatchAllAv):', this.PatchAllLob);
    
        if (this.PatchAllLob && this.PatchAllLob.length > 0) {
          this.createLob.patchValue({
            lobId: this.PatchAllLob[0].lobId || 0,
            lobName: this.PatchAllLob[0].lobName || '',
            singleJouey : this.PatchAllLob[0].singleJourney? 'Enabled' : 'Disabled',
            dualJouey : this.PatchAllLob[0].dualJourney? 'Enabled' : 'Disabled',
            axisProcess: this.PatchAllLob[0].axisProcess || ''
          });
          this.createLob.updateValueAndValidity();
        } else {
          console.error('No matching data found for selectedUserId');
        }
      });
    }

    onSubmit(): void {
      this.submitted = true;
    
      if (this.createLob.valid) {
        const singleJourneyValue = this.createLob.get('singleJourney')?.value?.trim() || 'Enabled';
        const dualJourneyValue = this.createLob.get('dualJourney')?.value?.trim() || 'Disabled';
    
        const reqData: any = {
          lobId: this.createLob.get('lobId')?.value || 0,
          lobName: this.createLob.get('lobName')?.value.trim(),
          axisProcess: this.createLob.get('axisProcess')?.value,
          createdBy: 'teleadmin2',
          isSoloJourney: singleJourneyValue === 'Enabled',
          isDualJourney: dualJourneyValue === 'Enabled',
        };
    
        console.log('Request Data before submission:', reqData);
    
        if (!this.isUpdate) {
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
    
        this.adminServise.createLob(reqData).subscribe(
          (res: any) => {
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
