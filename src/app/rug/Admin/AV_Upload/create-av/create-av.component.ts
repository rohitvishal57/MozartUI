import {  Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AVFormListValue } from '../../AVFormListValue';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { isValid } from 'date-fns';



@Component({
  selector: 'app-create-av',
  templateUrl: './create-av.component.html',
  styleUrls: ['./create-av.component.scss']
})
export class CreateAVComponent implements OnInit{
  createAvForm!: FormGroup;
  action: String = '';
  submitted: boolean = false;
  today: string = '';

  center:any[]=["Noida", "Bengalore", "Hyderabad", "Mumbai", "Kolkata", "Ahemedabad"];
  AxisProcess:any[]=[" Inbound Phone Banking", "Outbound Call Center (OCC)"];
  AxisVendor:any[]=["ALTRUIST", "CONNEQT", "HGS", "COGENT", "GENPACT", "ONROLL"];


constructor(private formBuilder:FormBuilder, private router: Router){

}
  ngOnInit(): void {
    this.inItForm();
  }
    
inItForm() {

      // Initialize userValidations form group
    this.createAvForm = this.formBuilder.group({
      avid: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]],
      avname: ['', [Validators.required,Validators.pattern('^[a-zA-Z]*$')]],
      spcode: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]],
      avcenter: ['', Validators.required],
      axisprocess: ['', Validators.required],
      lefdate: ['', Validators.required],
      letdate: ['', Validators.required],
      tlid: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]],
      tlName: ['', [Validators.required,Validators.pattern('^[a-zA-Z]*$')]],
      imdCode: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]],
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
      this.router.navigate(['rug/av_list']);
    console.log('Form Submitted:', this.createAvForm.value);
  }

    backToAV() {
      this.router.navigate(['rug/av_list']);
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
    campnoSelected() {}
    SETAUDATA() {}
    SETIDFCDATA() {}
    validate() {}
    sendOTP() {}
}
