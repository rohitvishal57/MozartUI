import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLead } from '../CreateLead';
import { LeadFormListValue } from '../leadFormListValue';
import { DatePipe } from '@angular/common';
import { LeadsService } from '../leads.service';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit{
  userValidations!: FormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private leadsService: LeadsService,  private datePipe: DatePipe, public CreateLead: CreateLead, public CreateLeadList: LeadFormListValue,){

  }

  ngOnInit() {


    this.CreateLead = new CreateLead;
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.CreateLead.agentcode = storedAgentCode;
    }
    else{
      console.log("agent code is not present in local storege");
    }
    let usr = storedAgentCode ? JSON.parse(storedAgentCode) : null;
    let obj = {
      "id": 0,
      "agent": storedAgentCode
    }
    console.log(obj);
    console.log(storedAgentCode);
    this.leadsService.getActiveCampaignDetails(obj).subscribe(
      (response) => { 
        console.log(response.data);
        if (response.success) {
          console.log(response);
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
    this.inItForm();

  }
  inItForm(){
    this.userValidations = this.formBuilder.group({
      campaignname: ['', Validators.required],
      leadType: [''],
      leadVintage: [''],
      source: [''],
      subSource: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      mobilenumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      MiddleName: ['', [Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$')]],
      isWhatsapp: false,
      dob: [''],
      age: ['', [Validators.pattern('[0-9]*')]],
      gender: [''],
      maritalStatus: [''],
      numberOfKids: ['', [Validators.pattern('[0-9]*')]],
      occupation: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      address1: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      education: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      address2: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      address3: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      city: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      state: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      pincode: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      interestedProductName: [''],
      planType: [''],
      policyEndDate: [''],
      sumInsured: [null, [Validators.pattern('^[0-9a-zA-Z ,-./]*$')]],
      premium: [null, [Validators.pattern('^[0-9a-zA-Z ,.-]*$')]],
      duePremiun: [null, [Validators.pattern('^[0-9a-zA-Z ,.-]*$')]],
      familyConstruct: [''],
      policyType: [''],
      policyNumber: [null, [Validators.pattern('^[0-9a-zA-Z ,-./]*$')]],
      //campaignname:  [''],
      campaignnumber: [''],
      leadnumber: [''],
      leadAssignee: [''],
      isUpdate: 0,
    });
  }
  changeDob(event: any){
    let age:any=''
    age=this.calculateAge(event.target.value);
    this.userValidations.get('age')?.setValue(age);
    this.userValidations.updateValueAndValidity();
    this.userValidations.get('age')?.disable()
  }
  calculateAge(dob: any){
    let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return age.toString();
  }
  campnoSelected(){

  }
  onSubmit(){
    this.submitted = true;
    console.log(this.userValidations.value);
    if (this.userValidations.invalid) {
      console.log("Please Enter correct data!")
      // this.disableFormFields()

      return;
    }
    else {
      // Continue with form submission if it's valid
      this.CreateLead = this.userValidations.value;
    }
    console.log(this.CreateLead);
    this.CreateLead.campaignname = 'Self'
    this.CreateLead.dob=this.userValidations?.get('dob')?.value;
    let dobFormatted = this.datePipe.transform(this.CreateLead.dob, 'yyyy-MM-dd');
    let timeDiff = Math.abs(Date.now() - new Date(dobFormatted as string).getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.CreateLead.age = age.toString();
    console.log(this.CreateLead);
    this.leadsService.saveLeadData(this.CreateLead).subscribe(
      (response) => { 
        console.log(response.data);
        if (response.success) {
          console.log(response);
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
}
