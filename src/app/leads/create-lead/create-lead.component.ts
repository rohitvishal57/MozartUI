import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLead } from '../CreateLead';
import { LeadFormListValue } from '../leadFormListValue';
import { DatePipe } from '@angular/common';
import { LeadsService } from '../leads.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

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
  notesSubmitted: boolean = false;
  action: String = '';
  leadNumber: String = '';
  referenceStatus: any;
  referenceSubStatus: any;
  activityTypes: any = [];
  today: string = '';
  maxDate = '9999-12-31';
  notes: any = [];
  whatsappOptions = [
    { value: true, display: 'Yes' },
    { value: false, display: 'No' }
  ];
  productsList: any = [];
  productSumInsured: any = [];
  occupationInfo : any;
  pincodeResponse : any='';
 
  constructor(private formBuilder: FormBuilder,private toast: NgToastService, private router: Router,private route: ActivatedRoute,private leadsService: LeadsService,
    private datePipe: DatePipe,public CreateLead: CreateLead, public CreateLeadList: LeadFormListValue,private cdr: ChangeDetectorRef,private datepipe: DatePipe,
    private commonService: CommonService, private languageService: LanguageService, private translateService: TranslateService,private common: CommonService) {}

  async ngOnInit() {

      // Subscribe to language changes and update the translation service
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

      // Initialize the form
    this.inItForm();

    this.CreateLead = new CreateLead;
    const storedAgentCode = localStorage.getItem('agentCode') || '';
    this.agentCode = storedAgentCode;

      // Handle query parameters
    this.route.queryParams.subscribe(params => {
      this.leadNumber = params['leadNumber'];
      this.action = params['action'];
    });

    // Fetch lead information if leadNumber and action are provided
    if (this.action) {
      await this.getLeadInformationByLeadNumber(this.leadNumber);
      if (this.action === 'addNotes') {
        this.getLeadNotes(this.leadNumber);
        this.fetchActivityTypeInfo();
      }
    }
    // Fetch additional data
    this.getProducts();
    this.fetchOccupationInfo();
  }

  inItForm() {

      // Initialize userValidations form group
    this.userValidations = this.formBuilder.group({
      leadType: [''],
      leadVintage: [''],
      source: [''],
      subSource: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      mobilenumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      salutation : [''],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      MiddleName: ['', [Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      isWhatsapp: false,
      dob: [''],
      age: ['', [Validators.pattern('[0-9]*')]],
      gender: [''],
      maritalStatus: [''],
      numberOfKids: ['', [Validators.pattern('[0-9]*')]],
      occupation: [''],
      address1: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      education: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      address2: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      address3: ['', [Validators.pattern('^[0-9a-zA-Z .,\'-/@#]*$')]],
      city: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      state: ['', [Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      pincode: ['', [Validators.required,Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      zoneCode : [''],
      interestedProductName: [''],
      planType: [''],
      policyEndDate: [''],
      sumInsured: [''],
      premium: [null, [Validators.pattern('^[0-9a-zA-Z ,.-]*$')]],
      duePremiun: [null, [Validators.pattern('^[0-9a-zA-Z ,.-]*$')]],
      familyConstruct: [''],
      policyType: [''],
      policyNumber: [null, [Validators.pattern('^[0-9a-zA-Z ,-./]*$')]],
      campaignnumber: [''],
      leadnumber: [''],
      leadAssignee: [''],
      isUpdate: 0,
      leadStatus: [''],
      leadSubStatus: ['']
    });

      // Disable the age control
    this.userValidations.get('age')?.disable();

      // Initialize addNoteForm form group
    this.addNoteForm = this.formBuilder.group({
      activityTitle: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z ,]*$')]],
      activityStartDate: ['', Validators.required], 
      activityStartTime: ['', Validators.required], 
      activityEndDate: ['', Validators.required],  
      activityEndTime: ['', Validators.required],
      activityType: ['', Validators.required], 
      notes: ['', Validators.required] 
    });
  }


  changeDob(event: any) {
    if (event.target.value == '') {
      this.userValidations.get('age')?.setValue(0)
    } else {
      let age: any = ''
      age = this.calculateAge(event.target.value);
      this.userValidations.get('age')?.setValue(age);
      this.userValidations.updateValueAndValidity();
      this.userValidations.get('age')?.disable()
    }
  }

  calculateAge(dob: any) {
    let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return age.toString();
  }
  checkEnableSendOTP() {
    // Check if the Identification Number field is not empty to enable Send OTP button
    this.sendOTPEnabled = this.YESSearchValue.trim() !== '';
  }
  campnoSelected() {}
  SETAUDATA() {}
  SETIDFCDATA() {}
  validate() {}
  sendOTP() {}
  
  async onSubmit() {
    this.submitted = true;

    if (this.userValidations.invalid) {
      window.scrollTo(0, 0);
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields.", duration: 5000 });
      return;
    }
    else {
      this.CreateLead = this.userValidations.getRawValue();
    }
    this.CreateLead.AgentCode = this.agentCode;
    this.CreateLead.PhoneNumber = this.userValidations.get('mobilenumber')?.value;
    this.CreateLead.campaignname = 'Self'
    this.CreateLead.dob = this.userValidations?.get('dob')?.value;
    let age = 0;
     if( this.CreateLead.dob !=''){
      let dobFormatted = this.datePipe.transform(this.CreateLead.dob, 'yyyy-MM-dd');
      let timeDiff = Math.abs(Date.now() - new Date(dobFormatted as string).getTime());
      age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }
    this.CreateLead.age = age.toString();
    this.CreateLead.zone =  this.userValidations.get('zoneCode')?.value;
    this.CreateLead.leadPriority  =this.userValidations.get('leadSubStatus')?.value;

    
    this.leadsService.saveLeadData(this.CreateLead).subscribe(
      (response) => {
        if (response.message == 'Success') {
          if (this.action == 'updateStatus') {
            this.toast.success({ detail: "", summary: 'Lead is updated successfully.', duration: 5000 });
          } else {
            this.toast.success({ detail: "", summary: 'Lead is created successfully.', duration: 5000 });
          }
          this.router.navigate(['leads/leadsList'])
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );

  }

  async getLeadInformationByLeadNumber(leadNumber: any) {
    try {
      const response = await firstValueFrom(this.leadsService.getLeadInformationByLeadID(leadNumber));
      this.submittedUser = response.data.leadList[0];
      this.updateleadInformation();
    } 
    catch(error) {
        console.log("Failed to fetch lead Information!",error)
      }
  }

  updateleadInformation() {
    this.userValidations.patchValue({
      salutation : this.submittedUser.salutation,
      firstname: this.submittedUser.firstName,
      MiddleName: this.submittedUser.middleName,
      lastname: this.submittedUser.lastName,
      email: this.submittedUser.email,
      mobilenumber: this.submittedUser.phoneNumber,
      dob: this.datepipe.transform(this.submittedUser.dob, 'yyyy-MM-dd'),
      age: this.submittedUser.age,
      gender: this.submittedUser.gender !=null?this.submittedUser.gender == "M" ? "Male" : this.submittedUser.gender == "F" ? "Female" : "Other":'',
      isWhatsapp: this.submittedUser.isWhatsapp,
      maritalStatus: this.submittedUser.maritalStatus,
      numberOfKids: this.submittedUser.numberOfKids,
      education: this.submittedUser.education,
      address1: this.submittedUser.address1,
      address2: this.submittedUser.address2,
      address3: this.submittedUser.address3,
      city: this.submittedUser.city,
      state: this.submittedUser.state,
      pincode: this.submittedUser.pincode,
      planType: this.submittedUser.planType,
      policyEndDate: this.submittedUser.policyEndDate,
      premium: this.submittedUser.premium,
      duePremiun: this.submittedUser.duePremiun,
      familyConstruct: this.submittedUser.familyConstruct,
      policyType: this.submittedUser?.policyType??'' ,
      policyNumber: this.submittedUser.policyNumber,
      campaignname: this.submittedUser.campaignname,
      campaignnumber: this.submittedUser.campaignnumber,
      leadnumber: this.submittedUser.leadNumber,
      leadAssignee: this.submittedUser.leadAssignee,
      isUpdate: this.submittedUser.isUpdate || 1,
      leadStatus : this.submittedUser?.leadStatus??'',
      interestedProductName: this.submittedUser?.interestedProductName??'',
      leadSubStatus : this.submittedUser?.leadPriority??'',
      zoneCode : this.submittedUser?.zone??''
    });
    this.userValidations.get('firstname')?.disable();
    this.userValidations.get('mobilenumber')?.disable();
    this.userValidations.get('lastname')?.disable();
    this.userValidations.get('email')?.disable();


    if(this.submittedUser?.leadStatus.includes('In progress')){
      const formControls = this.userValidations.controls;
      Object.keys(formControls).forEach((key) => {
        if (key !== 'email') {
          formControls[key].disable();
        }
      });
      this.userValidations.get('leadSubStatus')?.enable();
    }
  }

  fetchActivityTypeInfo() {
    let fetchActivityTypeRequest: any = {};
    this.leadsService.fetchActivityType(fetchActivityTypeRequest).subscribe(
      (response) => {
        if (response?.data?.activityName.length) {
          this.activityTypes = response?.data?.activityName;
        }
      },
      (error) => {
        console.log("Failed to fetch ActivityType information : ", error);
      });
  }

  changeSumInsured(event: any) {
    if (event) {
      const selectedValue = typeof (event) === 'string' ? event : event.target.value;  
      this.productSumInsured = this.productsList.find(
        (product: any) => product.productName === selectedValue
      )?.sumInsured.split(",");  
      this.userValidations.patchValue({
        sumInsured: ''
      });  
      this.setPolicyType(selectedValue);
    }
  }

  setPolicyType(selectedProduct: string) {
    if (selectedProduct === 'Global Health Secure') {
      this.userValidations.patchValue({
        policyType: 'Multi Individual'
      });
      this.CreateLeadList.PolicyType=["Multi Individual"]
    } else if (selectedProduct === 'Activ Fit Preferred') {
      this.userValidations.patchValue({
        policyType: 'Family Floater'
      });
      this.CreateLeadList.PolicyType=["Family Floater"]
    } else {
      this.userValidations.patchValue({
        policyType: ''
      });
      this.CreateLeadList.PolicyType=["Multi Individual","Family Floater"]
    }
  }

  addNotesSubmit() {
    let addNotesRequestBody: any = {};
    this.notesSubmitted = true;
    if (this.addNoteForm.valid) {
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

      this.leadsService.addLeadNotes(addNotesRequestBody).subscribe(
        (response) => {
          if (response.message == "Success") {
            this.toast.success({ detail: "", summary: 'Note Added successfully.', duration: 5000 });
            this.router.navigate(['leads/leadsList'])
          }
        }, (error) => {
          console.error("Error from addLeadNotes API:", error);
        }
      );

    }
  }

  backToleads() {
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
    this.validateEndTime();
  }

  validateEndTime(): void {
    const startDate = new Date(this.addNoteForm.get('activityStartDate')?.value);
    const endDate = new Date(this.addNoteForm.get('activityEndDate')?.value);
    const today = new Date();
    if (startDate && endDate) {
      const isBothDatesToday = startDate.toDateString() === today.toDateString() && endDate.toDateString() === today.toDateString();
      if (isBothDatesToday) {
        const startTimeInMinutes = this.convertToMinutes(this.addNoteForm.get('activityStartTime')?.value);
        const endTimeInMinutes = this.convertToMinutes(this.addNoteForm.get('activityEndTime')?.value);
        if (endTimeInMinutes < startTimeInMinutes) {
          this.addNoteForm.get('activityEndTime')?.setErrors({ incorrect: true });
        } else {
          this.addNoteForm.get('activityEndTime')?.setErrors(null); 
        }
      }else{
        this.addNoteForm.get('activityEndTime')?.setErrors(null);
      }
    }
  }

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  isCharacter(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (!/[a-zA-Z ]/.test(char)) {
      event.preventDefault();
    }
  }

  goBack() {
    window.history.back();
  }

  getLeadNotes(leadNumber: any) {
    this.leadsService.getLeadNotes(leadNumber).subscribe((response) => {
      this.notes = response.data;
    },
      (error) => {
        console.log("Failed to fetch lead Information!",error)
      }
    );
  }

  formatCreatedOn(dateString: string | null | undefined) {
    if (!dateString) {
      return 'N/A'; // Handle null or undefined values
    }
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    return formattedDate || 'Invalid Date'; // Handle invalid date
  }

  getProducts() {
    const reqData = {
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
        if (this.submittedUser) {
          this.productSumInsured = this.productsList.find((product: any) => product.productName === this.submittedUser.interestedProductName)?.sumInsured.split(",");
          this.userValidations.patchValue({
          sumInsured: this.submittedUser?.sumInsured ?? ''
          });
        }
      },
      error: (err) => {
        console.log("error coming form getproduct list API",err);
      }
    });
  }

  fetchOccupationInfo() {
    this.leadsService.getOccupationInfo().subscribe(
      (response) => {
        if(response?.isSuccess){
          this.occupationInfo =  response?.data;
          if(this.submittedUser){
            this.userValidations.patchValue({
              occupation: this.submittedUser?.occupation  ?? ''
            });
          }
        }
      }, (error) => {
        console.log('Failed to Fetch Occupation Information',error);
      }
    );
  }


  stringifyJson(opt: any): string {
    return JSON.stringify(opt); 
  }

  getZoneByPinCode(pincode: any) {
    const reqData = {
      "pincode": pincode
    }
    this.common.getPinCodeByCity(reqData).subscribe(
      (response) => {
        if(response?.isSuccess){
         this.pincodeResponse = response?.data;         
         this.userValidations.patchValue({
          zoneCode: this.pincodeResponse?.zone ?? '',
          city: this.pincodeResponse?.city ?? '',
          state: this.pincodeResponse?.state ?? ''
         });  
         this.userValidations.get('zoneCode')?.disable();
         this.userValidations.get('city')?.disable();
         this.userValidations.get('state')?.disable();

       
        }else{
          this.userValidations.get('pincode')?.setErrors({ incorrect: true  ,message : response?.message});
        }
      },
      (error) => {
        console.log('Failed to fetch pincode Information.',error);
        this.userValidations.get('pincode')?.setErrors({ incorrect: true , message : 'Please re-enter pincode again.'});
      }
    )
  }


}

