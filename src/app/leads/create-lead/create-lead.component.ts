import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLead } from '../CreateLead';
import { LeadFormListValue } from '../leadFormListValue';
import { DatePipe } from '@angular/common';
import { LeadsService } from '../leads.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit {
  userValidations!: FormGroup;
  updateLeadStatus!:FormGroup;
  addNoteForm!:FormGroup;
  submitted: boolean = false;
  otpEntered: boolean = false;
  enteredOTP: string = '';
  sendOTPEnabled: boolean = false;
  YESSearchValue: string = "";
  YESSearchby: any[] = ['Customer ID'];
  YESSearchCategory: any;
  IDFCSearchValue = ''
  dataToDisplay: any;
  isYESuser = false;
  isAUuser = false;
  AUSearchby: any[] = ['Customer ID', 'Aadhar Card', 'PAN Card'];
  AUSearchCategory: any;
  isIDFCUser = false;
  AUSearchValue: string = "";
  agentCode: any='';
  submittedUser: any = {};
  action :String ='';
  leadNumber:String ='';
  referenceStatus : any ;
  referenceSubStatus : any;
  activityTypes: any = [];
  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private datePipe: DatePipe,
    public CreateLead: CreateLead,
    public CreateLeadList: LeadFormListValue,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.inItForm();
    this.route.queryParams.subscribe(params => {
      this.leadNumber = params['leadNumber'];
      this.action = params['action'];

      console.log("updateStatus action",this.action);
    });
    if (this.leadNumber!='') {
      this.getLeadInformationByLeadNumber(this.leadNumber);
    } 
    this.CreateLead = new CreateLead;
    const storedAgentCode = localStorage.getItem('agentCode');
    this.agentCode = storedAgentCode;
    if (storedAgentCode) {
      this.CreateLead.AgentCode = storedAgentCode.toString();
    }
    else {
      console.log("agent code is not present in local storege");
    }

 
    let usr = storedAgentCode ? JSON.parse(storedAgentCode) : null;
    let obj = {
      "id": 0,
      "agent": storedAgentCode
    }
    this.agentCode = obj.agent;
    console.log(obj);
    console.log(storedAgentCode);
    // this.leadsService.getActiveCampaignDetails(obj).subscribe(
    //   (response) => { 
    //     console.log(response.data);
    //     if (response.success) {
    //       console.log(response);
    //     } 
    //     else {console.error("API request was not successful.");}
    //   },
    //   (error) => {
    //     console.error("Error from getRenewalsList API:", error);
    //   }
    // );
    this.getReferenceStatus();

    let fetchActivityTypeRequest: any = {};
    this.leadsService.fetchActivityType(fetchActivityTypeRequest).subscribe(
      (response) => {
        console.log("ActivityType information : " + response.activityName);
        this.activityTypes = response.activityName;
      },
      (error) => {

      });
  }
  
  inItForm() {
    this.userValidations = this.formBuilder.group({
      // campaignname: ['', Validators.required],
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
      status:[''],
      substatus:[''] 
    });

    
    
    this.addNoteForm = this.formBuilder.group({
      title: [''],
      activityStartDate: [''],
      activityStartTime: [''],
      activityEndDate: [''],
      activityEndTime: [''],
      activityType: [''],
      notes: [''],
    });
  }

  changeDob(event: any) {
    let age: any = ''
    age = this.calculateAge(event.target.value);
    this.userValidations.get('age')?.setValue(age);
    this.userValidations.updateValueAndValidity();
    this.userValidations.get('age')?.disable()
  }
  calculateAge(dob: any) {
    let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return age.toString();
  }
  campnoSelected() {

  }
  SETAUDATA() {
  }
  SETIDFCDATA() {
  }
  checkEnableSendOTP() {
    // Check if the Identification Number field is not empty to enable Send OTP button
    this.sendOTPEnabled = this.YESSearchValue.trim() !== '';
  }
  validate() {

  }
  sendOTP() {
  }
  onSubmit() {
    this.submitted = true;

    if (this.userValidations.invalid) {
      // this.disableFormFields()
      return;
    }
    else {
      // Continue with form submission if it's valid
      this.CreateLead = this.userValidations.value;
    }
    this.CreateLead.AgentCode = this.agentCode;
    this.CreateLead.PhoneNumber = this.userValidations.get('mobilenumber')?.value;
    this.CreateLead.campaignname = 'Self'
    this.CreateLead.dob = this.userValidations?.get('dob')?.value;
    let dobFormatted = this.datePipe.transform(this.CreateLead.dob, 'yyyy-MM-dd');
    let timeDiff = Math.abs(Date.now() - new Date(dobFormatted as string).getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.CreateLead.age = age.toString();

    this.leadsService.saveLeadData(this.CreateLead).subscribe(
      (response) => {
        console.log(response.data);
        if (response.success) {
          this.toast.success({ detail: 'Lead is created successfully' });
          console.log(response);
          this.router.navigate(['leads/leadsList'])
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        // this.toast.error({ detail: 'Failed to submit claims' });

        console.error("Error from getRenewalsList API:", error);
      }
    );

  }

  getLeadInformationByLeadNumber(leadNumber: any) {
    console.log("getLeadInformationByLeadNumber ", leadNumber)
    let requestBody: any = {};
    requestBody.agentCode = localStorage.getItem('agentCode');
    requestBody.myleads = false;
    requestBody.assignedleads = false;
    requestBody.unassignedleads = false;
    requestBody.start = 1;
    requestBody.viewBy = [];
    requestBody.length = 10;
    requestBody.searchby = leadNumber;
    requestBody.isSellerPortal = true;

    this.leadsService.getLeadInfoByLeadID(requestBody).subscribe((response) => {
      this.submittedUser = response.leadList[0];
      this.updateleadInformation();
    },
      (error) => {
        console.log("Failed to fetch lead Information!")
      }
    );

  }

  updateleadInformation() {
    this.userValidations.patchValue({
      firstname: this.submittedUser.firstName,
      MiddleName: this.submittedUser.middleName,
      lastname: this.submittedUser.lastName,
      email: this.submittedUser.email,
      mobilenumber: this.submittedUser.phoneNumber,
      dob: this.submittedUser.dob,
      age: this.submittedUser.age,
      gender: this.submittedUser.gender == "M" ? "Male" : this.submittedUser.gender == "F" ? "Female" : "Other",
      maritalStatus: this.submittedUser.maritalStatus,
      numberOfKids: this.submittedUser.numberOfKids,
      occupation: this.submittedUser.occupation,
      education: this.submittedUser.education,
      address1: this.submittedUser.address1,
      address2: this.submittedUser.address2,
      address3: this.submittedUser.address3,
      city: this.submittedUser.city,
      state: this.submittedUser.state,
      pincode: this.submittedUser.pincode,
      interestedProductName: this.submittedUser.interestedProductName,
      planType: this.submittedUser.planType,
      policyEndDate: this.submittedUser.policyEndDate,
      sumInsured: this.submittedUser.sumInsured,
      premium: this.submittedUser.premium,
      duePremiun: this.submittedUser.duePremiun,
      familyConstruct: this.submittedUser.familyConstruct,
      policyType: this.submittedUser.policyType,
      policyNumber: this.submittedUser.policyNumber,
      campaignname: this.submittedUser.campaignname,
      campaignnumber: this.submittedUser.campaignnumber,
      leadnumber: this.submittedUser.leadNumber,
      leadAssignee: this.submittedUser.leadAssignee,
      isUpdate: this.submittedUser.isUpdate || 1 // Default to 0 if undefined
    });

this.userValidations.get('firstname')?.disable();
this.userValidations.get('mobilenumber')?.disable();
this.userValidations.get('lastname')?.disable();
this.userValidations.get('email')?.disable();


  }

  getReferenceStatus() {
    this.leadsService.getReferenceStatus().subscribe(
      (response) => {
        console.log(response);
        this.referenceStatus = response;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }

  changeReferStatus(event: any) {
    console.log(event.target.value);
    let selectedStatus = event.target.value
    this.referenceSubStatus = this.referenceStatus.find((status: any) => status.name === selectedStatus);
  }


  
  updateStatusSubmit() {
    let reqObj = {
      agentcode: this.agentCode,
      statusMessage: "Approval",
      statusCode: "334",
      sessionId: "8",
      response: "ok",
      leadnumber: this.leadNumber,
      status: this.updateLeadStatus.get('referenceStatus')?.value,
      substatus: this.updateLeadStatus.get('referenceSubStatus')?.value
    }
    this.leadsService.updateStatus(reqObj).subscribe(
      (response) => {
        this.toast.success({ detail: 'Lead updated  Added successfully' });
        this.router.navigate(['leads/leadsList'])
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }

  addNotesSubmit() {
    let addNotesRequestBody: any = {};
    addNotesRequestBody.activitystartdate = this.addNoteForm.value.activityStartDate,
      addNotesRequestBody.activityenddate = this.addNoteForm.value.activityEndDate,
      addNotesRequestBody.activityName = this.addNoteForm.value.title,
      addNotesRequestBody.note = this.addNoteForm.value.notes,
      addNotesRequestBody.name = this.addNoteForm.value.notes,
      addNotesRequestBody.activitytype = this.addNoteForm.value.activityType,
      addNotesRequestBody.agentcode = this.agentCode,
      addNotesRequestBody.createdat = new Date(),
      addNotesRequestBody.mobilenumber = this.submittedUser.phoneNumber,
      addNotesRequestBody.leadnumber = this.leadNumber,
      addNotesRequestBody.isupdate = 0

    this.leadsService.addLeadNotes(addNotesRequestBody).subscribe(
      (response) => {
        if (response.statusMessage == "Success") {
          this.toast.success({ detail: 'Note Added successfully' });
          this.router.navigate(['leads/leadsList'])
        }
      }, (error) => {
        console.error("Error from addLeadNotes API:", error);
      }
    );
  }


}
