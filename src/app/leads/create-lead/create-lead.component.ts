import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLead } from '../CreateLead';
import { LeadFormListValue } from '../leadFormListValue';
import { DatePipe } from '@angular/common';
import { LeadsService } from '../leads.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit {
  userValidations!: FormGroup;
  updateLeadStatus!: FormGroup;
  addNoteForm!: FormGroup;
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
  agentCode: any = '';
  submittedUser: any = {};
  notesSubmitted : boolean = false;
  action: String = '';
  leadNumber: String = '';
  referenceStatus: any;
  referenceSubStatus: any;
  activityTypes: any = [];
  today:string='';
  maxDate = '9999-12-31';
  whatsappOptions = [
    { value: true, display: 'Yes' },
    { value: false, display: 'No' }
  ];
  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private datePipe: DatePipe,
    public CreateLead: CreateLead,
    public CreateLeadList: LeadFormListValue,
    private cdr: ChangeDetectorRef,
    private  datepipe : DatePipe) {

  }

  async ngOnInit() {
    this.inItForm();
    this.route.queryParams.subscribe(params => {
      this.leadNumber = params['leadNumber'];
      this.action = params['action'];
    });
    if (this.leadNumber && this.action) {
    await  this.getReferenceStatus();
    await  this.fetchActivityTypeInfo();
    await  this.getLeadInformationByLeadNumber(this.leadNumber);

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
    this.today = new Date().toISOString().split('T')[0];
  }

  inItForm() {
    this.userValidations = this.formBuilder.group({
      // campaignname: ['', Validators.required],
      leadType: [''],
      leadVintage: [''],
      source: [''],
      subSource: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
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
      leadStatus: [''],
      leadSubStatus: ['']
    }
  );
     this.userValidations.get('age')?.disable();


    this.addNoteForm = this.formBuilder.group({
      activityTitle: ['', Validators.required], // activityTitle is required
      activityStartDate: ['', Validators.required], // Start date is required
      activityStartTime: ['', Validators.required], // Start time is required
      activityEndDate: ['',Validators.required], // Use null if control is not available  
      activityEndTime :  ['', Validators.required],    
      activityType: ['', Validators.required], // Activity type is required
      notes: ['', Validators.required] // Notes can be optional
    });
  }

  
  changeDob(event: any) {
    console.log("date",event.target.value);
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
      this.CreateLead = this.userValidations.getRawValue();
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
        console.log(response);
        if (response.message == 'Success') {
          if (this.action == 'updateStatus') {
            this.toast.success({ detail: 'Lead is updated successfully' });
          } else {
            this.toast.success({ detail: 'Lead is created successfully' });
          }
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
      this.submittedUser = response.data.leadList[0];
      this.updateleadInformation();
      this.changeReferStatus(this.submittedUser.leadStatus);
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
      dob: this.datepipe.transform (this.submittedUser.dob,'yyyy-MM-dd'),
      age: this.submittedUser.age,
      gender: this.submittedUser.gender == "M" ? "Male" : this.submittedUser.gender == "F" ? "Female" : "Other",
      isWhatsapp: this.submittedUser.isWhatsapp,
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
      isUpdate: this.submittedUser.isUpdate || 1 ,
      leadStatus: this.submittedUser.leadStatus
    });
    this.userValidations.get('firstname')?.disable();
    this.userValidations.get('mobilenumber')?.disable();
    this.userValidations.get('lastname')?.disable();
    this.userValidations.get('email')?.disable();
  }



  fetchActivityTypeInfo() {
    let fetchActivityTypeRequest: any = {};
    this.leadsService.fetchActivityType(fetchActivityTypeRequest).subscribe(
      (response) => {
        if(response?.data?.activityName.length){
          this.activityTypes = response?.data?.activityName;
        }
      },
      (error) => {
        console.log("Failed to fetch ActivityType information : " ,error);
      });
  }

  getReferenceStatus() {
    this.leadsService.getReferenceStatus().subscribe(
      (response:any) => {
        console.log(response);
        this.referenceStatus = response?.data;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }

  changeReferStatus(event: any) {
    if(event){
    let selectedStatus = typeof(event)=='string'?event :event.target.value;
    console.log('selectedStatus',selectedStatus);
    this.referenceSubStatus = this.referenceStatus.find((status: any) => status.name === selectedStatus);
    this.userValidations.patchValue({
      leadSubStatus: this.submittedUser.leadSubStatus
    });
          
  }
  }

  addNotesSubmit() {
    let addNotesRequestBody: any = {};
    console.log('activityType',this.addNoteForm.errors);
    this.notesSubmitted =true;
    if(this.addNoteForm.valid){
      addNotesRequestBody.activitystartdate = this.addNoteForm.value.activityStartDate,
      addNotesRequestBody.activityenddate = this.addNoteForm.value.activityEndDate,
      addNotesRequestBody.activityName = this.addNoteForm.value.activityTitle,
      addNotesRequestBody.note = this.addNoteForm.value.notes,
      addNotesRequestBody.name = this.addNoteForm.value.notes,
      addNotesRequestBody.activitytype = this.addNoteForm.value.activityType,
      addNotesRequestBody.agentcode = this.agentCode,
      addNotesRequestBody.createdat = new Date(),
      addNotesRequestBody.mobilenumber = this.submittedUser.phoneNumber,
      addNotesRequestBody.leadnumber = this.leadNumber,
      addNotesRequestBody.isupdate = 0

      console.log('addNoteForm',this.addNoteForm.errors);

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

  backToleads(){
    this.router.navigate(['/leads/leadsList'], {
  });
  }

  isNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/; // Only allow digits
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block non-numeric input
    }
  }

  onEndDateChange() {
    this.validateEndDate();
  }
  

  validateEndDate() {
    const startDate = new Date(this.addNoteForm.get('activityStartDate')?.value);
    const endDate = new Date(this.addNoteForm.get('activityEndDate')?.value);

    if (startDate && endDate && endDate < startDate) {
      this.addNoteForm.get('activityEndDate')?.setErrors({ incorrect: true }); 
    } else {
      this.addNoteForm.get('activityEndDate')?.setErrors(null); 
     }
  }

  isCharacter(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (!/[a-zA-Z]/.test(char)) {
      event.preventDefault();
    }
  }

  goBack(){
    window.history.back();
  }
  
}
