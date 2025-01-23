import { ChangeDetectorRef, Component, ElementRef, Inject, Renderer2, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDynamicControl, IForm, IFormControl, IFormSections, IOptions, ISubControl, IValidator } from 'src/app/interface/form.interface';
import { CommonService } from 'src/app/services/common.service';
import { DOCUMENT } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { IFullQuoteMapping } from 'src/app/interface/FullQuote_Mapping.interface';
import { AesEncryptionService } from 'src/app/services/AESEncrypt.service';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { OtpPopupComponent } from '../otp-popup/otp-popup.component';
import { PaymentInfoComponent } from '../payment-info/payment-info.component';
import { CaptchaPopupComponent } from '../captcha-popup/captcha-popup.component';
import { RugService } from 'src/app/rug/rug.service';
declare var bootstrap: any;

@Component({
  selector: 'app-rug-dynamic-form',
  templateUrl: './rug-dynamic-form.component.html',
  styleUrls: ['./rug-dynamic-form.component.scss']
})
export class RugDynamicFormComponent {
  // @ViewChild('fileInput') fileInput!: ElementRef;
  form!: IForm;
  fb = inject(FormBuilder)
  dynamicFormGroup: FormGroup = this.fb.group({});
  private dynamicStyle!: HTMLLinkElement;
  dispositionList: any;
  subDispositionList: any;
  insurancetypecode: any;
  productid: any;
  verticalCode: any;
  Code: any;
  proposalNum: any;
  familyConstruct: any;
  idProofType: string = '';
  nomineeRelations: any;
  private allJsonForm: any[] = [];
  formData: any = {}
  selectedFile: any;
  expandedCardIndex: number | null = null;
  i!: number;
  activeTab: string = 'chronic';
  expandedItem: string = '';
  selectedItem: string = '';
  bankCode: any;
  bankCity: any;
  formControls: IFormControl[] = [];

  activeMemberTabIndex: number = 0;
  selectedIndex: number = -1;
  insuredMemberDetails: any = {};
  leadId: any;
  proposalId: any;
  quoteId: any;
  quoteNo: any;
  tenureAmount: any[] = [0, 0, 0];
  premiumAmountDetails: number[][] = [];
  addOnList: any[] = [];

  premiumDetails: any[][] = [];
  taxList: number[] = [];
  discountList: number[] = [];
  netPremiumList: number[] = [];
  totalPremiumList: any[] = [];
  indPremiumList: any[] = [];
  addOnPremiumValueList: number[][][] = [];
  addOnDetails: Array<any>[] = [new Array()];
  mainData: any;
  customerId: any;
  public showHtmlContent: any;
  isFormLoaded: boolean = false;
  formSequence: any[] = [];
  agentCode: any;
  productName: any;
  productCode: any;
  productStartDate: any;
  productEndDate: any;
  parentControl: any;
  isAHPAAdded: boolean = false;
  AHPARiskValue: any;
  showPopup: boolean = false;
  showDoneButton = true;
  changesMade: boolean = false;

  partnerId: any
  productId: any
  isCustomerJourney: boolean = false;
  displayTaxList: any[] = [];
  currentDate = new Date().toISOString().split('T')[0];
  selectedButton: string | null = null;
  collapsedSections: { [key: string]: boolean } = {};
  isOverlayVisible = false;
  isQuote: any;
  isPolicyDetailsFetch: boolean = false;
  selectedAddons: any[] = [];
  question: any;
  leadnumber: string = "";
  QuoteNumber: any = [];
  customerFeedbackModule: any;
  isPlanDetailsVisible = false;
  isBBPlanDetailsVisible = false;
  customerFeedbackForm !: FormGroup;
  formIndexValue: number = 0;
  stars: number[] = [1, 2, 3, 4, 5]; // Array for star ratings
  rating: number = 0; // Holds the current selected rating
  feedbackImpressedValues: String[] = ['Seamless payment', 'Ease of policy modification', 'Speedy Policy renewal', 'Payment receipt & confirm']
  feedBackMessage: boolean = false;
  impressedValues: boolean = false;
  feedbackSubmit: boolean = false;
  impressedLable: String = "";
  feedbackImpressedValue: String = '';
  quickQuoteRedirect: boolean = false;
  leadNumber: string = "";
  bbdetails: any;
  d2cDetails:any;
  tsDetails: any;
  commonDraftData: any;
  sumInsuredData: any;
  productCombinationData: any;
  bbPremiumData: any;
  familyConstructsData: any;
  isD2C: boolean = true;
  isBB: boolean = true;
  isTS: boolean = true;
  paramLeadId: any;
  policyDetails: any;
  filteredPolicies: any;
  premiumArray:any = [];
  D2CproductCode:any
  premiumObj:any;
  occupationList: any;
  isDeclarationSelected = new FormControl('no');
  selectedOccupationCode: any;
  constructor(private dialog: MatDialog, private renderer: Renderer2, private el: ElementRef, private aesEncryptionService: AesEncryptionService,
    public commonService: CommonService, private yatraService: YatraService, private router: Router, private spinner: LoadingService,
    private toast: NgToastService, private changeDetectorRef: ChangeDetectorRef, private aesEncryptService: AesEncryptionService,
    private encryptionService: EncryptionService, @Inject(DOCUMENT) private document: Document, private clipboard: Clipboard,
    private route: ActivatedRoute, private rugService: RugService,) { }

  ngOnInit() {
    this.paramLeadId = decodeURIComponent(this.route.snapshot.params['leadId'])
    console.log(this.paramLeadId)
    this.route.params.subscribe(async (params) => {
      if (Object.keys(this.route.snapshot.params).length > 0) {
        console.log('Route has parameters:', params);
        this.paramLeadId = this.aesEncryptService.decryptUrlData(this.paramLeadId);
        console.log(this.paramLeadId)
        this.paramLeadId = JSON.parse(this.paramLeadId)
        this.leadId = this.paramLeadId.LeadId;
        this.partnerId = this.paramLeadId.PartnerId;
        this.productId = this.paramLeadId.ProductId;
        // this.formSequence = JSON.parse(this.paramLeadId.FormSequence);
        // console.log(this.formSequence);
        console.log(this.paramLeadId.CurrentIndex);
        localStorage.setItem('token', this.paramLeadId.token)
        localStorage.setItem("formIndex", this.paramLeadId.CurrentIndex);
        this.agentCode = this.paramLeadId.AgentCode;
        localStorage.setItem("agentCode", this.agentCode);
        try {
          const reqData = {
            partnerId: this.partnerId,
            productId: this.productId,
          };
          const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
          console.log(res);
          this.formSequence = JSON.parse(res.data.formSequence);
          console.log(this.formSequence);
          if(this.agentCode != "467898" && this.partnerId == "16"){
            this.isD2C = false;
            this.isTS = false;
            this.isBB = true;
          }else if(this.agentCode == "467898"){
            this.isD2C = true;
            this.isBB = false;
            this.isTS = false
            this.rugService.changeStatus(true)
          }else if(this.agentCode == "467896" || this.agentCode =="467897"){
            this.isD2C = false;
            this.isBB = false;
            this.isTS = true;
          }
          
          console.log(this.formSequence[this.getFormIndexValue()].formName)
          console.log(this.paramLeadId.CurrentIndex)
          if(this.paramLeadId.CurrentIndex == 4 && this.formSequence[this.getFormIndexValue()].formName == "Policy Details"){
            let reqObj = {
              "leadId": this.leadId
            }
            this.yatraService.getd2cPolicyInfoByLeadId(reqObj).subscribe({
              next: (res: any) => {
                console.log(res);
                res = JSON.parse(res.data).data
                console.log(res);
                this.policyDetails = res;
                console.log(this.policyDetails);
                this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                // this.filteredPolicies = this.policyDetails.policyDetails.filter(
                //   (policy: any) => policy.certificateNumber && policy.quoteType === "FULLQUOTE"
                // );
                
                // console.log(this.filteredPolicies);

                // console.log(this.dynamicFormGroup.value);
                
                // this.formData.members = this.policyDetails.proposerDetails.insuredDetails[0]?.relationWithProposer;
                // this.formData.policyNumber = this.filteredPolicies[0]?.policyNumber || null;
                // this.formData.productName = this.filteredPolicies[0]?.productName || null;
                // this.formData.secondMembers = this.policyDetails.proposerDetails.insuredDetails[0]?.relationWithProposer;
                // this.formData.secondPolicyNumber = this.filteredPolicies[1]?.policyNumber || null
                // this.formData.secondProductName = this.filteredPolicies[1]?.productName || null;
                // // this.dynamicFormGroup.get('policyNumber')?.setValue(this.filteredPolicies[0].policyNumber)
                // this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
                
                // console.log(this.dynamicFormGroup.value);

                // Merging updated formData with dynamicFormGroup values
              },
              error: (err) => {
                console.error(err);
              }
            });
          }
          else if(this.paramLeadId.CurrentIndex == 7 && this.formSequence[this.getFormIndexValue()].formName == "Policy Summary"){
            let reqObj = {
              "leadId": this.leadId
            }
            this.rugService.getBBPolicyInfoByLeadId(reqObj).subscribe({
              next: (res: any) => {
                console.log(res);
                res = JSON.parse(res.data).data
                console.log(res);
                this.policyDetails = res;
                console.log(this.policyDetails);
                this.filteredPolicies = this.policyDetails.policyDetails.filter(
                  (policy: any) => policy.certificateNumber && policy.quoteType === "FULLQUOTE"
                );
            this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                
                console.log(this.filteredPolicies);

                console.log(this.dynamicFormGroup.value);
                const relations = this.policyDetails.proposerDetails.insuredDetails.map((detail: any) => detail.relationWithProposer).join(', ');
                this.formData.members = relations;
                this.formData.policyNumber = this.filteredPolicies[0]?.policyNumber || null;
                this.formData.productName = this.filteredPolicies[0]?.productName || null;
                // if(this.policyDetails.proposerDetails.insuredDetails.length > 1){
                //   this.formData.secondMembers = this.policyDetails.proposerDetails.insuredDetails[1]?.relationWithProposer;
                // }
                this.formData.secondPolicyNumber = this.filteredPolicies[1]?.policyNumber || null
                this.formData.secondProductName = this.filteredPolicies[1]?.productName || null;
                this.formData.totalPremium = this.policyDetails.proposerDetails.proposerDetails.premium || null;
                this.formData.leadNumber = this.filteredPolicies[0]?.leadId || null;
                this.formData.policyEmail = this.policyDetails.proposerDetails.proposerDetails.emailAddress || null
                // this.dynamicFormGroup.get('policyNumber')?.setValue(this.filteredPolicies[0].policyNumber)
                this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
                
                console.log(this.dynamicFormGroup.value);

                // Merging updated formData with dynamicFormGroup values
              },
              error: (err) => {
                console.error(err);
              }
            });
          }
          else if(this.paramLeadId.CurrentIndex == 9 && this.formSequence[this.getFormIndexValue()].formName == "Policy Summary"){
            let reqObj = {
              "leadId": this.leadId
            }
            this.rugService.getTsPolicyInfoByLeadId(reqObj).subscribe({
              next: (res: any) => {
                console.log(res);
                res = JSON.parse(res.data).data
                console.log(res);
                this.policyDetails = res;
                console.log(this.policyDetails);
                this.filteredPolicies = this.policyDetails.policyDetails.filter(
                  (policy: any) => policy.certificateNumber && policy.quoteType === "FULLQUOTE"
                );
            this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                
                console.log(this.filteredPolicies);

                console.log(this.dynamicFormGroup.value);
                const relations = this.policyDetails.proposerDetails.insuredDetails.map((detail: any) => detail.relationWithProposer).join(', ');
                this.formData.members = relations;
                this.formData.policyNumber = this.filteredPolicies[0]?.policyNumber || null;
                this.formData.productName = this.filteredPolicies[0]?.productName || null;
                // if(this.policyDetails.proposerDetails.insuredDetails.length > 1){
                //   this.formData.secondMembers = this.policyDetails.proposerDetails.insuredDetails[1]?.relationWithProposer;
                // }
                this.formData.secondPolicyNumber = this.filteredPolicies[1]?.policyNumber || null
                this.formData.secondProductName = this.filteredPolicies[1]?.productName || null;
                this.formData.totalPremium = this.policyDetails.proposerDetails.proposerDetails.premium || null;
                this.formData.leadNumber = this.filteredPolicies[0]?.leadId || null;
                this.formData.policyEmail = this.policyDetails.proposerDetails.proposerDetails.email || null
                // this.dynamicFormGroup.get('policyNumber')?.setValue(this.filteredPolicies[0].policyNumber)
                this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
                
                console.log(this.dynamicFormGroup.value);

                // Merging updated formData with dynamicFormGroup values
              },
              error: (err) => {
                console.error(err);
              }
            });
          }
          else{
            this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
          }
        } catch (err) {
          console.error(err);
        }
      } else {

        this.leadId = localStorage.getItem('leadId');
        this.formSequence = history.state.formSequence;
        console.log(this.leadId);

        console.log(this.formSequence);
        console.log(history.state.productData);
        if (history.state.productData.productId)
          this.productId = history.state.productData.productId;
        if (history.state.productData.partnerId)
          this.partnerId = history.state.productData.partnerId;
        if (history.state.productData.proposalNum)
          this.proposalNum = history.state.productData.proposalNum;
        if (history.state.productData.tenureAmounts) {
          this.tenureAmount = history.state.productData.tenureAmounts
        }
        if (history.state.productData.tenure) {
          this.formData = { ...this.formData, tenure: history.state.productData.tenure }
        }
        console.log(this.formData);
        if (history.state.productData.selectedAddons) {
          this.selectedAddons = history.state.productData.selectedAddons
        }
        if (history.state.productCode) {
          this.productCode = history.state.productCode;
        }
        if (history.state.productName) {
          this.productName = history.state.productName;
        }
        console.log('No route parameters found.');

      if (localStorage.getItem('agentCode')){
        this.agentCode = localStorage.getItem('agentCode');
      }


      if(this.agentCode != "467898" && this.partnerId == "16"){
        this.isD2C = false;
        this.isTS = false;
        this.isBB = true;
      }else if(this.agentCode == "467898"){
        this.isD2C = true;
        this.isBB = false;
        this.isTS = false
        this.rugService.changeStatus(true)
      }else if(this.agentCode == "467896" || this.agentCode =="467897"){
        this.isD2C = false;
        this.isBB = false;
        this.isTS = true
      }
      if (sessionStorage.getItem('allJsonForm'))
      this.allJsonForm = this.encryptionService.decrypt(sessionStorage.getItem('allJsonForm') as string)
      if(this.leadId != null && (this.agentCode == "467896" || this.agentCode == "467897" || this.agentCode == "467895" || this.agentCode == "467894" || this.agentCode == "467895")){

        const reqData = {
          partnerId: this.partnerId,
          productId: this.productId,
        };
        const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
        this.formSequence = JSON.parse(res.data.formSequence);
        localStorage.setItem("formIndex", "1");
 
        this.getFormDataFromFormSequence(this.formSequence[1].formId);
      }else{

        this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
      }
      }
    });
    
    this.showHtmlContent = false;


    this.route.queryParams.subscribe(params => {
      this.leadNumber = params['leadId'];
      if (this.leadNumber) {
        this.quickQuoteRedirect = true;
      }
    });

    if (localStorage.getItem('code'))
      this.Code = localStorage.getItem('code');
    this.D2CproductCode = this.productId == '7' ?  "D01" : this.productId == '8' ? "D02" : this.productId == '31' ? "D03" : "D04"
    // this.verticalCode = localStorage.getItem('verticalCode');
    // this.insurancetypecode = history.state.productData.insurancetypecode;
    // this.productid = history.state.productData.productid;
    // this.productName = history.state.productData.productName;
    // this.productEndDate = history.state.productData.productEndDate;
    // this.productStartDate = history.state.productData.productStartDate;
    // this.proposalNum = history.state.productData.proposalNumber;

    // this.agencyCode = history.state.productData.agencyCode;





    // this.formData = this.encryptionService.decrypt(sessionStorage.getItem('allFormData') as string)
    // console.log(this.formData)
    // this.formData = { ...this.formData, ...{ productName: this.productName } }
    // this.formData = { ...this.formData, ...{ productName: this.productName } }

    // this.customerFeedbackModule = new bootstrap.Modal(document.getElementById('customerFeedbackModule'));
    // this.customerFeedbackForm = this.fb.group({
    //   message: [''],
    //   rating: [null, Validators.required], // Add rating to the form
    // });


  }
  getFamilyConstruct(){
    console.log(this.formSequence[0].formName);
    if (this.formSequence[0].formName == "Group Health Insurance + Group Protect" || this.formSequence[0].formName == "Group Health Insurance + Group Personal Accident" || this.formSequence[0].formName == "Group Health Insurance" || this.formSequence[0].formName == "Group Personal Accident + Group Critical Illness") {
      let familyConstructObj = {
        productCode: this.bbdetails.productCode
      }
      this.yatraService.getFamilyConstructData(familyConstructObj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.familyConstructsData = res.familyConstructs
          console.log(this.familyConstructsData);

        },
        error: (err) => {
          console.error(err);
        }
      });
    }
    if (this.formSequence[0].formName == "Proposer Details" || this.formSequence[this.getFormIndexValue()].formId == 2) {
      let familyConstructObj = {
        productCode: this.tsDetails.productCode
      }
      this.yatraService.getFamilyConstructData(familyConstructObj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.familyConstructsData = res.familyConstructs
          console.log(this.familyConstructsData);

        },
        error: (err) => {
          console.error(err);
        }
      });
    }
    if (this.formSequence[0].formName == "Know Your Premium") {
      let familyConstructObj = {
        productCode: "D01"
      }
      this.yatraService.getFamilyConstructData(familyConstructObj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.familyConstructsData = res.familyConstructs
          console.log(this.familyConstructsData);

        },
        error: (err) => {
          console.error(err);
        }
      });
    }
    this.yatraService.getProductCombinations().subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        console.log(res);
        this.productCombinationData = res.productCombinationModel
        console.log(this.productCombinationData);
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.rugService.getMasterData().subscribe({
      next: (res: any) => {
        console.log(res);
        this.occupationList = JSON.parse(res?.data).data.occupation;
      },
      error: (err: any) => {
      console.error(err)
      }
    });
    if(this.isTS == true){
      this.rugService.getDispositions().subscribe({
        next: (res: any) => {
          console.log(res)
          res = JSON.parse(res.data).data
          console.log(res);
          this.dispositionList = res.allDisposition;           
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
    this.yatraService.getRelations().subscribe({
      next: (response: any) => {
        response = JSON.parse(response.data).data;
        this.nomineeRelations = response;
        console.log(this.nomineeRelations);
        this.nomineeRelations = this.nomineeRelations.relationShipModels;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  initializeRequiredData() {
    if (sessionStorage.getItem('allFormData') != null)
      this.formData = this.encryptionService.decrypt(sessionStorage.getItem('allFormData') as string)
    console.log(this.formData)

    if (sessionStorage.getItem('insuredMemberDetails') != null)
      this.insuredMemberDetails = this.encryptionService.decrypt(sessionStorage.getItem('insuredMemberDetails') as string)

    // if (sessionStorage.getItem('leadId') != null) {
    //   this.leadId = this.encryptionService.decrypt(sessionStorage.getItem('leadId') as string);
    // }
    // else {
    //   this.leadId = "";
    // }
    if (sessionStorage.getItem("isQuote")) {
      this.isQuote = sessionStorage.getItem("isQuote") == 'true'
    }
    else {
      this.isQuote = false;
    }

    if (sessionStorage.getItem('proposalId') != null) {
      this.proposalId = this.encryptionService.decrypt(sessionStorage.getItem('proposalId') as string);
    }
    else {
      this.proposalId = "";
    }

    if (sessionStorage.getItem('quoteId') != null) {
      this.quoteId = this.encryptionService.decrypt(sessionStorage.getItem('quoteId') as string);
    }
    else {
      this.quoteId = "";
    }


    if (sessionStorage.getItem('quoteNo') != null) {
      this.quoteNo = this.encryptionService.decrypt(sessionStorage.getItem('quoteNo') as string);
    }

    if (sessionStorage.getItem('displayTaxList') != null) {
      this.displayTaxList = this.encryptionService.decrypt(sessionStorage.getItem('displayTaxList') as string);
    }

    if (sessionStorage.getItem('tenureAmount')) {
      this.tenureAmount = this.encryptionService.decrypt(sessionStorage.getItem('tenureAmount') as string)
      console.log(this.tenureAmount);

    }

    if (sessionStorage.getItem('premiumAmountDetails')) {
      this.premiumAmountDetails = this.encryptionService.decrypt(sessionStorage.getItem('premiumAmountDetails') as string)
      console.log(this.premiumAmountDetails);

    }

    if (sessionStorage.getItem('addOnList')) {
      this.addOnList = this.encryptionService.decrypt(sessionStorage.getItem('addOnList') as string);
    }
    else {
      this.addOnList = [];
    }
  }
  getFormDataFromFormSequence(formId: any) {
    this.initializeRequiredData();
    this.showHtmlContent = false;
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
      this.showHtmlContent = false;
    }
    // if (Object.keys(this.allJsonForm[this.getFormIndexValue()]).length > 0) {
    //   this.form = this.allJsonForm[this.getFormIndexValue()];
    //   let reqdata = {
    //     "verticalCode": this.verticalCode,
    //     "proposalNum": this.proposalNum,
    //     "code": this.agencyCode,
    //     "agentCode": this.agentCode,
    //     "productId": this.productId,
    //     "partnerId": this.partnerId,
    //     "formData": "string",
    //     "formWithFormData": "string",
    //     "formName": "string",
    //     "formId": formId,
    //     "formConfig": "string"
    //   }
    //   this.yatraService.getAllFormDataViaVerticalCode(reqdata).subscribe({
    //     next: (res) => {
    //       this.form = JSON.parse(res.jsonForm);
    //       // this.form = totalpremium;
    //       this.initializeForm();
    //     },
    //     error: (err) => {
    //       console.error(err)
    //     }
    //   })

    // }\
    if (Object.keys(this.allJsonForm?.[this.getFormIndexValue()] || {}).length > 0) {
      this.form = this.allJsonForm[this.getFormIndexValue()];
      console.log(this.form);
      this.initializeForm();
    }

    else {
      console.log(this.leadId);
      let reqData = {
        "partnerId": this.partnerId,
        "productId": this.productId,
        "formId": formId,
        "proposalNum": this.leadId != undefined ? this.leadId : "587263492",
        "agentCode": this.agentCode,
        "currentFormSequence": this.getFormIndexValue().toString()
      }
      console.log(reqData);
      this.yatraService.Getform(reqData).subscribe({
        next: (res: any) => {
          console.log(res);
           this.form = JSON.parse(res.data.jsonFormData);
         
         
        
          this.bbdetails = JSON.parse(res.data.formData);
          this.d2cDetails = JSON.parse(res.data.formData);
          this.tsDetails = JSON.parse(res.data.formData);
          this.leadId = this.bbdetails.leadId;
          console.log(this.form);
          console.log(this.d2cDetails);
          console.log(this.bbdetails);
          console.log(this.tsDetails);
          console.log(this.formSequence[this.getFormIndexValue()].formName);
          if(this.formSequence[this.getFormIndexValue()].formName == "Customer Summary" || this.formSequence[this.getFormIndexValue()].formName == "Policy Summary"){
            this.isCustomerJourney = true;
          }
          // this.form.formSections[0].formControls[0].value = "";
          
          
          
         
          this.initializeForm();
          this.getFamilyConstruct();

        },
        error: (err) => {
          console.error(err);
        }
      })

    }
    console.log(this.form);
  }

  redioButtonChange(event:any){
    console.log(this.dynamicFormGroup.value.planAvailable)
    if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI"){
      const filteredData = this.premiumObj.filter(
        (item: any) => item.combinationName === "GHI"
      );
      console.log(filteredData);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      // this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);      
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI");
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
    }
    if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA"){
      const filteredData = this.premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA"
      );
      console.log(filteredData);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA");
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
      if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
        return ele;
      }
      });
      this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
    }

  }

  async initializeForm() {
    console.log(this.form, this.formData);
    this.showHtmlContent = false;
    this.dynamciallyLoadCSS(this.form);
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((control: any) => {
        // const policyindex = control.dynamicControls[0].findIndex((item:any) => item.value === this.formData.planType);
        // console.log(policyindex);
        if (control.dynamicControls) {
          console.log(control.name, control, this.formData);

          if (this.formData[control.name] && control.visible == true) {
            console.log(control.dynamicControls[0], this.formData.planType);
            if (this.formData[control.name]) {
              control.value = this.formData[control.name].length;
            }
            console.log(control.value);
            control.dynamicControls = control.dynamicControls.slice(0, 1)
            this.formData[control.name].forEach((member: any, index: number) => {
              let tempDynamicControl = control.dynamicControls[0].map((element: any) => ({ ...element }));
              console.log(tempDynamicControl);
              control.dynamicControls.push(tempDynamicControl)
              control.dynamicControls[index + 1].forEach((innerControl: any) => {
                if (innerControl.name == 'relation') {
                  innerControl.value = member.relation
                }
                if (innerControl.name == 'covers') {
                  innerControl.value = member.covers;
                }
              })
            })
          }
        }
        // else if (control.subControls && this.formData[control.name]) {
        //   console.log(this.formData[control.name], control);
        //   control.subControls.forEach((subControl: ISubControl) => {
        //     if (subControl.name == 'addOnDetails') {
        //       subControl.innerSubControls = subControl.innerSubControls?.slice(0, 1)
        //       this.formData['insuredMemberDetails'].forEach((member: any) => {
        //         if (subControl.innerSubControls) {
        //           let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
        //           console.log(tempInnerControl, member);
        //           const tempRelationshipType = JSON.parse(member.relationshipType);
        //           tempInnerControl.label = tempRelationshipType.value;
        //           tempInnerControl.name = tempRelationshipType.value;
        //           subControl.innerSubControls.push(tempInnerControl)
        //         }
        //       })
        //     }
        //   })

        // }
        else {
          if ((this.formData[control.name]) || (this.formData[control.name] && !control.value)) {
            control.value = this.formData[control.name];
            if (control.name == 'accident') {
              console.log(control.value);
            }
          }
        }
      });
    });

    console.log(this.form, this.formData);
    if (this.form?.formSections) {
      this.dynamicFormGroup = this.fb.group({});
      this.form.formSections.forEach((section) => {
        section.formControls.forEach(async (control: IFormControl) => {
          if (control.dynamicControls) {
            if (control.visible == true) {
              let tempFormArray = this.fb.array([]);
              for (let i = 1; i < control.dynamicControls.length; i++) {
                tempFormArray.push(this.initializeDynamicFormControls(control.dynamicControls[i], i));
              }
              this.dynamicFormGroup.addControl(control.name, tempFormArray);
            }
          }
          else if (control.subControls) {
            // control.subControls.forEach((subControl: ISubControl) => {
            //   if (subControl.name == 'addOnDetails') {
            //     subControl.innerSubControls = subControl.innerSubControls?.slice(0, 1)
            //     this.formData['insuredMemberDetails'].forEach((member: any) => {
            //       if (subControl.innerSubControls) {
            //         let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
            //         console.log(tempInnerControl, member);
            //         const tempRelationshipType = JSON.parse(member.relationshipType);
            //         tempInnerControl.label = tempRelationshipType.value;
            //         tempInnerControl.name = tempRelationshipType.value;
            //         subControl.innerSubControls.push(tempInnerControl)
            //       }
            //     })
            //   }
            // })
            if (control.type == 'questionnaire') {
              let demoMember: any;
              let demoTypeIndex: any;
              let doneButton: any;
              console.log(control);
              if (control.subControls) {
                demoMember = control.subControls.findIndex(control => control.name === 'demoMember')
                demoTypeIndex = control.subControls.findIndex(control => control.name === 'demoType');
                doneButton = control.subControls.find(control => control.name === 'doneButton');
                console.log(control);
                control.subControls = [
                  ...control.subControls.slice(demoMember, demoMember + 1),
                  ...control.subControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
                ]; // Keep the first control (or reset)
                console.log(control);
              }
              console.log(this.formData['insuredMemberDetails']);
              this.formData['insuredMemberDetails'].forEach((member: any, index: any) => {
                console.log(member, this.formData[control.name], control);
                if (control.subControls) {
                  let tempMemberControl = JSON.parse(JSON.stringify(control.subControls[0]));
                  let tempInnerControl = JSON.parse(JSON.stringify(control.subControls[1]));

                  const tempRelationshipType = JSON.parse(member.relationshipType);
                  tempMemberControl.label = tempRelationshipType.value;
                  tempMemberControl.name = tempRelationshipType.value.toLowerCase();
                  tempInnerControl.label = tempRelationshipType.value;
                  tempInnerControl.name = tempRelationshipType.value;
                  console.log(tempInnerControl);
                  if (this.formData[control.name] && this.formData[control.name][tempMemberControl.name] == true) {
                    for (const key in this.formData[control.name]) {
                      const value = this.formData[control.name][key];
                      if (key == tempRelationshipType.value.toLowerCase()) {
                        if (typeof this.formData[control.name][key] === 'boolean' && this.formData[control.name][key] == true) {
                          // const arrayName = (key).charAt(0).toUpperCase() + (key).slice(1);
                          console.log(key, value);
                          tempMemberControl.value = true;
                          tempInnerControl.visible = true;
                          this.formData[control.name][tempRelationshipType.value].forEach((item: any) => {
                            tempInnerControl.innerArrayControl.push(tempInnerControl.innerArrayControl[0])
                          })
                        }
                      }
                    }
                  }
                  else {
                    tempInnerControl.innerArrayControl.push(tempInnerControl.innerArrayControl[0])
                  }

                  control.subControls?.push(tempMemberControl);
                  control.subControls?.push(tempInnerControl);
                  console.log(control);
                }
              });
              control.subControls?.push(doneButton);
              console.log(control);
              this.dynamicFormGroup.addControl(control.name, this.initializeSubControls(control.subControls.slice(2)));
            }
            else {
              control.subControls.forEach((subControl: ISubControl) => {
                if (subControl.name == 'addOnDetails') {
                  let demoTypeIndex: any;
                  let doneButton: any;
                  if (subControl.innerSubControls) {
                    demoTypeIndex = subControl.innerSubControls.findIndex(control => control.name === 'demoType');
                    doneButton = subControl.innerSubControls.find(control => control.name === 'doneButton');
                    // Slice the array to retain demoType and doneButton only
                    subControl.innerSubControls = [
                      ...subControl.innerSubControls.slice(demoTypeIndex, demoTypeIndex + 1), // Retain demoType
                      // ...subControl.innerSubControls.slice(doneButtonIndex, doneButtonIndex + 1) // Retain doneButton
                    ]; // Keep the first control (or reset)
                  }


                  console.log(subControl.innerSubControls);


                  this.formData['insuredMemberDetails'].forEach((member: any) => {
                    if (subControl.innerSubControls) {
                      let tempInnerControl = JSON.parse(JSON.stringify(subControl.innerSubControls[0]));
                      console.log(tempInnerControl, member);

                      const tempRelationshipType = JSON.parse(member.relationshipType);
                      tempInnerControl.label = tempRelationshipType.value;
                      tempInnerControl.name = tempRelationshipType.value;
                      subControl.innerSubControls?.push(tempInnerControl);
                    }
                  });
                  subControl.innerSubControls?.push(doneButton);
                }
              });
            }

            console.log(this.initializeSubControls(control.subControls));

            this.dynamicFormGroup.addControl(control.name, this.initializeSubControls(control.subControls));
          }
          else {
            let controlValidators: any = [];
            if (control.validators && control.visible == true) {
              control.validators.forEach((val: IValidator) => {
                if (val.validatorName === 'required') controlValidators.push(Validators.required);
                if (val.validatorName === 'email') controlValidators.push(Validators.email);
                if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
              })
            }
            // if(control.type=='select' && control.methodName && control.options?.length==0){
            //   this.callMethod(control.methodName,control);
            // }
            if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {
              // Only call resolveMethod if selectCheckboxOptions is empty
              // if (control.selectCheckboxOptions.length === 0) {
              //   await this.resolveMethod(control.methodName, control);

              // }
              // After resolving, add the control to the dynamic form group
              const controlGroup = this.fb.group({});
              control.selectCheckboxOptions.forEach(option => {
                controlGroup.addControl(option.value, new FormControl(false));
              });
              this.dynamicFormGroup.addControl(control.name, controlGroup);
            }
            if (['text', 'email', 'password', 'number', 'date', 'summary'].includes(control.type) && control.methodName) {
              if (control.otherControlName) {
                this.callMethod(control.methodName, control, section)
              }
              else {
                this.resolveMethod(control.methodName, control)
              }
            }
            if (control.type === 'select' && control.options) {
              // Call the method to get all options if defined and options array is empty
              if (control.getAllOption && control.options.length === 0) {
                this.callMethod(control.getAllOption, control);
              }

              console.log(this.form, control.value, this.isQuote, control.name);

              // If the control's value is empty, set it based on the selected options
              if (control.value === "") {
                // Set control value if any option is selected
                if (control.options.length > 0) {
                  control.options.forEach((option: IOptions) => {
                    if (option.selected) {
                      control.value = option.id ? this.stringifyObject(option) : option.value;
                    }
                  });
                }

                // Call the methodName method after setting the value if defined
                if (control.methodName) {
                  await this.resolveMethod(control.methodName, control);
                }
              }
              else if (control.value != "" && this.isQuote === true && control.methodName) {
                await this.resolveMethod(control.methodName, control);
                // if (control.name == 'insuredMembers') {
                //   //loop the options and see if the option has value true in the insuredMembers in formData and the call the log selection
                //   control.selectCheckboxOptions?.forEach((option: any) => {
                //     if (this.formData.insuredMembers[option.value] === true) {
                //       // Call logSelection function (pass null for event if not triggering through UI)
                //       this.logSelection(null, option, control);
                //     }
                //   })
                // }

              }
            }

            if (control.type == 'radio' && control.method) {
              this.callMethod(control.methodName, control);
            }

            if (control.type == 'custom-radio' && control.methodName) {
              this.resolveMethod(control.methodName, control);
            }
            const radioOptionsControl = this.dynamicFormGroup.get('totalPremium');

            if (radioOptionsControl) {
              radioOptionsControl.valueChanges.subscribe((value: string) => {

                this.form.formSections.forEach((section: any) => {
                  section.formControls.forEach((formControl: any) => {
                    if (formControl.name == 'totalPremium' && formControl.type == 'custom-radio') {
                      this.selectedIndex = formControl.radioOptions.findIndex((option: any) => option.value === value);
                      this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
                      this.formData.tenure = this.selectedIndex + 1;
                      console.log(this.selectedIndex, this.formData);
                    }
                  });
                });
              })
            }

            this.dynamicFormGroup.addControl(control.name, new FormControl(control.value, controlValidators));
            if (control.type == 'custom-radio' && this.formData[control.name]) {
              const radioControl = this.dynamicFormGroup.get(control.name);
              if (radioControl) {
                control.radioOptions?.forEach((option: any, index: number) => {
                  if (option.value == this.formData[control.name]) {
                    radioControl.setValue(option.value);
                    this.selectedIndex = index;
                  }
                });
              }
            }

          }
        });
      });
      this.dynamicFormGroup.addControl('leadNumber', new FormControl(this.leadnumber));
      //dynamic css
      // this.showHtmlContent = true;
      this.isFormLoaded = true;
      console.log(this.form);
      console.log(this.bbdetails);
      console.log(this.dynamicFormGroup, this.formData);
      console.log(this.formSequence);
      console.log(this.formSequence[this.getFormIndexValue()].formId);
      console.log(this.getFormIndexValue());
      if(this.getFormIndexValue() == 7 && this.formSequence[this.getFormIndexValue()].formName == "Confirmation" && this.agentCode == "467897"){
        console.log(this.form);
        console.log(this.tsDetails);
        this.isCustomerJourney = true;
        this.form.formSections.forEach((section: any) => {
          console.log(section);
          if (section.sectionTitle == "Confirmation") {
            section.formControls.forEach((formControl: any) => {
              if(formControl.name == "label1"){
                formControl.visible = false;
              }
              if(formControl.name == "label3"){
                formControl.visible = true;
              }
              if(formControl.name == "leadID"){
                formControl.visible = true;
                formControl.value = this.tsDetails.leadId;
              }
            })
          }
        });

      }
      if(this.getFormIndexValue() == 7 && this.formSequence[this.getFormIndexValue()].formName == "Policy Summary"){
        console.log(this.form);
        console.log(this.bbdetails.paymentMode);
        this.form.formSections.forEach((section: any) => {
          console.log(section);
          if (section.sectionTitle == "Details of Your Proposal" && this.bbdetails.paymentMode == "yes") {
            section.visible = false;
          }
        });

      }
      if(this.getFormIndexValue() == 8 && this.formSequence[this.getFormIndexValue()].formName == "Customer Summary"){
        console.log(this.form);
        console.log(this.tsDetails.paymentMode);
        this.form.formSections.forEach((section: any) => {
          section.formControls.forEach((formControl: any) => {
          console.log(section);
          console.log(formControl);

          })
          // if (section.sectionTitle == "Details of Your Proposal" && this.bbdetails.paymentMode == "yes") {
          //   section.visible = false;
          // }
        });

      }
      // Extract form array for 'insuredMemberDetails' to preserve it
      const insuredMemberDetailsArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;

      // Iterate over bbdetails keys to patch the form
      if(this.productId == 7 || this.productId == 8 || this.productId == 31 || this.productId == 30){

        if(this.policyDetails){
          this.filteredPolicies = this.policyDetails.policyDetails.filter(
            (policy: any) => policy.certificateNumber && policy.quoteType === "FULLQUOTE"
          );
          this.dynamicFormGroup.get('premium')?.setValue(this.policyDetails.proposerDetails.proposerDetails.premium)

          if(this.filteredPolicies.length == 2){
            this.d2cDetails = this.filteredPolicies[0]
            this.d2cDetails.certificateNumber = this.d2cDetails.certificateNumber + '\n' + this.filteredPolicies[1].certificateNumber
            this.d2cDetails.productName = this.d2cDetails.productName + '\n' + this.filteredPolicies[1].productName
          }else{
            this.d2cDetails = this.filteredPolicies[0]
          }
        //   this.policyDetails.policyDetails.forEach((item:any)=>{
        //     Object.keys(item).forEach((key) => {
        //         // Check if the control exists and update its value
        //         if (this.dynamicFormGroup.contains(key)) {
        //           this.dynamicFormGroup.get(key)?.setValue(item[key]);
        //         }
              
        //     });
        // })
        }
        Object.keys(this.d2cDetails).forEach((key) => {
          if (key !== 'insuredMemberDetails') {
            // Check if the control exists and update its value
            if (this.dynamicFormGroup.contains(key)) {
              this.dynamicFormGroup.get(key)?.patchValue(this.d2cDetails[key]);
            }
          }
        });
       
        
        if(this.getFormIndexValue() == 0){
          this.d2cDetails.insuredMemberDetails.forEach((item: any, index: any) => {
            // const selfResult = this.centimetersToFeetAndInches(item.height);
            const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
            const formGroup = insuredMembersArray.at(index) as FormGroup;
            // console.log(insuredMembersArray?.value);
            if(insuredMembersArray.value[index].relation == item.relation){
              insuredMembersArray.at(index).patchValue({
                // name: item.name,
                // lastName: item.name,
                // dob: item.dob,
                // gender: item.gender,
                // memberAge: this.getAgeFromDOB(item.dob),
                // weight: item.weight,
                // height: item.height,
                // heightInches: item.heightInches
                firstName: item.firstName,
                middleName:item.middleName,
                lastName: item.lastName,
                dob: item.dob,
                gender: item.gender,
                salutation:item.salutation,
                memberAge:  this.getAgeFromDOB(item.dob),
                weight: item.weight,
                height: item.height,
                heightInches: item.heightInches
                // height: selfResult.feet !== 0 ? selfResult.feet : null,
                // heightInches: selfResult.inch !== 0 ? selfResult.inch : null,
              });
            }
          });
        }
      }else{
        Object.keys(this.bbdetails).forEach((key) => {
          if (key !== 'insuredMemberDetails') {
            // Check if the control exists and update its value
            if (this.dynamicFormGroup.contains(key)) {
              this.dynamicFormGroup.get(key)?.patchValue(this.bbdetails[key]);
            }
          }
        });
        console.log(this.getFormIndexValue());
        console.log(this.formSequence[0].formName);
        console.log(this.paramLeadId.CurrentIndex);
        console.log(this.formSequence[this.getFormIndexValue()].formName);
        if(this.paramLeadId.CurrentIndex == 7 && this.formSequence[this.getFormIndexValue()].formName == "Policy Summary"){
          let reqObj = {
            "leadId": this.leadId
          }
          this.rugService.getBBPolicyInfoByLeadId(reqObj).subscribe({
            next: (res: any) => {
              console.log(res);
              res = JSON.parse(res.data).data
              console.log(res);
              this.policyDetails = res;
              console.log(this.policyDetails);
              this.filteredPolicies = this.policyDetails.policyDetails.filter(
                (policy: any) => policy.certificateNumber && policy.quoteType === "FULLQUOTE"
              );
              
              console.log(this.filteredPolicies);

              console.log(this.dynamicFormGroup.value);
              
              this.formData.members = this.policyDetails.proposerDetails.insuredDetails[0]?.relationWithProposer;
              this.formData.policyNumber = this.filteredPolicies[0]?.policyNumber || null;
              this.formData.productName = this.filteredPolicies[0]?.productName || null;
              this.formData.secondMembers = this.policyDetails.proposerDetails.insuredDetails[0]?.relationWithProposer;
              this.formData.secondPolicyNumber = this.filteredPolicies[1]?.policyNumber || null
              this.formData.secondProductName = this.filteredPolicies[1]?.productName || null;
              this.formData.policyEmail = this.policyDetails.proposerDetails.proposerDetails.emailAddress || null
              // this.formData.totalPremium = this.policyDetails.proposerDetails.proposerDetails.premium || null;
              // this.dynamicFormGroup.get('policyNumber')?.setValue(this.filteredPolicies[0].policyNumber)
              // this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
              
              console.log(this.formData);
              console.log(this.dynamicFormGroup.value);

              // Merging updated formData with dynamicFormGroup values
            },
            error: (err) => {
              console.error(err);
            }
          });
          // console.log(this.policyDetails);
          // console.log(this.filteredPolicies)
        }
        if(this.getFormIndexValue() == 0 && (this.formSequence[0].formName == "Group Health Insurance + Group Protect" || this.formSequence[0].formName == "Group Health Insurance + Group Personal Accident" || this.formSequence[0].formName == "Group Health Insurance" || this.formSequence[0].formName == "Group Personal Accident + Group Critical Illness")){
          console.log(this.bbdetails)
          this.bbdetails.insuredMemberDetails.forEach((item: any, index: any) => {
            // const selfResult = this.centimetersToFeetAndInches(item.height);
            const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
            const formGroup = insuredMembersArray.at(index) as FormGroup;
            console.log(insuredMembersArray?.value);

            if(insuredMembersArray.value[index].relation == item.relation){
              insuredMembersArray.at(index).patchValue({
                firstName: item.firstName,
                lastName: item.lastName,
                dob: item.dob,
                gender: item.gender,
                age: item.age,
                weight: item.weight,
                height: item.height,
                heightInches: item.heightInches,
                mobileNumber:item.mobileNumber,
                emailId:item.emailId
                // height: selfResult.feet !== 0 ? selfResult.feet : null,
                // heightInches: selfResult.inch !== 0 ? selfResult.inch : null,
              });
            }
            insuredMembersArray.at(0).patchValue({
              mobileNumber:this.bbdetails.proposerMobileNumber,
              emailId:this.bbdetails.proposerEmailAddress
            })
            insuredMembersArray.at(0).get('gender')?.disable();
            insuredMembersArray.at(0).get('firstName')?.disable();
            insuredMembersArray.at(0).get('mobileNumber')?.disable();
            insuredMembersArray.at(index).get('relation')?.disable();
           
            // insuredMembersArray.at(index).get('gender')?.disable();
        item.relation != "Spouse" ? insuredMembersArray.at(index).get('gender')?.disable(): "";

          });
        }
        if(this.formSequence[this.getFormIndexValue()].formId == 2 && this.partnerId == "16"){
          // insuredMembersArray.at(0).get('firstName')?.disable();
          this.dynamicFormGroup.get('preFix')?.disable();
          this.dynamicFormGroup.get('customerFirstName')?.disable();
          this.dynamicFormGroup.get('customerLastName')?.disable();
          this.dynamicFormGroup.get('proposerGender')?.disable();
          this.dynamicFormGroup.get('proposerDob')?.disable();
          this.dynamicFormGroup.get('proposerMobileNumber')?.disable();
          this.dynamicFormGroup.get('proposerPanNumber')?.disable();
          this.dynamicFormGroup.get('proposerEmailAddress')?.disable();
          this.dynamicFormGroup.get('proposerAddress')?.disable();
      }
      if(this.formSequence[this.getFormIndexValue()].formId == 4 && this.partnerId == "45"){
        this.dynamicFormGroup.patchValue({
          preFix: this.tsDetails.proposerGender == "M" ? "Mr" : "Ms"
        })
        this.dynamicFormGroup.get('preFix')?.disable();
        this.dynamicFormGroup.get('proposerGender')?.disable();
      }
        if(this.getFormIndexValue() == 1 && (this.formSequence[0].formName == "Proposer Details")){
          console.log(this.tsDetails)
          this.tsDetails.insuredMemberDetails.forEach((item: any, index: any) => {
            // const selfResult = this.centimetersToFeetAndInches(item.height);
            const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
            const formGroup = insuredMembersArray.at(index) as FormGroup;
            console.log(insuredMembersArray?.value);

            if(insuredMembersArray.value[index].relation == item.relation){
              insuredMembersArray.at(index).patchValue({
                salutation: item.salutation,
                firstName: item.firstName,
                lastName: item.lastName,
                dob: item.dob,
                gender: item.gender,
                age: item.age,
                weight: item.weight,
                height: item.height,
                heightInches: item.heightInches,
                mobileNumber:item.mobileNumber,
                emailId:item.emailId
                // height: selfResult.feet !== 0 ? selfResult.feet : null,
                // heightInches: selfResult.inch !== 0 ? selfResult.inch : null,
              });
            }
            insuredMembersArray.at(0).patchValue({
              mobileNumber:this.tsDetails.proposerMobileNumber,
              emailId:this.tsDetails.proposerEmailAddress
            })
          });
        }
      }


      // Restore the preserved form array for 'insuredMemberDetails'
      if (insuredMemberDetailsArray) {
        this.dynamicFormGroup.setControl('insuredMemberDetails', insuredMemberDetailsArray);
      }
      console.log(this.dynamicFormGroup.value);
      if (this.formSequence[this.getFormIndexValue()].formId == 2 && this.partnerId == "16") {
        console.log("Customer Details");
        console.log(this.dynamicFormGroup.value);
        console.log(this.bbdetails);
        this.dynamicFormGroup.patchValue({
          preFix:this.bbdetails.proposerGender == "M" ? "Mr" : this.bbdetails.proposerGender == "F" ? "Ms" : "Others",
          customerFirstName: this.bbdetails.customerFirstName,
          customerLastName: this.bbdetails.customerLastName,
          proposerGender: this.bbdetails.proposerGender,
          proposerDob: this.bbdetails.proposerDob,
          proposerMobileNumber: this.bbdetails.proposerMobileNumber,
          proposerPanNumber: this.bbdetails.proposerPanNumber,
          proposerEmailAddress: this.bbdetails.proposerEmailAddress,
          proposerAddress: this.bbdetails.proposerAddress,
          proposerCity: this.bbdetails.proposerCity,
          proposerState: this.bbdetails.proposerState,
          proposerPincode: this.bbdetails.proposerPincode,
          proposerIsNri: this.bbdetails.proposerIsNri

        })
        console.log(this.bbdetails.totalPremium);
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.bbdetails.totalPremium);
      }
      if (this.formSequence[this.getFormIndexValue()].formId == 3 && this.partnerId == "45") {
        let baseCallerRequest = {
          "baseCallerId": this.agentCode.toString()
        }
        this.rugService.getBaseCallerDetails(baseCallerRequest).subscribe({
          next: (res: any) => {
            let baseCallerResponse: any;
            console.log(res);
            baseCallerResponse = JSON.parse(res.data);
            console.log(baseCallerResponse);
            if (baseCallerResponse.isSuccess == true && baseCallerResponse.statusCode == 200) {
              // this.toast.success({ detail: "Success", summary: baseCallerResponse.message, duration: 3000 });
              this.dynamicFormGroup.patchValue({
                baseCallerId: baseCallerResponse?.data?.baseCallerDetails?.baseCallerId,
                baseCallerName: baseCallerResponse?.data?.baseCallerDetails?.baseCallerName,
                tlID: baseCallerResponse?.data?.baseCallerDetails?.tlid,
                tlName: baseCallerResponse?.data?.baseCallerDetails?.tlName,
                axisLocation: baseCallerResponse?.data?.baseCallerDetails?.axisLocation,
                avCode: baseCallerResponse?.data?.baseCallerDetails?.avCode,
                avName: baseCallerResponse?.data?.baseCallerDetails?.avName,
                imdCode: baseCallerResponse?.data?.baseCallerDetails?.imdCode
              })

            } else {
              this.toast.success({ detail: "Success", summary: baseCallerResponse.message, duration: 3000 });

            }

          },
          error: (err) => {
            console.error(err);
          }
        });
      }
      if (this.formSequence[this.getFormIndexValue()].formId == 3 && this.formSequence[this.getFormIndexValue()].formName == "Add Nominee") {
        this.dynamicFormGroup.patchValue({
          nomineeShare: this.bbdetails.defaultShare,
          relationWithProposer: this.bbdetails.relationWithProposer,
          nomineeFirstName: this.bbdetails.nomineeFirstName,
          nomineeLastName: this.bbdetails.nomineeLastName,
          nomineeMobileNumber: this.bbdetails.nomineeMobileNumber,
          nomineeAddress: this.bbdetails.nomineeAddress,
          nomineeDob: this.bbdetails.nomineeDob,
          nomineeGender: this.bbdetails.nomineeGender,
          appointeeName: this.bbdetails.appointeeName,
          appointeeMobileNumber: this.bbdetails.appointeeMobileNumber,
          appointeeDob: this.bbdetails.appointeeDob,
          relationWithNominee: this.bbdetails.relationWithNominee,
        })
        console.log(this.bbdetails.totalPremium);
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.bbdetails.totalPremium);
      }
      if (this.formSequence[this.getFormIndexValue()].formId == 4 && this.formSequence[this.getFormIndexValue()].formName == "Bank/Payment Details") {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        this.dynamicFormGroup.patchValue({
          bankName:this.bbdetails.branchName,
          IFSCCode:this.bbdetails.ifscCode,
          accountNo:this.bbdetails.accountNumber,
          micrCode:this.bbdetails.micrCode,
          branchName:this.bbdetails.branchName,
          startDate: formattedDate,
          consentDeclare: true
        })
        this.dynamicFormGroup.get('bankName')?.disable();
        this.dynamicFormGroup.get('ifscCode')?.disable();
        this.dynamicFormGroup.get('accountNumber')?.disable();
        this.dynamicFormGroup.get('micrCode')?.disable();
        this.dynamicFormGroup.get('branchName')?.disable();
        if (this.bbdetails?.ifscCode && this.bbdetails.ifscCode.trim() !== "") {
          console.log("IFSC Code is valid:", this.bbdetails.ifscCode);
          this.getBankDetailsByIfsc();
      }
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.bbdetails.totalPremium);
        this.dynamicFormGroup.get('consentDeclare')?.disable();
      }
      if(this.formSequence[this.getFormIndexValue()].formId == 5 && this.formSequence[this.getFormIndexValue()].formName == "Health Declaration"){
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.bbdetails.totalPremium);
      }
      // this.flattenObject(this.formData);
      
    }
  }

  initializeSubControls(subControls: any) {
    console.log(subControls);

    let formGroup: any = this.fb.group({});
    if (Array.isArray(subControls)) {
      subControls.forEach((control: any) => {
        let controlValidators: any = [];
        if (control.validators) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });
        }

        if (control.type == 'select' && control.getAllOption) {
          if (control.options?.length == 0) {
            this.callMethod(control.getAllOption, control);
          }
        }
        if (control.innerArrayControl) {
          let tempFormArray = this.fb.array([]);
          console.log(control.innerArrayControl);
          for (let i = 1; i < control.innerArrayControl.length; i++) {
            tempFormArray.push(this.initializeDynamicFormControls(control.innerArrayControl[i], i));
          }
          formGroup.addControl(control.name, tempFormArray);
        }

        if (control.innerSubControls) {
          formGroup.addControl(control.name, this.initializeSubControls(control.innerSubControls.slice(1)));
        }
        else if (control.coreControls) {
          let tempFormArray = this.fb.array([]);
          for (let i = 0; i < control.coreControls.length; i++) {
            tempFormArray.push(this.initializeSubControls(control.coreControls[i]))
          }
          formGroup.addControl(control.name, tempFormArray);
        }
        else if (!control.displayOnly || control.displayOnly === false)
          if (this.selectedAddons.length > 0 && this.selectedAddons.find((addon: any) => addon === control.label) && control.type === 'checkbox') {
            formGroup.addControl(control.name, new FormControl(true, controlValidators));
          } else {
            formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
          }
      });
    }
    else {
      let controlValidators: any = [];
      if (subControls.validators) {
        subControls.validators.forEach((val: IValidator) => {
          if (val.validatorName === 'required') controlValidators.push(Validators.required);
          if (val.validatorName === 'email') controlValidators.push(Validators.email);
          if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
          if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
          if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
        });
      }
      if (subControls.type == 'select' && subControls.getAllOption) {
        if (subControls.options?.length == 0) {
          this.callMethod(subControls.getAllOption, subControls);
        }
      }
      formGroup.addControl(subControls.name, new FormControl(subControls.value, controlValidators))
      // return new FormControl(subControls.value,controlValidators);
    }



    return formGroup;
  }

  initializeDynamicFormControls(dynamicFormControls: any, index: any = null) {

    let formGroup: any = this.fb.group({})
    dynamicFormControls.forEach((control: IDynamicControl) => {
      if (control.subControls) {
        let tempFormArray = this.fb.array([]);
        // for (let i = 0; i < control.subControls.length; i++) {
        //   tempFormArray.push(this.initializeSubControls(control.subControls[i]))
        // }
        formGroup.addControl(control.name, tempFormArray);
      }
      else {
        let controlValidators: any = [];
        if (control.validators && control.visible == true) {
          control.validators.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          })
        }

        if (control.type === 'multiSelectCheckbox' && control.selectCheckboxOptions) {

          this.resolveMethod(control.methodName, control);
          const controlGroup = this.fb.group({});
          control.selectCheckboxOptions.forEach(option => {
            controlGroup.addControl(option.value, new FormControl(false));
          });
          formGroup.addControl(control.name, controlGroup);

        }
        if (control.type === 'subtabview') {
          control.tabs?.forEach(element => {
            // this.callMethod(control.methodName, control);
            const controlGroup = this.fb.group({});
            element.selectCheckboxOptions?.forEach(option => {
              controlGroup.addControl(option.value, new FormControl(false));
            });
            formGroup.addControl(element.name, controlGroup);
          });

        }
        if (control.type == 'select' && control.getAllOption) {
          if (control.options?.length == 0) {
            this.callMethod(control.getAllOption, control);
          }
        }

        if (control.name == 'memberIndex' && index != null) {
          control.value = index - 1;
        }

        if (control.type == 'text' && control.methodName) {
          this.resolveMethod(control.methodName, control, index);
          console.log(control.methodName, this.form);

        }
        if (control.type == 'radio' && control.radioOptions) {
          let initialValue = control.radioOptions.find((option) => option.selected === true)?.value;
          formGroup.addControl(control.name, new FormControl(initialValue, controlValidators));
        }
        else {
          formGroup.addControl(control.name, new FormControl(control.value, controlValidators));
        }
      }
    })

    return formGroup;
  }

  dynamciallyLoadCSS(form: IForm) {
    let tf: string = "default.css";
    if (form.themeFile) tf = form.themeFile;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', 'assets/styles/dynamicForm/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
    this.showHtmlContent = true;
  }
  ngOnDestroy(): void {
    if (this.dynamicStyle) {
      this.renderer.removeChild(this.document.head, this.dynamicStyle)
    }
  }

  getValidationErrors(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): string {
    const myFormControl = parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name) : this.dynamicFormGroup.get(control.name)
    let errorMessage = ''
    control.validators?.forEach((val) => {
      if (myFormControl?.hasError(val.validatorName as string)) {
        if (control.name == 'insuredMembers' && val.validatorName == 'required') {
          if (this.dynamicFormGroup.get('planType')?.value == 'Multi Individual') {
            errorMessage = val.message as string + 'one'
          }
          else {
            errorMessage = val.message as string + 'two'
          }
        }
        else
          errorMessage = val.message as string
      }
    })
    return errorMessage;
  }

  checkValidations(
    control: IFormControl | IDynamicControl,
    parentControl: IFormControl | null = null,
    index: number | null = null
  ): boolean {
    // console.log(control, parentControl, index);
    let myControl: AbstractControl | null;

    if (parentControl != null && index != null) {
      const parentArray = this.dynamicFormGroup.get(parentControl.name) as FormArray;
      myControl = parentArray.controls[index].get(control.name);
    } else {
      myControl = this.dynamicFormGroup.get(control.name);
    }

    if (myControl instanceof FormControl) {
      return myControl.invalid && myControl.touched;
    } else if (myControl instanceof FormGroup) {
      return myControl.invalid && !myControl.pristine;
    }

    return false;
  }

  onCheckboxSelect(controlName: string) {
    const control = this.dynamicFormGroup.get(controlName);
    console.log(control);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  hasAnyValue(control: IFormControl | IDynamicControl, parentControl: IFormControl | null = null, index: number | null = null): boolean {
    return parentControl != null && index != null ? (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(control.name)?.value : this.dynamicFormGroup.get(control.name)?.value
  }
  hasInnerValue(control: any, parentControl: any | null = null, innerControl: any | null = null, index: any | null = null) {
    return parentControl != null && index != null ? ((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[parentControl.name] as FormArray).controls[index].get(innerControl.name)?.value : this.dynamicFormGroup.get(control.name)?.value
  }

  triggerFileInput(controlName: string) {
    console.log("getting called");

    const fileInputControl = this.document.getElementById(controlName);
    fileInputControl?.click();
  }

  onFileSelected(inputName: string, event: any) {
    const file = event.target.files[0];
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const control = this.dynamicFormGroup.get(inputName);

    if (file) {
      // Clear previous errors
      control?.setErrors(null);

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        console.log(allowedFileTypes);
        control?.setErrors({ fileType: true });
      }

      // Validate file size
      if (file.size > maxSizeInBytes) {
        control?.setErrors({ fileSize: true });
      }

      // If no errors, proceed to set the selected file
      if (!control?.errors) {
        this.selectedFile = file;
        control?.setValue(file.name);
      } else {
        control?.markAsTouched();
        this.selectedFile = null;
      }
    }
  }

  uploadPolicyDocument() {
    const insurerControl = this.dynamicFormGroup.get('getInsurerDetails');
    console.log(insurerControl?.value);


    if (this.selectedFile && insurerControl && insurerControl.value) {
      const formData = new FormData();
      formData.append('Files', this.selectedFile);
      formData.append('NameOfInsuranceCompany', insurerControl.value); // Dynamic value from the form control

      

      this.yatraService.fetchPolicyDetailsFromFile(formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded and policy details fetched:', response);
          this.toast.success({ detail: "Success", summary: "Policy document uploaded and processed successfully.", duration: 3000 });
          

          this.isPolicyDetailsFetch = true;

          if (response.data['insuredMemberDetails'].length > 0) {
            this.formData['insuredMemberDetails'] = response.data['insuredMemberDetails'];
            const insuredMembers: { [key: string]: boolean } = {};

            response.data['insuredMemberDetails'].forEach((member: any) => {
              insuredMembers[member.relation] = true;
            });

            this.formData['insuredMembers'] = insuredMembers;
            console.log(insuredMembers);

          }

          Object.keys(response.data).forEach((key: string) => {
            this.dynamicFormGroup.get(key)?.setValue(response.data[key]);

            if (key === 'memberPolicyType') {
              this.form.formSections.forEach((section: any) => {
                const targetControl = section.formControls.find((formControl: any) => formControl.name === 'memberPolicyType');
                if (targetControl) {
                  this.handlePolicyTypeChange(targetControl, response.data['memberPolicyTypeChange']);
                }
              });
            }
          });

          console.log(this.formData);
        },
        error: (error) => {
          
          this.toast.warning({ detail: "Warning", summary: "Failed to fetch Policy Details", duration: 3000 });
          console.error('Error fetching Policy details:', error);
        }
      });
    } else {
      console.error('No file selected or insurer not chosen');
    }
  }


  toggleContent(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }

  isContentVisible(index: number): boolean {
    return this.expandedCardIndex === index;
  }

  cardContent(itemName: string): void {
    this.expandedItem = this.expandedItem === itemName ? '' : itemName;
    this.selectedItem = itemName;
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.expandedItem = '';
  }
  planSummary(){
    if(this.isD2C){
      this.isPlanDetailsVisible = !this.isPlanDetailsVisible; // Toggle the state

    }else{
      this.isPlanDetailsVisible = false;
    }

  }
  planBBSummary(){
    this.isBBPlanDetailsVisible = !this.isBBPlanDetailsVisible;
  }
  addNavbar(index: number, value: any) {
    if (value.formName === 'Confirmation') {
      // this.customerFeedbackModule.show();
      this.feedbackSubmit = false;
      this.impressedValues = false;
      this.feedBackMessage = false;
      this.rating = 0;
      this.feedbackImpressedValue = '';
    }
    this.setFormIndexValue(index);

    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
  }

  onPhoneNumberInputChange(event: any, control: any, subControl?: any, i?: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    console.log(value);

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    input.value = value;
    console.log(value, subControl, control, i);
    if (subControl) {
      this.dynamicFormGroup.get(`${control.name}.${i}.${subControl.name}`)?.setValue(value);
    } else {
      this.dynamicFormGroup.get(control.name)?.setValue(value);
    }
  }

  async callMethod(methodName: string, control: any, section?: any) {
    if (control.otherControlName && section != undefined) {
      let otherControl = section.formControls.filter((formControl: IFormControl) => formControl.name == control.otherControlName)[0];
      const method = (this as any)[methodName];
      if (method && typeof method === 'function') {
        await (this as any)[methodName](otherControl)
      } else {
        console.error(`Method ${methodName} not found`);
      }
    }
    else if (control && methodName) {
      await (this as any)[methodName](control)
    }
  }
  callMethodForOtherControls(event: any, method: string, control: IFormControl, otherControl: IFormControl) {
    const methodFunction = (this as any)[method] as Function;
    if (methodFunction && typeof methodFunction === 'function') {
      (this as any)[method](event, otherControl)
    } else {
      console.error(`Method ${method} not found`);
    }
  }

  getSalutation(control: any) {
    this.yatraService.getSalutation().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.Salutation;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getInsuredOccupation(control: any) {
    this.yatraService.getInsuredOccupation().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = this.aesEncryptService.decrypt(res?.data);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getAllProposerOccupation(control: any) {
    this.yatraService.getProposerOccupation().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res?.data;
        // control.options = this.aesEncryptService.decrypt(res?.data);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  getBBoccupation(control: any) {
    this.rugService.getMasterData().subscribe({
      next: (res: any) => {
        console.log(res);
        this.occupationList = JSON.parse(res?.data).data.occupation;
        this.occupationList.map((item: any) => {
          item.name = item.occupationName;
          item.value = item.occupationName;
      })
        control.options = this.occupationList;
      },
      error: (err: any) => {
      console.error(err)
      }
    });
  }
  getNatureOfDuty(control: any) {
    this.yatraService.getNatureOfDuty().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = this.aesEncryptService.decrypt(res?.data);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getAllInsureData(control: any) {
    
    this.yatraService.getInsurerData().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.InsurerName;
        
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getIdentityProof(control: any) {
    this.yatraService.getIdentification().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.IdType;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getNationality(control: any) {
    this.yatraService.getNationality().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.Nationality;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getGstRegistrationStatus(control: any) {

    this.yatraService.getGstRegistrationStatus().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.Registration;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getMaritalStatus(control: any) {
    this.yatraService.getMaritalStatus().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.MaritalStatus;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getEducationType(control: any) {
    this.yatraService.getEducationType().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = res.EducationType;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getNomineeRelationShip(control: any) {
    this.yatraService.getNomineeRelationship().subscribe({
      next: (res: any) => {
        console.log(res);
        control.options = this.aesEncryptService.decrypt(res?.data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllBankDetails(control: any) {
    if (control.options.length <= 0) {

      // }
      // else{

      this.yatraService.getAllBankDetails().subscribe({
        next: (res: any) => {
          control.options = this.aesEncryptService.decrypt(res?.data);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }


  getBankCity(event: any, otherControl: any) {
    otherControl.value = "";
    otherControl.options = [];
    const data = JSON.parse(event.target.value);
    this.bankCode = data.id;
    const reqData = {
      "cityCode": "",
      "bankCode": this.bankCode
    };
    this.yatraService.getBankCity(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        otherControl.options = [...res.data]; // Create a new array to trigger change detection
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getBranchDetails(event: any, otherControl: any) {
    otherControl.value = "";
    otherControl.options = []; // Reset options to an empty array

    const data = JSON.parse(event.target.value);
    console.log(event.target.value, data, data.id);
    this.bankCity = data.id as string;
    console.log(this.bankCity);

    const reqData = {
      "bankCode": this.bankCode,
      "cityCode": this.bankCity
    };

    console.log(reqData);
    this.yatraService.getBranchDetails(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        otherControl.options = [...res.data]; // Create a new array to trigger change detection
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  setIfscCode(event: any, otherControl: any) {
    const data = JSON.parse(event.target.value);
    this.dynamicFormGroup.get('ifscCode')?.setValue(data.id);
    this.dynamicFormGroup.get('micrCode')?.setValue(data.value);
  }

  memberDetailsOption(control: any) {
    if (this.formData.insuredMemberDetails) {
      const selectedValue = this.formData.insuredMemberDetails;
      // control.options = this.encryptionService.decrypt(selectedValue as string).insuredMemberDetails;
      // console.log(control.options);
      selectedValue.forEach((element: any) => {
        control.options.push({
          "name": element.relationshipType,
          "value": element.relationshipType
        });
      });
    }
  }

  getAllRelationship(control: any) {
    
    this.yatraService.getRelationship().subscribe({
      next: (res: any) => {
        console.log(res);
        control.selectCheckboxOptions.forEach((element: any) => {
          const index = res.RelationShip.findIndex((relation: any) => relation.value === element.label);
          element.id = res.RelationShip[index].id;
        })
        
      },
      error: (err) => {
        
        console.error(err);
      }
    });
  }

  stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }


  onInputChange(event: any, control: any, parentControl: any = null, index: any = null, subControl: any = null) {
    this.changesMade = true;
    let eventValue = event.target.value;
    if (control.name === "chequeNumber") {
      const chequeNumber = event.target.value;
      if (chequeNumber.length > 6) {
        event.target.value = chequeNumber.slice(0, 6);
        this.dynamicFormGroup.get(control.name)?.setValue(chequeNumber.slice(0, 6));
        return;
      }
    }

    if (control.name === 'idProof') {
      const idProof = JSON.parse(event.target.value);
      console.log("id proof", idProof);
      this.idProofType = idProof.value;

      const idNumberControl = this.dynamicFormGroup.get('idNo');

      switch (this.idProofType) {
        case 'Aadhar Card':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('[0-9]{4}')
          ]);
          break;

        case 'Passport':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z][0-9]{2}(?:\\s?[0-9]{5})?$')
          ]);
          break;

        case 'Voter ID':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z]{3}[0-9]{7}$')
          ]);
          break;

        case 'Driving License':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$')
          ]);
          break;

        case '10th (SSC) Mark sheet':
          idNumberControl?.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]{7}$')
          ]);
          break;

        default:
          idNumberControl?.clearValidators();
      }

      idNumberControl?.updateValueAndValidity();
    }

    if (control.onChangeMethod) {

      if (control.type === 'radio') {
        const selectedValue = this.dynamicFormGroup.get(control.name)?.value;
        console.log(selectedValue);

        eventValue = selectedValue === 'yes' ? true : false;

        // Find the selected option by value
        const selectedOption = control.radioOptions.find((option: any) => option.value === selectedValue);

        // Check if the control or the selected option has dependentControls
        const dependent = control.dependentControls
          ? control.dependentControls
          : selectedOption?.dependentControls ?? control;

        // Call the resolveMethod with the found dependent controls
        this.resolveMethod(control.onChangeMethod, dependent, eventValue);
      } else {
        // If not a radio control, just resolve using the control
        this.resolveMethod(control.onChangeMethod, control, eventValue);
      }
    }

    if (parentControl == null && control.name == 'ifscCode') {
      const ifscCodeDetails = this.dynamicFormGroup.get('ifscCode')?.value || '';
      console.log(ifscCodeDetails);

      if (!ifscCodeDetails) {
        // Clear the bankName and micrCode fields
        this.dynamicFormGroup.get('bankName')?.setValue('');
        this.dynamicFormGroup.get('micrCode')?.setValue('');
        this.dynamicFormGroup.get('branchName')?.setValue('');
        return; // Exit the function
      }

      if (ifscCodeDetails.length == 11) {
        const reqData = {
          "ifsC_Code": event.target.value
        }
        console.log(reqData);

        this.yatraService.getBankDetailsByIFSC(reqData).subscribe({
          next: (response: any) => {
            response = JSON.parse(response.data)
            if (response.isSuccess && response.data) {
              this.dynamicFormGroup.get('bankName')?.setValue(response.data.bankName || '');
              this.dynamicFormGroup.get('micrCode')?.setValue(response.data.micrCode || '');
              this.dynamicFormGroup.get('branchName')?.setValue(response.data.branchName || '');
            } else {
              // Handle error, you can show a message if required
              this.toast.warning({ detail: "Warning", summary: 'Failed to Fetch Bank Details', duration: 3000 });
            }
          },
          error: (err) => {
            this.toast.error({ detail: "Error", summary: 'Failed to Fetch Bank Details', duration: 3000 });
          }
        });
      }
    }

    if (parentControl !== null && parentControl.type == 'combinedCheckbox') {
      this.changeOverLayDone(control, parentControl, false);
    }

    if (control.type == 'date' && control.dependentControls != null) {
      const dob = event.target.value;
      const dobArray = dob.split('-');

      if (parentControl != null && index != null) {

        if (dobArray[0] as number >= 1800) {
          const ageControl = this.dynamicFormGroup.get(parentControl.name);
          if (ageControl) {
            ageControl.value[index][control.dependentControls[0]] = this.calculateAge(dob).toString();
            (ageControl as FormArray).controls[index].get(control.dependentControls[0])?.markAsTouched();
            this.dynamicFormGroup.get(parentControl.name)?.patchValue(ageControl.value);
            if(this.isBB == true){
              this.calculateBBPremium();
            }
            if(this.isD2C == true){
              this.calculateD2CPremium()
            }
            if(this.isTS == true){
              this.calculateTSPremium();
            }
          }
        }
      }
      else {
        if (dobArray[0] as number >= 1800) {
          if(control.name == "nomineeDob"){
            let nomineeAge = this.calculateAge(dob);
            let isKid = /^\d+days$/.test(nomineeAge.toString());
            if(isKid == true){
              nomineeAge = 1;
            }
            if (typeof nomineeAge === "number") {        
              const appointeeNameControl = this.dynamicFormGroup.get('appointeeName');
              const appointeeMobileNumberControl = this.dynamicFormGroup.get('appointeeMobileNumber');
              const appointeeDobControl = this.dynamicFormGroup.get('appointeeDob');
              const relationWithNomineeControl = this.dynamicFormGroup.get('relationWithNominee');
              // Determine the second argument based on nomineeAge
              const shouldEnableDependentControls = nomineeAge < 18;
              if(shouldEnableDependentControls){
                control.dependentControls.forEach((item: any) => {
                  item.visibility = true
                })
                this.form.formSections.forEach((section: IFormSections) => {
                  section.formControls.forEach((control: IFormControl) => {
                    if(control.name == "appointeeName" || control.name == "appointeeMobileNumber" || control.name == "appointeeDob" || control.name == "relationWithNominee"){
                      control.visible = true;
                    }
                  })
                })
                appointeeNameControl?.setValidators([Validators.required]);
                appointeeMobileNumberControl?.setValidators([Validators.required]);
                appointeeDobControl?.setValidators([Validators.required]);
                relationWithNomineeControl?.setValidators([Validators.required]);
              }else{
                control.dependentControls.forEach((item: any) => {
                  item.visibility = false
                })
                this.form.formSections.forEach((section: IFormSections) => {
                  section.formControls.forEach((control: IFormControl) => {
                    if(control.name == "appointeeName" || control.name == "appointeeMobileNumber" || control.name == "appointeeDob" || control.name == "relationWithNominee"){
                      control.visible = false;
                    }
                  })
                })
                appointeeNameControl?.clearValidators();
                appointeeMobileNumberControl?.clearValidators();
                appointeeDobControl?.clearValidators();
                relationWithNomineeControl?.clearValidators();
              }             
              appointeeNameControl?.updateValueAndValidity();
              appointeeMobileNumberControl?.updateValueAndValidity();
              appointeeDobControl?.updateValueAndValidity();
              relationWithNomineeControl?.updateValueAndValidity();
            } else {
              console.error("Nominee age is not a number:", nomineeAge);
            }
          }else{
            const ageControl = this.dynamicFormGroup.get(control.dependentControls[0]);

            if (dob && ageControl) {
              ageControl.markAsTouched();
              const age = this.calculateAge(dob);
              ageControl.setValue(age);
            }
          }
        }
      }

    }


    if (parentControl == null && control.name == 'pincode') {
      const reqData = {
        "pincode": event.target.value
      }
      console.log(event.target.value.length, reqData);
      // this.commonService.getPinCodeByCity(reqData).subscribe({
      //   next: (res: any) => {
      //     console.log(res)
      //     this.dynamicFormGroup.get('city')?.setValue(res.data.city);
      //     this.dynamicFormGroup.get('state')?.setValue(res.data.state);
      //     this.dynamicFormGroup.get('zone')?.setValue(res.data.zone);
      //   },
      //   error: (err: any) => {
      //     console.error(err)
      //     this.dynamicFormGroup.get('city')?.setValue('');
      //     this.dynamicFormGroup.get('state')?.setValue('');
      //     this.dynamicFormGroup.get('zone')?.setValue('');
      //   }
      // });
    }
    else if (parentControl != null && parentControl.dynamicControls) {

      parentControl.dynamicControls.forEach((dynamicControls: IDynamicControl[]) => {
        dynamicControls.forEach((dynamicControl: IDynamicControl) => {
          if (dynamicControl.name == 'pincode' && dynamicControl.name == control.name) {
            const reqdata = {
              "pincode": event.target.value
            }
            // 
            // this.commonService.getPinCodeByCity(reqdata).subscribe({
            //   next: (res: any) => {
            //     console.log(res)

            //     const patchObject: { [key: string]: any } = {};

            //     patchObject['city' as string] = res.data.city;
            //     patchObject['zone' as string] = res.data.zone;
            //     patchObject['zoneValue' as string] = res.data.zoneCode;
            //     patchObject['state' as string] = res.data.state;

            //     let formArray: any = this.dynamicFormGroup.get(parentControl.name)?.value;

            //     for (let i = 0; i < formArray.length; i++) {
            //       if (i == index)
            //         formArray[i] = { ...formArray[i], ...patchObject }
            //     }


            //     this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
            //     
            //   },
            //   error: (err: any) => {
            //     console.error(err);
            //     const patchObject: { [key: string]: any } = {};

            //     patchObject['city' as string] = '';
            //     patchObject['zone' as string] = '';
            //     patchObject['zoneValue' as string] = '';
            //     patchObject['state' as string] = '';

            //     let formArray: any = this.dynamicFormGroup.get(parentControl.name)?.value;

            //     for (let i = 0; i < formArray.length; i++) {
            //       if (i == index)
            //         formArray[i] = { ...formArray[i], ...patchObject }
            //     }


            //     this.dynamicFormGroup.get(parentControl.name)?.patchValue(formArray);
            //     
            //   }
            // });
          }
        });
      });
    }

    if (control.onChangeMethod != null && control.otherControlName != null) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.otherControlName) {
            this.callMethodForOtherControls(event, control.onChangeMethod, control, formControl);
            //this.callMethod(event,control.method, formControl,section);
          }
        });
      });
    }
  }

  // calculateAge(dob: string): number {
  //   const today = new Date();
  //   const birthDate = new Date(dob);
  //   if (isNaN(birthDate.getTime())) {
  //     console.error('Invalid date format');
  //     return 0; // Or handle it according to your application's needs
  //   }
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDifference = today.getMonth() - birthDate.getMonth();
  //   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }
  getBankDetailsByIfsc(){
    const reqData = {
      "ifsC_Code": this.bbdetails.ifscCode
    }
    console.log(reqData);
    if(this.bbdetails.ifscCode != ""){
      this.yatraService.getBankDetailsByIFSC(reqData).subscribe({
        next: (response: any) => {
          response = JSON.parse(response.data)
          if (response.isSuccess && response.data) {
            this.dynamicFormGroup.get('bankName')?.setValue(response.data.bankName || '');
            this.dynamicFormGroup.get('micrCode')?.setValue(response.data.micrCode || '');
            this.dynamicFormGroup.get('branchName')?.setValue(response.data.branchName || '');
          } else {
            // Handle error, you can show a message if required
            this.toast.warning({ detail: "Warning", summary: 'Failed to Fetch Bank Details', duration: 3000 });
          }
        },
        error: (err) => {
          this.toast.error({ detail: "Error", summary: 'Failed to Fetch Bank Details', duration: 3000 });
        }
      });
    }

  }
  calculateAge(dob: Date): number | string {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 1) {
      const diffInMs = today.getTime() - birthDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays}days`;
    }

    return age;
  }

  // async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
  //   console.log(methodName);
  //   let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

  //   if (methodName == 'addOrRemoveAdditionalInsuredMember') {
  //     filteredArgs = filteredArgs.slice(-1);

  //   } else if (filteredArgs[filteredArgs.length - 1] == 'add' || filteredArgs[filteredArgs.length - 1] == 'remove') {
  //     filteredArgs.pop();
  //   }

  //   console.log(filteredArgs);

  //   const method = (this as any)[methodName] as Function;
  //   if (method && typeof method === 'function') {
  //     // method.bind(this)(...filteredArgs);
  //     await Promise.resolve(method.bind(this)(...filteredArgs));
  //     if (methodName == 'getProposerRelationship') {
  //       console.log("blehhhh");

  //     }
  //   } else {
  //     console.error(`Method ${methodName} not found`);
  //   }
  // }

  async resolveMethod(methodName: string, ...args: any[]): Promise<void> {
    console.log(methodName);

    // Filter out undefined and null arguments
    let filteredArgs = args.filter(arg => arg !== undefined && arg !== null);

    // Specific logic for handling certain method names
    if (methodName === 'addOrRemoveAdditionalInsuredMember') {
      filteredArgs = filteredArgs.slice(-1);
    } else if (filteredArgs[filteredArgs.length - 1] === 'add' || filteredArgs[filteredArgs.length - 1] === 'remove') {
      filteredArgs.pop();
    }

    console.log(filteredArgs);

    // Resolve the method dynamically
    const method = (this as any)[methodName] as Function;
    if (method && typeof method === 'function') {
      try {
        // Call the method with filtered arguments
        const result = method.bind(this)(...filteredArgs);

        // If the result is a Promise, await it; otherwise, wrap it in Promise.resolve()
        if (result && typeof result.then === 'function') {
          await result; // It's already a Promise, so await it
        } else {
          await Promise.resolve(result); // Wrap non-Promise results into a Promise
        }

        // Example logic specific to 'getProposerRelationship'
        if (methodName === 'getProposerRelationship') {
          console.log("Proposer Relationship");
        }
      } catch (error) {
        console.error(`Error in method ${methodName}:`, error);
      }
    } else {
      console.error(`Method ${methodName} not found`);
    }
  }



  handlePolicyTypeChange(control: any, planType: string | null = null): void {
    // const sumInsuredControl = this.dynamicFormGroup.get('memberSumInsured');
    // const pincodeControl = this.dynamicFormGroup.get('pincode');
    // if (sumInsuredControl || pincodeControl) {
    console.log(this.form);
    console.log(planType, control);

    if (planType == null)
      planType = control.value;
    console.log(control);
    setTimeout(() => {

      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == 'insuredMembers') {
            console.log(this.formData, this.form);

            if (((this.formData.productType == 'GHS' || this.formData.productType == 'AS') && formControl.selectCheckboxOptions?.length == 0) || (this.formData.productType != 'GHS' && this.formData.productType != 'AS')) {
              console.log(planType);

              this.resetInsuredMembers(control, planType);
              this.getProposerRelationship(formControl);
            }
            section.visible = true;
          }
        });
      });
    }, 0);


    // }
    // else {
    //   console.error('Sum Insured Control or Pincode Control not found in dynamicFormGroup.');
    // }

  }

  resetInsuredMembers(control: any, planType: any) {
    console.log(this.form, control, planType);

    this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(0);
    this.dynamicFormGroup.removeControl('insuredMemberDetails');
    if (planType === 'Multi Individual') {

      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, false, control.name);


      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == "Insured Member Details") {
          section.formControls[0].visible = true;
          if (section.formControls[1]) {
            section.formControls[1].visible = false;
            while (section.formControls[1].dynamicControls.length > 1) {
              section.formControls[1].dynamicControls.pop();
            }
          }
          section.visible = false;
        }
      });
    }
    else if (planType === 'Family Floater') {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, true, control.name);
      console.log(this.form);

      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == "Insured Member Details") {
          section.formControls[0].visible = false;
          section.formControls[1].visible = true;
          while (section.formControls[0].dynamicControls.length > 1) {
            section.formControls[0].dynamicControls.pop();
          }
          section.visible = false;
        }
      });
    }
    else {
      if (control.dependentControls)
        this.changeMainFormDependentControls(control.dependentControls, false, control.name);
      this.form.formSections.forEach((section: any) => {
        if (section.sectionTitle == "Insured Member Details") {
          section.formControls[0].visible = false;
          section.formControls[1].visible = false;

          while (section.formControls[0].dynamicControls.length > 1) {
            section.formControls[0].dynamicControls.pop();
          }

          while (section.formControls[1].dynamicControls.length > 1) {
            section.formControls[1].dynamicControls.pop();
          }

        }
      });
    }
  }

  setupRelationshipTypeValidation(childControl: IFormControl, index: any) {
    console.log("inside setupRelationshipTypeValidation");
    const eventValue = childControl.value;
    console.log(eventValue, index);

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.dynamicControls && formControl.visible) {
          console.log(formControl);

          // Check if dynamicControls[index] exists
          if (formControl.dynamicControls[index]) {
            formControl.dynamicControls[index].forEach((control: any) => {
              if (control.name == childControl.otherControlName) {
                if (control.validators && childControl.validationRules) {
                  // Create a new array for validators to avoid mutating the original
                  const newValidators: IValidator[] = control.validators.filter(
                    (val: IValidator) => val.validatorName === 'required'
                  );

                  // Determine the appropriate validation rule based on eventValue
                  let rule;
                  if (/^son\d*$/i.test(eventValue) || /^daughter\d*$/i.test(eventValue)) {
                    rule = childControl.validationRules.find((rule: any) => rule.type === 'child');
                  } else {
                    rule = childControl.validationRules.find((rule: any) => rule.type === 'adult');
                  }

                  console.log(rule);
                  if (rule) {
                    newValidators.push(rule);
                  }

                  // Assign the new validators array to the control
                  control.validators = newValidators;
                }
              }
            });
          }

          console.log(formControl);
        }
      });
    });

    // You can now set validators for the control using Angular's Form API, if needed
    // const memberAgeControl = (this.dynamicFormGroup.get(parentControl.name) as FormArray).controls[index].get(childControl.otherControlName);
    // if (memberAgeControl) {
    //   memberAgeControl.setValidators(newValidators.map(val => /* mapping logic to Angular Validators */));
    //   memberAgeControl.updateValueAndValidity();
    // }
  }


  increment(controlName: any, childControlName: any) {
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    this.dynamicFormGroup.get(controlName)?.setValue(currentValue + 1);
    this.form.formSections.forEach(formsection => {
      formsection.formControls.forEach(formControl => {
        if (formControl.dynamicControls && formControl.name == childControlName) {
          let tempDynamicControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
          formControl.dynamicControls.push(tempDynamicControl)
          let formArr = this.dynamicFormGroup.get(childControlName) as FormArray;
          formArr.push(this.initializeDynamicFormControls(tempDynamicControl));
        }
      });
    });
  }
  decrement(controlName: any, childControlName: any) {
    const currentValue = this.dynamicFormGroup.get(controlName)?.value;
    if (currentValue > 0) {
      this.dynamicFormGroup.get(controlName)?.setValue(currentValue - 1);
      this.form.formSections.forEach(formsection => {
        formsection.formControls.forEach(formControl => {
          if (formControl.dynamicControls && formControl.name == childControlName) {
            formControl.dynamicControls.pop();
          }
        });
      });
      let formArr = this.dynamicFormGroup.get(childControlName) as FormArray;
      formArr.removeAt(formArr.length - 1);
    }
  }


  incrementMember(event: any, control: IFormControl, option: any) {
    // Prevent event propagation to the checkbox
    event.stopPropagation();
    const formGroup = this.dynamicFormGroup.get(control.name) as FormGroup;
    let index = parseInt(option.value.slice(-1), 10);
    index += 1;
    const baseName = option.value.replace(/\d+$/, '');
    const newControlName = baseName + index;
    const controlCount = Object.keys(formGroup.controls).length;
    let selectedMembers: string[] = [];
    Object.keys(formGroup.controls).forEach((key: string) => {
      if(formGroup.controls[key].value === true){
        selectedMembers.push(key);
      }
    })
    if ((selectedMembers.includes("Son1") && selectedMembers.includes("Daughter1")) || (selectedMembers.includes("Son1") && selectedMembers.includes("Daughter2")) || (selectedMembers.includes("Son2") && selectedMembers.includes("Daughter1")) || (selectedMembers.includes("Son2") && selectedMembers.includes("Daughter2")) || (selectedMembers.includes("Son1") && selectedMembers.includes("Son2")) || (selectedMembers.includes("Daughter1") && selectedMembers.includes("Daughter2")) ) {
      this.toast.warning({ detail: "Warning", summary: "Only two kids are allowed to select", duration: 3000 });
    } else {
          // Add the new control with a unique name
        formGroup.addControl(newControlName, new FormControl(false));
        this.form.formSections.forEach((section) => {
          section.formControls.forEach((formControl: IFormControl) => {
            if (formControl.name === control.name) {
              formControl.selectCheckboxOptions?.push({
                label: option.label,
                value: newControlName,
                isIncrement: false,
                imagePath: option.imagePath
              });
    
              // Disable the button for the current option
              formControl.selectCheckboxOptions?.forEach((checkOption) => {
    
                if (checkOption.value === option.value) {
                  checkOption.isIncrement = false;
                }
              });
            }
          });
        });
    }
  }

  // getProposerRelationship(control: IFormControl): Promise<any> {
  //   // Showing the spinner before making the API call
  //   

  //   // Wrapping the asynchronous operation in a promise
  //   return new Promise((resolve, reject) => {
  //     const reqData = {
  //       agencyCode: this.partnerId,
  //       insuranceTypeCode: 101,
  //       productId: this.productId,
  //       policyType: this.dynamicFormGroup.get('memberPolicyType')?.value,
  //     };

  //     console.log(reqData);

  //     // Calling the API service
  //     this.service.GetProposerRelationships(reqData).subscribe({
  //       next: (res) => {
  //         console.log(res, "API Response Received");

  //         // Prepare form group
  //         const controlGroup = this.fb.group({});

  //         // For each relationship option, add a control
  //         res.relationShip.forEach((option: any) => {
  //           controlGroup.addControl(option.value, new FormControl(false));
  //         });

  //         // Remove previous insuredMembers control
  //         this.dynamicFormGroup.removeControl('insuredMembers');

  //         // Add validators
  //         let controlValidators: any = [];
  //         control.validators?.forEach((val: IValidator) => {
  //           if (val.validatorName === 'required') controlValidators.push(Validators.required);
  //           if (val.validatorName === 'email') controlValidators.push(Validators.email);
  //           if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
  //           if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
  //           if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
  //         });

  //         // controlGroup.setValidators([...controlValidators, this.addCustomValidation()]);
  //         // controlGroup.updateValueAndValidity();
  //         // controlGroup.setErrors({ required: true });

  //         // Add the new insuredMembers control
  //         this.dynamicFormGroup.addControl(control.name, controlGroup);


  //         // Update control with the fetched options
  //         control.selectCheckboxOptions = res.relationShip;
  //         console.log(this.isQuote);

  //         if (this.isQuote) {
  //           this.form.formSections.forEach((section: any) => {
  //             section.formControls.forEach((control: any) => {
  //               if (control.name == 'insuredMembers') {
  //                 //loop the options and see if the option has value true in the insuredMembers in formData and the call the log selection
  //                 control.selectCheckboxOptions.forEach((option: any) => {
  //                   if (this.formData.insuredMembers[option.value] === true) {
  //                     // Call logSelection function (pass null for event if not triggering through UI)
  //                     this.logSelection(null, option, control);
  //                   }
  //                 })
  //               }
  //             })

  //           })
  //         }
  //         // Hide the spinner once the response is processed
  //         
  //         this.flattenObject(this.formData);
  //         console.log(this.formData, this.form);



  //         // Resolve the promise when API response is processed successfully
  //         resolve(res);
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         

  //         // Reject the promise on error
  //         reject(err);
  //       }
  //     });
  //   });
  // }

  getProposerRelationship(control: IFormControl): Promise<any> {
    // Showing the spinner before making the API call
    

    // Wrapping the asynchronous operation in a promise
    return new Promise((resolve, reject) => {
      const reqData = {
        productId: this.productId.toString(),
        policyType: this.dynamicFormGroup.get('memberPolicyType')?.value,
      };

      console.log(reqData);

      // API call wrapped in pipe
      this.yatraService.GetProposerRelationships(reqData).pipe(
        tap((res: any) => {
          console.log(res, "API Response Received");

          // Prepare form group
          const controlGroup = this.fb.group({});

          // For each relationship option, add a control
          // let relationCodes = this.bbdetails.insuredMemberDetails.map((item: any) => JSON.parse(item.relationshipType).id);
          let relationCodes = this.bbdetails.insuredMemberDetails.map((item: any) => 
          item.hasOwnProperty('relationshipType') && item.relationshipType 
            ? JSON.parse(item.relationshipType).id 
            : item.relationCode
          );
          let d2cRelationCodes = this.d2cDetails.insuredMemberDetails.map((item: any) => 
            item.hasOwnProperty('relationshipType') && item.relationshipType 
              ? JSON.parse(item.relationshipType).id 
              : item.relationCode
            );
            let tsRelationCodes = this.tsDetails.insuredMemberDetails.map((item: any) => 
            item.hasOwnProperty('relationshipType') && item.relationshipType 
              ? JSON.parse(item.relationshipType).id 
              : item.relationCode
            );
          res.data.relationShip.forEach((option: any) => {
            console.log(option);
            console.log(res.data.relationShip)
            console.log(this.bbdetails);
            // if(option.id == "R001" || option.id == "R002" || option.id == "R003" || option.id == "R004"){
              if (this.formSequence[0].formName == "Group Health Insurance + Group Protect" || this.formSequence[0].formName == "Group Health Insurance + Group Personal Accident" || this.formSequence[0].formName == "Group Health Insurance" || this.formSequence[0].formName == "Group Personal Accident + Group Critical Illness") {
                controlGroup.addControl(option.value, new FormControl((relationCodes.includes(option.id)) ? true : false));
                if (relationCodes.includes(option.id)) {
                controlGroup.get('Self')?.disable();
                  this.logSelection(null, option, control);
                }
              }else if(this.formSequence[0].formName == "Know Your Premium"){
                console.log(this.d2cDetails);
                controlGroup.addControl(option.value, new FormControl((d2cRelationCodes.includes(option.id)) ? true : false));
                if (d2cRelationCodes.includes(option.id)) {
                  controlGroup.get('Self')?.disable();
                  this.logSelection(null, option, control);
                }
              }else if(this.formSequence[0].formName == "Proposer Details"){
                console.log(this.tsDetails);
                controlGroup.addControl(option.value, new FormControl((tsRelationCodes.includes(option.id)) ? true : false));
                controlGroup.get('Self')?.disable();
                if (tsRelationCodes.includes(option.id)) {
                  this.logSelection(null, option, control);
                }
              } else {
                controlGroup.addControl(option.value, new FormControl(false));
              }
            // }
          });

          // Remove previous insuredMembers control
          this.dynamicFormGroup.removeControl('insuredMembers');

          // Add validators
          let controlValidators: any = [];
          control.validators?.forEach((val: IValidator) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
          });

          // Adding the custom validation if required
          // controlGroup.setValidators([...controlValidators, this.addCustomValidation()]);
          // controlGroup.updateValueAndValidity();

          // Add the new insuredMembers control
          this.dynamicFormGroup.addControl(control.name, controlGroup);

          // Update control with the fetched options
          control.selectCheckboxOptions = res.data.relationShip;
          console.log(this.isQuote, this.isPolicyDetailsFetch);

          if (this.isQuote || this.isPolicyDetailsFetch) {
            this.form.formSections.forEach((section: any) => {
              section.formControls.forEach((control: any) => {
                console.log(control);
                if (control.name === 'insuredMembers') {
                  // Loop the options and see if the option has value true in the insuredMembers in formData
                  control.selectCheckboxOptions.forEach((option: any) => {
                    if (this.formData.insuredMembers[option.value] === true) {
                      // Call logSelection function (pass null for event if not triggering through UI)
                      this.logSelection(null, option, control);
                    }
                  });
                }
              });
            });
          }

          // if (this.isPolicyDetailsFetch) {

          // }

          // Process formData for flattening if needed
          this.flattenObject(this.formData);
          console.log(this.formData, this.form);
          this.isFormLoaded = true;
        }),
        tap(() => {
          // Hide the spinner once the response is processed
          
        })
      ).subscribe({
        next: (res) => {
          // Resolve the promise when API response is processed successfully
          resolve(res);
        },
        error: (err) => {
          // Hide the spinner and handle error
          console.error(err);
          

          // Reject the promise on error
          reject(err);
        }
      });
    });
  }

  private getValidators(control: IFormControl) {
    let controlValidators: any = [];
    control.validators?.forEach((val: IValidator) => {
      if (val.validatorName === 'required') controlValidators.push(Validators.required);
      if (val.validatorName === 'email') controlValidators.push(Validators.email);
      if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
      if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
      if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
    });
    return controlValidators;
  }


  addCustomValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlGroup = this.dynamicFormGroup.get('insuredMembers') as FormGroup;
      if (controlGroup && this.dynamicFormGroup.get('planType')?.value == 'Multi Individual') {
        const hasAtLeastOneSelected = Object.keys(controlGroup.controls).some(
          key => controlGroup.controls[key].value === true
        );
        console.log(hasAtLeastOneSelected);

        return hasAtLeastOneSelected ? null : { required: true };
      }
      else if (controlGroup && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
        const selectedCount = Object.keys(controlGroup.controls).filter(
          key => controlGroup.controls[key].value === true
        ).length;
        console.log(selectedCount);

        if (selectedCount < 2) {
          return { required: true };
        }
      }
      return null;
    };
  }

  logSelection(event: any, option: any, controls: any) {
    // const checkbox = event.target as HTMLInputElement;
    const checkbox = event ? (event.target as HTMLInputElement) : { checked: true };
    console.log(checkbox.checked, option, controls);
    console.log(this.form.formSections);
    console.log(this.dynamicFormGroup.value);
    let firstName:any, lastName:any, middleName:any = ''

    this.form.formSections.forEach(formsection => {
      formsection.formControls.forEach(formControl => {
        console.log(checkbox.checked);
        if (checkbox.checked == true) {
          // if(formControl.name == 'totalPremium' && this.isPolicyDetailsFetch){
          //   formControl.value = "";
          //   this.dynamicFormGroup.get("totalPremium")?.setValue("");
          // }
          if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
            formsection.visible = true;
            if (this.isQuote == true && this.isPolicyDetailsFetch) {
              formControl.dynamicControls = formControl.dynamicControls.slice(0, 1);
              console.log(this.form, this.dynamicFormGroup.value);
              this.isQuote = false;
            }
            console.log(formControl.dynamicControls);
            console.log(option.value);
            let optionValue = option.value;
            let selectedMembers: string[] = [];
            formControl.dynamicControls.forEach(group => 
              group.forEach(control => {
                if(control.name === 'relation'){
                  selectedMembers.push(control.value)
                }
              })
            );
            let isSelfPresent = formControl.dynamicControls.some(group => 
              group.some(control => 
                control.name === 'relation' && control.value.toLowerCase() === optionValue.toLowerCase()
              )
            );
            if (isSelfPresent) {
              console.log("Relation is already present.");
            } else {
              console.log("Relation is not present.");
              if(formControl.dynamicControls.length < 5){
                if ((selectedMembers.includes("Son1") && selectedMembers.includes("Daughter1") && option.value != 'Spouse') || (selectedMembers.includes("Son1") && selectedMembers.includes("Daughter2") && option.value != 'Spouse') || (selectedMembers.includes("Son2") && selectedMembers.includes("Daughter1") && option.value != 'Spouse') || (selectedMembers.includes("Son2") && selectedMembers.includes("Daughter2") && option.value != 'Spouse') || (selectedMembers.includes("Son1") && selectedMembers.includes("Son2") && option.value != 'Spouse') || (selectedMembers.includes("Daughter1") && selectedMembers.includes("Daughter2") && option.value != 'Spouse') ) {
                  Object.keys(this.dynamicFormGroup.controls).forEach(field => {
                    const control = this.dynamicFormGroup.get(field);
                    if(field == "insuredMembers"){
                      if (control instanceof FormGroup) {
                        Object.keys(control.controls).forEach(nestedField => {
                          const nestedControl = control.get(nestedField);
                          if(nestedField == option.value){
                            nestedControl?.setValue(false);
                          }
                        });
                      } else {
                        // control?.markAsTouched({ onlySelf: true });
                      }
                    }
                    else {
                      console.log("not working");
                    }
                  });
                  this.toast.warning({ detail: "Warning", summary: "Only two kids are allowed to select", duration: 3000 });
                }else{
                  let tempControl = formControl.dynamicControls[0].map((element: any) => ({ ...element }));
                  tempControl[1].value = option.value;
                  tempControl[0].value = JSON.stringify(option);
                  formControl.dynamicControls?.push(tempControl);
                  console.log(this.formData);
      
                  let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
                  // let formArr;
                  console.log(formArr);
      
                  if (formArr != null) {
                    console.log(formArr.length);
                    formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
                    formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
                  }
                  else {
                    formArr = this.fb.array([]);
                    formArr.push(this.initializeDynamicFormControls(tempControl, formControl.dynamicControls.length - 1));
                    this.dynamicFormGroup.addControl(controls.idProperty, formArr);
                  }
                  if (checkbox.checked == true && option.value == 'Self') {
                    // let index = formControl.dynamicControls?.findIndex((element:any) => JSON.parse(element[0].value)?.value == option.value);
                    let index = -1;
                    if (formControl.dynamicControls) {
                      for (let i = 0; i < formControl.dynamicControls.length; i++) {
                        let element = formControl.dynamicControls[i];
                        try {
      
                          console.log(element[0]);
                          let parsedValue = element[0].value;
      
                          if (this.isStringifiedJson(parsedValue)) {
                              parsedValue = JSON.parse(parsedValue);
                            }
                          if (parsedValue.value === option.value) {
                            element.forEach((control: any) => {
                              if (control.name == 'dob' || control.name == 'memberAge' || control.name == 'memberGender' || control.name == 'emailId' || control.name == 'firstName' || control.name == 'name' || control.name == 'lastName' || control.name == 'relation' || control.name == 'gender') {
                                control.disabled = true
                              }
                            })
                            index = i;
                            break;
                          }
                        } catch (e) {
                          console.error('Error parsing JSON:', e);
                        }
                      }
                    }
      
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberdob')?.setValue(this.dynamicFormGroup.get('memberDobProposer')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('emailId')?.setValue(this.dynamicFormGroup.get('emailId')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('firstName')?.setValue(this.dynamicFormGroup.get('firstName')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('middleName')?.setValue(this.dynamicFormGroup.get('middleName')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('lastName')?.setValue(this.dynamicFormGroup.get('lastName')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('mobileNumber')?.setValue(this.dynamicFormGroup.get('mobileNumber')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('preFix')?.setValue(this.dynamicFormGroup.get('preFix')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('height')?.setValue(this.dynamicFormGroup.get('height')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('weight')?.setValue(this.dynamicFormGroup.get('weight')?.value);
                    (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('heightInches')?.setValue(this.dynamicFormGroup.get('heightInches')?.value);
                    // (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls[index - 1].get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);
      
                  }else{
                    console.log(checkbox);
                    console.log(option);
                    const insuredMembersFormGroup = this.dynamicFormGroup.get('insuredMemberDetails') as FormGroup;
                    console.log(insuredMembersFormGroup);
                    (insuredMembersFormGroup.controls as unknown as any[]).forEach((control: any, index : any) => {
                      console.log(control.get('relation').value);
                      if(control.get('relation').value == "Spouse"){
                        console.log(this.bbdetails);
                        if(this.isBB || this.isTS){
                          if(this.bbdetails.proposerGender == "M"){
                            control.get('gender').setValue("F")
                          }else{
                            control.get('gender').setValue("M")
                          }
                        }else if(this.isD2C){
                          if(this.d2cDetails.proposerGender == "M"){
                            control.get('gender').setValue("F")
                            control.get('salutation').setValue("MRS")
                            control.get('salutation').disable();
                          }else{
                            control.get('gender').setValue("M")
                            control.get('salutation').setValue("MR")
                            control.get('salutation').disable();
                          }
                        }else{
                          control.get('gender').setValue("F")
                        }
                        control.get('relation').disable();
                        control.get('gender').disable();
                      }
                      if(control.get('relation').value == "Son1" || control.get('relation').value == "Son2"){
                        control.get('gender').setValue("M")
                        control.get('relation').disable();
                        control.get('gender').disable();
                        if(this.isD2C){
                        control.get('salutation').setValue("MR")
                        control.get('salutation').disable();
                        }
                      }
                      if(control.get('relation').value == "Daughter1" || control.get('relation').value == "Daughter2"){
                        control.get('gender').setValue("F")
                        control.get('relation').disable();
                        control.get('gender').disable();
                        if(this.isD2C){
                          control.get('salutation').setValue("MS")
                          control.get('salutation').disable();
                          }
                      }
                        control.get('mobileNumber')?.clearValidators();
                        control.get('mobileNumber')?.setValidators([Validators.pattern('^[6-9]\\d{9}$')]);
                        // // Update the validation state
                        control.get('mobileNumber')?.updateValueAndValidity();
                      });
                  }
                }
              }else{
                Object.keys(this.dynamicFormGroup.controls).forEach(field => {
                  const control = this.dynamicFormGroup.get(field);
                  if(field == "insuredMembers"){
                    if (control instanceof FormGroup) {
                      Object.keys(control.controls).forEach(nestedField => {
                        const nestedControl = control.get(nestedField);
                        if(nestedField == option.value){
                          nestedControl?.setValue(false);
                        }
                      });
                    } else {
                      // control?.markAsTouched({ onlySelf: true });
                    }
                  }
                  else {
                    console.log("not working");
                  }
                });
                this.toast.warning({ detail: "Warning", summary: "Only four members are allowed to select", duration: 3000 });
              }
            }
            console.log(this.dynamicFormGroup.get('memberPolicyType')?.value);

            if (this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
              console.log((this.dynamicFormGroup.get(controls.idProperty) as FormArray));

              (this.dynamicFormGroup.get(controls.idProperty) as FormArray)?.controls.forEach((control: any) => {
                control.get('sumInsured')?.setValue(this.dynamicFormGroup.get('sumInsured')?.value);
              })
            }
            console.log(typeof this.dynamicFormGroup.get('numberOfInsuredMembers')?.value, this.dynamicFormGroup.get('numberOfInsuredMembers')?.value);

            this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('numberOfInsuredMembers')?.value + 1);
          }
          if(this.isD2C == true && controls.name == 'insuredMembers' && this.isFormLoaded == true){
            // this.calculateD2CPremium();
          }
          if(this.isD2C == false && controls.name == 'insuredMembers' && this.isFormLoaded == true){
            // this.calculateBBPremium();
          }
        }
        else if (checkbox.checked == false) {
          if (formControl.name == controls.idProperty && formControl.dynamicControls && formControl.visible == true) {
            let index = formControl.dynamicControls?.findIndex((element: any) =>
              element[1].value == option.value);
              console.log(option);
            if (index !== undefined && index !== -1 && index !== 1) {
              formControl.dynamicControls?.splice(index, 1);
              let formArr = this.dynamicFormGroup.get(controls.idProperty) as FormArray;
              formArr.removeAt(index - 1);
              if (formArr.length == 0) {
                formsection.visible = false;
              }
              Object.keys(this.formData).forEach(key => {
                if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
                  delete this.formData[key];
                }
                if (key.includes(option.value)) {
                  delete this.formData[key]
                }
              });
            }
            if(option.value == "Self" && index == 1){
              Object.keys(this.dynamicFormGroup.controls).forEach(field => {
                const control = this.dynamicFormGroup.get(field);
                if(field == "insuredMembers"){
                  console.log(control);
                  if (control instanceof FormGroup) {
                    Object.keys(control.controls).forEach(nestedField => {
                      const nestedControl = control.get(nestedField);
                      if(nestedField == option.value){
                        nestedControl?.setValue(true);
                      }
                    });
                  } else {
                    // control?.markAsTouched({ onlySelf: true });
                  }
                }
                else {
                  console.log("not working");
                }
              });
            }
            console.log(this.formData);
            this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('numberOfInsuredMembers')?.value - 1);
            // this.calculateD2CPremium()
          }
          // else if(formControl){
          //   Object.keys(this.formData).forEach(key => {
          //     if (key.startsWith(`${controls.idProperty}.${index - 1}.`)) {
          //       delete this.formData[key];
          //     }
          //   });
          // }
          if((this.isD2C == true && controls.name == 'insuredMembers') && this.isFormLoaded == true){
            this.calculateD2CPremium();
          }
          if(this.isD2C == false && controls.name == 'insuredMembers' && this.isFormLoaded == true && option.value != "Self"){
            this.calculateBBPremium();
          }

        }
      });
    })
    // const numberOfInsuredMembersControl = this.dynamicFormGroup.get('numberOfInsuredMembers');
    // if (numberOfInsuredMembersControl) {
    //   const numberOfInsuredMembers = numberOfInsuredMembersControl.value;

    const insuredMembersFormGroup = this.dynamicFormGroup.get('insuredMembers') as FormGroup;
    if (insuredMembersFormGroup) {
      insuredMembersFormGroup.setValidators(this.addCustomValidation());
      // console.log(this.addCustomValidation());

      insuredMembersFormGroup.updateValueAndValidity();
      console.log(this.dynamicFormGroup.get('insuredMembers'));

    }
    // }

    this.updateValueAndGroupError(this.dynamicFormGroup.get(controls.name) as FormGroup);


    if (this.formSequence[0].formName == "Group Health Insurance + Group Protect" || this.formSequence[0].formName == "Group Health Insurance + Group Personal Accident" || this.formSequence[0].formName == "Group Health Insurance" || this.formSequence[0].formName == "Group Personal Accident + Group Critical Illness") {
      // console.log(this.dynamicFormGroup.value);
      // console.log(this.bbdetails);
      // // this.dynamicFormGroup.patchValue(this.bbdetails);
        const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
        console.log(insuredMembersArray.value);
        // if(insuredMembersArray.value.length != 1){
        //   this.calculateBBPremium();
        // }
        // if(insuredMembersArray.value.length != 1 && this.formSequence[this.getFormIndexValue()].formName != "Customer Summary"){
        //   this.calculateBBPremium();
        // }
      if(insuredMembersArray.value.length === this.bbdetails.insuredMemberDetails.length){
              this.bbdetails.insuredMemberDetails.forEach((item: any, index: any) => {
        // const selfResult = this.centimetersToFeetAndInches(item.height);

        if(insuredMembersArray.value[index].relation = item.relation){
          insuredMembersArray.at(index).patchValue({
            firstName: item.firstName,
            lastName: item.lastName,
            dob: item.dob,
            gender: item.gender,
            age: item.age,
            weight: item.weight,
            height: item.height,
            heightInches: item.heightInches
            // height: selfResult.feet !== 0 ? selfResult.feet : null,
            // heightInches: selfResult.inch !== 0 ? selfResult.inch : null,
          });
        }
        // insuredMembersArray.at(index).get('relation')?.disable();
        item.relation != "Spouse" ? insuredMembersArray.at(index).get('gender')?.disable(): "";
      });
      insuredMembersArray.at(0).patchValue({
        mobileNumber:this.bbdetails.proposerMobileNumber,
        emailId:this.bbdetails.proposerEmailAddress
      })
      insuredMembersArray.at(0).get('gender')?.disable();
      insuredMembersArray.at(0).get('firstName')?.disable();
      insuredMembersArray.at(0).get('mobileNumber')?.disable();
      console.log(this.formSequence[this.getFormIndexValue()].formName);
      if(this.formSequence[this.getFormIndexValue()].formId == 2 && this.partnerId == "16"){
                // insuredMembersArray.at(0).get('firstName')?.disable();
                this.dynamicFormGroup.get('customerFirstName')?.disable();
                this.dynamicFormGroup.get('customerLastName')?.disable();
                this.dynamicFormGroup.get('proposerGender')?.disable();
                this.dynamicFormGroup.get('proposerDob')?.disable();
                this.dynamicFormGroup.get('proposerMobileNumber')?.disable();
                this.dynamicFormGroup.get('proposerPanNumber')?.disable();
                this.dynamicFormGroup.get('proposerEmailAddress')?.disable();
                this.dynamicFormGroup.get('proposerAddress')?.disable();
      }
      if(this.formSequence[this.getFormIndexValue()].formName == "Customer Summary"){
        this.dynamicFormGroup.get('insuredMembers')?.disable();
        console.log(insuredMembersArray);
        if (insuredMembersArray.value.length === this.bbdetails.insuredMemberDetails.length) {
          this.bbdetails.insuredMemberDetails.forEach((item: any, index: any) => {
            // const selfResult = this.centimetersToFeetAndInches(item.height);

            if (insuredMembersArray.value[index].relation = item.relation) {
              insuredMembersArray.at(index).get('relation')?.disable();
              insuredMembersArray.at(index).get('gender')?.disable();
            }
          })
        }
        // insuredMembersArray.at(0).get('firstName')?.disable();
        this.dynamicFormGroup.get('occupation')?.disable();
        this.dynamicFormGroup.get('sumInsured')?.disable();
        this.dynamicFormGroup.get('preFix')?.disable();
        this.dynamicFormGroup.get('proposerGender')?.disable();
        this.dynamicFormGroup.get('relationWithProposer')?.disable();
        this.dynamicFormGroup.get('nomineeGender')?.disable();
        this.dynamicFormGroup.get('accType')?.disable();
        this.dynamicFormGroup.get('bankAccountType')?.disable();
      }
      }


      
      // let selfResult = this.centimetersToFeetAndInches(this.bbdetails.insuredMemberDetails[0].height)
      // const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
      // insuredMembersArray.at(0).patchValue({
      //   firstName: this.bbdetails.insuredMemberDetails[0].firstName,
      //   lastName: this.bbdetails.insuredMemberDetails[0].lastName,
      //   weight: this.bbdetails.insuredMemberDetails[0].weight,
      //   dob: this.bbdetails.insuredMemberDetails[0].dob,
      //   gender: this.bbdetails.insuredMemberDetails[0].gender,
      //   age: this.bbdetails.insuredMemberDetails[0].age,
      //   height: this.bbdetails.insuredMemberDetails[0].height,
      //   heightInches: this.bbdetails.insuredMemberDetails[0].heightInches,
      // });
      // this.dynamicFormGroup.patchValue({
      //   sumInsured: this.bbdetails.sumInsured
      // })
      // this.dynamicFormGroup.get('totalPremium')?.setValue(this.bbdetails.totalPremium);
    }
    const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
    if (this.formSequence[0].formName == "Know Your Premium") {

    if (insuredMembersArray.value.length === this.d2cDetails.insuredMemberDetails.length) {


        this.d2cDetails.insuredMemberDetails.forEach((item: any, index: any) => {
          // const selfResult = this.centimetersToFeetAndInches(item.height);
          console.log(insuredMembersArray.value);

          if (insuredMembersArray.value[index].relation = item.relation) {
            console.log(item.name);
            const fullName = item.name;
            const length = fullName.split(' ').length             
            if(length == 1){
              firstName = fullName
              lastName = "."
            }else if(length == 2){
              firstName = fullName.split(" ")?.[0]
              lastName = fullName.split(" ")?.[1]
            }else if( length == 3){
                firstName = fullName.split(" ")?.[0]
                middleName = fullName.split(" ")?.[1]
                lastName = fullName.split(" ")?.[2]
            }
            // const [firstName, lastName] = fullName.split(' ');
            if(item.relation == "Self"){
              insuredMembersArray.at(index).patchValue({
                salutation: this.d2cDetails.customerSalutation,
              });
            }
            insuredMembersArray.at(index).patchValue({
              name: item.name,
              firstName:firstName,
              middleName:middleName,
              lastName: lastName,
              dob: item.dob,
              gender: item.gender,
              memberAge: this.getAgeFromDOB(item.dob),
              weight: item.weight,
              height: item.height,
              heightInches: item.heightInches
            });
          }
        });
        insuredMembersArray.at(0).get('gender')?.disable();
        insuredMembersArray.at(0).get('salutation')?.disable();
      }
    }
    if(this.formSequence[0].formName == "Proposer Details" && (this.formSequence[this.getFormIndexValue()].formId == 2 || this.formSequence[this.getFormIndexValue()].formId == 9)){
      const insuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
      console.log(insuredMembersArray.value);
    if(insuredMembersArray.value.length === this.tsDetails.insuredMemberDetails.length){
            this.tsDetails.insuredMemberDetails.forEach((item: any, index: any) => {
      if(insuredMembersArray.value[index].relation = item.relation){
        insuredMembersArray.at(index).patchValue({
          salutation: item.salutation,
          firstName: item.firstName,
          lastName: item.lastName,
          dob: item.dob,
          gender: item.gender,
          age: item.age,
          weight: item.weight,
          height: item.height,
          heightInches: item.heightInches
        });
      }
    });
    insuredMembersArray.at(0).patchValue({
      mobileNumber:this.tsDetails.proposerMobileNumber,
      emailId:this.tsDetails.proposerEmailAddress
    })
    insuredMembersArray.at(0).get('gender')?.disable();
    console.log(this.formSequence[this.getFormIndexValue()].formName);
    }
    }

  }
  isStringifiedJson(value: string): boolean {
    try {
      // Attempt to parse the value
      const parsed = JSON.parse(value);
      // Ensure the result is an object or array
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false; // Parsing failed, so it's not JSON
    }
  }
  centimetersToFeetAndInches(centimeters: number): any {
    // Convert centimeters to inches
    const inches = centimeters / 2.54;

    // Calculate whole feet and remaining inches
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.floor(inches % 12); // Round down to nearest whole number

    // Construct the result string
    const result = {
      feet: feet,
      inch: remainingInches
    };

    return result;
  }
  updateValueAndGroupError(controlGroup: FormGroup) {
    const anyTrue = Object.values(controlGroup.controls).some(control => control.value === true);
    if (anyTrue) {
      controlGroup.setErrors(null); // Clear errors if any control is true
    } else {
      controlGroup.setErrors({ required: true }); // Set required error if all controls are false
    }

  }
  onDrillDown(index: any, caseName: any) {
    const lastPage = this.getFormIndexValue()
    if (this.formSequence.length - 1 == lastPage) {
      return;
    }
    this.setFormIndexValue(index)
    this.getFormDataFromFormSequence(this.formSequence[index][caseName?.formId]);
  }
  getFormIndexValue() {
    const formIndex = localStorage.getItem("formIndex") as string;
    return formIndex ? parseInt(formIndex, 10) : 0;
  }
  setFormIndexValue(value: number) {
    localStorage.setItem("formIndex", value.toString());
  }
  incrementIndex() {
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex + 1);
  }
  decrementIndex() {
    const currentIndex = this.getFormIndexValue();
    this.setFormIndexValue(currentIndex - 1);
  }

  onPrevious(control: any) {
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  onD2cPrevious(){
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  onBBPrevious(){
    console.log("asdasd")
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  onBbPrevious() {
    console.log("asdasd")
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  onTsPrevious(){
    console.log("asdasd")
    if (this.getFormIndexValue() > 0) {
      this.decrementIndex()
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
    }
  }
  // onButtonClick(control: any) {
  //   this.selectedButton = control.name;
  //   console.log(this.selectedButton);

  //   const reqData = {
  //     agentcode: this.agentCode, // Fill these fields dynamically as needed
  //     proposalNumber: this.proposalNum,
  //     paymentMethod: this.selectedButton, // Payment method based on selected button
  //     source: 'Retail',
  //     policyType: 'New Business',
  //     policyNumber: '',
  //     quoteNumber: ''
  //   };

  //   this.yatraService.justPayRedirection(reqData).subscribe({
  //     next: (response: any) => {
  //       console.log('Juspay API Response:', response);

  //       if (response.paymentURL && response.paymentURL !== null && response.paymentURL !== '') {
  //         window.location.href = response.paymentURL;
  //       } else {
  //         this.toast.warning({ detail: "Warning", summary: "Invalid payment link received", duration: 3000 });
  //         console.error('Invalid payment link received:', response);
  //       }
  //     },
  //     error: (error) => {
  //       this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
  //       console.error('Error generating payment link:', error);
  //     }
  //   });

  //   if (control.dependentControls) {
  //     this.form.formSections.forEach((section: any) => {
  //       section.formControls.forEach((controls: any) => {
  //         control.dependentControls.forEach((item: any) => {
  //           if (controls.name == item) {
  //             controls.visible = true;
  //           }
  //         })
  //       })
  //     })
  //   }
  //   else {
  //     let list: any = [];
  //     this.form.formSections.forEach((section: any) => {
  //       section.formControls.forEach((controls: any) => {
  //         console.log(controls);

  //         if (controls.dependentControls) {
  //           list = controls.dependentControls;
  //         }
  //         list.forEach((item: any) => {
  //           if (controls.name == item) {
  //             controls.visible = false;
  //           }
  //         })
  //       })
  //     })
  //   }
  // }

  onButtonClick(control: any) {
    this.selectedButton = control.name;
    console.log(this.selectedButton);
    this.dynamicFormGroup.addControl('paymentOption', new FormControl(this.selectedButton));
    // const paymentModeControl = this.dynamicFormGroup.get('paymentMode');
    // if (paymentModeControl) {
    //   paymentModeControl.setValue(this.selectedButton);
    // }

    // if (this.selectedButton !== 'offline') {
    //   this.form.formSections.forEach((section: any) => {
    //     section.formControls.forEach((controls: any) => {
    //       if (controls.name === 'offline' && controls.dependentControls) {
    //         controls.dependentControls.forEach((item: any) => {
    //           const controlToHide = this.form.formSections
    //             .flatMap((sec: any) => sec.formControls)
    //             .find((ctrl: any) => ctrl.name === item);
    //           if (controlToHide) {
    //             controlToHide.visible = false; // Hide dependent controls for offline
    //           }
    //         });
    //       }
    //     });
    //   });
    // }

    // Handle the Juspay redirection for buttons other than Offline
    if (this.selectedButton !== 'offline') {
      // const reqData = {
      //   agentcode: this.agentCode,
      //   proposalNumber: this.proposalNum,
      //   paymentMethod: this.selectedButton,
      //   source: 'Retail',
      //   policyType: 'New Business',
      //   policyNumber: '',
      //   quoteNumber: '',
      //   OrderID: ''
      // };

      // this.yatraService.justPayRedirection(reqData).subscribe({
      //   next: (response: any) => {
      //     console.log('Juspay API Response:', response);

      //     if (response.paymentURL && response.paymentURL !== null && response.paymentURL !== '') {
      //       window.location.href = response.paymentURL; // Redirect to Juspay Payment URL
      //     } else {
      //       this.toast.warning({ detail: "Warning", summary: "Invalid payment link received", duration: 3000 });
      //       console.error('Invalid payment link received:', response);
      //     }
      //   },
      //   error: (error) => {
      //     this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
      //     console.error('Error generating payment link:', error);
      //   }
      // });
    }

    // Handle showing dependent controls if any are specified for the clicked button

    // if (control.dependentControls) {
    //   this.form.formSections.forEach((section: any) => {
    //     section.formControls.forEach((controls: any) => {
    //       control.dependentControls.forEach((item: any) => {
    //         if (controls.name == item) {
    //           controls.visible = true; // Show dependent controls
    //         }
    //       });
    //     });
    //   });
    // } else {
    //   let list: any = [];
    //   this.form.formSections.forEach((section: any) => {
    //     section.formControls.forEach((controls: any) => {
    //       if (controls.dependentControls) {
    //         list = controls.dependentControls;
    //       }
    //       list.forEach((item: any) => {
    //         if (controls.name == item) {
    //           controls.visible = false; // Hide controls if no dependentControls are specified
    //         }
    //       });
    //     });
    //   });
    // }
  }


  onEmailClick(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.dependentControls) {
          controls.dependentControls.forEach((item: any) => {
            const controlToHide = section.formControls.find((c: any) => c.name === item);
            if (controlToHide) {
              controlToHide.visible = false; // Hide all dependent controls initially
            }
          });
        }
      });
    });

    // Show the dependent controls for the currently clicked button
    if (control.dependentControls) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          control.dependentControls.forEach((item: any) => {
            if (controls.name === item) {
              controls.visible = true; // Show the dependent controls for this button
            }
          });
        });
      });
    }
  }

  onOtpClick(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.dependentControls) {
          controls.dependentControls.forEach((item: any) => {
            const controlToHide = section.formControls.find((c: any) => c.name === item);
            if (controlToHide) {
              controlToHide.visible = false; // Hide all dependent controls initially
            }
          });
        }
      });
    });

    // Show the dependent controls for the currently clicked button
    if (control.dependentControls) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          control.dependentControls.forEach((item: any) => {
            if (controls.name === item) {
              controls.visible = true; // Show the dependent controls for this button
            }
          });
        });
      });
    }
  }

  // In your template, you can bind the class dynamically
  getButtonClass(control: any): string {
    return this.selectedButton === control.name ? 'active-button' : '';
  }
  async onSubmit() {
    this.changesMade = false;
    if (this.getFormIndexValue() < this.formSequence.length - 1) {
      this.incrementIndex();
      this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
      
    }
    console.log(this.dynamicFormGroup.value, this.dynamicFormGroup, this.form);

    if (this.dynamicFormGroup.get('numberOfInsuredMembers')?.value < 2 && this.dynamicFormGroup.get('memberPolicyType')?.value == 'Family Floater') {
      this.toast.warning({ detail: "Warning", summary: "Minimum of two members are required for Family Family Floater policy", duration: 3000 });
      return;
    }
    else {
      if (this.dynamicFormGroup.valid &&
        (!this.dynamicFormGroup.get('nationality') || JSON.parse(this.dynamicFormGroup.get('nationality')?.value as any).value === 'Indian')) {

        //   // Flatten the form data
        if (this.dynamicFormGroup.get('insuredMemberDetails')) {
          this.dynamicFormGroup.get('numberOfInsuredMembers')?.setValue(this.dynamicFormGroup.get('insuredMemberDetails')?.value.length);
          this.dynamicFormGroup.get('insuredMemberDetails')?.value.forEach((element: any, index: any) => {
            element.memberIndex = index + 1;
          });
          this.dynamicFormGroup.get('insuredMemberDetails')?.value.forEach((member: any, index: any) => {
            if (member.relation == 'Self' && (this.dynamicFormGroup.get('memberDobProposer') || this.dynamicFormGroup.get('memberAgeProposer') || this.dynamicFormGroup.get('proposerGender')
              || this.dynamicFormGroup.get('emailId') || this.dynamicFormGroup.get('firstName') || this.dynamicFormGroup.get('middleName') || this.dynamicFormGroup.get('lastName') || this.dynamicFormGroup.get('preFix'))) {
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('preFix')?.setValue(this.dynamicFormGroup.get('preFix')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('memberdob')?.setValue(this.dynamicFormGroup.get('memberDobProposer')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('memberAge')?.setValue(this.dynamicFormGroup.get('memberAgeProposer')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('memberGender')?.setValue(this.dynamicFormGroup.get('proposerGender')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('emailId')?.setValue(this.dynamicFormGroup.get('emailId')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('firstName')?.setValue(this.dynamicFormGroup.get('firstName')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('middleName')?.setValue(this.dynamicFormGroup.get('middleName')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('lastName')?.setValue(this.dynamicFormGroup.get('lastName')?.value);
              (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray)?.controls[index].get('mobileNumber')?.setValue(this.dynamicFormGroup.get('mobileNumber')?.value);
            }
          })
        }
        console.log(this.dynamicFormGroup.value);

        this.flattenObjectInsert(this.dynamicFormGroup.value);
        this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
        console.log(this.formData);
        if (this.formData['sumInsured'] == null) {
          this.formData['sumInsured'] = this.formData.insuredMemberDetails[0].sumInsured;
        }
        if (this.form.formTitle.includes("Health & Lifestyle")) {
          this.mappingForQuestionnaire(this.form);
        }
        this.allJsonForm[this.getFormIndexValue()] = this.form;

        // if (this.form.saveBtnFunction) {
        //   await this.resolveMethod(this.form.saveBtnFunction);
        // }
        if (this.form.saveBtnFunction) {
          if (this.form.saveBtnFunction === 'fullQuotation') {
            console.log('Waiting for fullQuote API response before proceeding...');
            await this.fullQuotation(); // Call the fullQuotation method and wait for it to complete
          } else {
            console.log('Proceeding without waiting for fullQuote API');
            await this.resolveMethod(this.form.saveBtnFunction); // Handle other functions
          }
        }

        sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
        sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonForm));

        if (this.form.formTitle.includes("Total Premium")) {
          sessionStorage.setItem("addOnList", this.encryptionService.encrypt(this.addOnList));
          sessionStorage.setItem("addOnDetails", this.encryptionService.encrypt(this.addOnDetails));
          sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount));
          console.log(this.QuoteNumber, this.selectedIndex);
          this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
        }


        if (this.dynamicFormGroup.get('leadFirstName') && this.dynamicFormGroup.get('leadMiddleName') &&
          this.dynamicFormGroup.get('leadLastName') && this.dynamicFormGroup.get('leadMobileNo') &&
          this.dynamicFormGroup.get('leadEmailId') && this.dynamicFormGroup.get('generateLead')) {
          for (let i = 0; i < this.formData.insuredMemberDetails.length; i++) {
            let relation = JSON.parse(this.formData.insuredMemberDetails[i].relationshipType);
            if (relation.value == 'Self') {
              this.formData.insuredMemberDetails[i].memberType = this.formData.insuredMemberDetails[i].relationshipType;
              this.formData.insuredMemberDetails[i].firstName = this.dynamicFormGroup.get('leadFirstName')?.value;
              this.formData.insuredMemberDetails[i].middleName = this.dynamicFormGroup.get('leadMiddleName')?.value;
              this.formData.insuredMemberDetails[i].lastName = this.dynamicFormGroup.get('leadLastName')?.value;
              this.formData.insuredMemberDetails[i].mobileNumber = this.dynamicFormGroup.get('leadMobileNo')?.value;
              this.formData.insuredMemberDetails[i].emailId = this.dynamicFormGroup.get('leadEmailId')?.value;
              console.log(this.form, this.formData);


            }
          }
        }
        //   // for Store Form Data in Database
        let reqData = {
          "proposalNum": this.proposalNum,
          "partnerId": this.partnerId,
          "agentCode": this.agentCode,
          "formData": JSON.stringify(this.dynamicFormGroup.value),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId.toString(),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue(),
          "leadNumber": this.leadnumber,
          "quoteNumber": this.formData.quoteId ? this.formData.quoteId : ""
        };
        console.log(reqData);
        this.yatraService.Insertorupdateformdata(reqData).subscribe({
          next: (res: any) => {
            // this.toast.success({ detail: "Success", summary: "Form Data Saved Successfully.", duration: 3000 });
            console.log(res);
            this.leadnumber = res.data;
          },
          error: (err) => {
            console.error(err);
          }
        });
        // const reqdata = {
        //   "verticalCode": this.verticalCode,
        //   "partnerId": this.partnerId,
        //   "proposalNum": this.proposalNum,
        //   "code": this.Code,
        //   "agentCode": this.agentCode,
        //   "insuranceTypeCode": this.insurancetypecode,
        //   "productId": this.productId,
        //   "formName": this.formSequence[this.getFormIndexValue()].formName,
        //   "formData": JSON.stringify(this.formData),
        //   "formId": this.formSequence[this.getFormIndexValue()].formId,
        //   "formSequence": this.getFormIndexValue()
        // }
        // this.yatraService.Insertorupdatejourneydetails(reqdata).subscribe({
        //   next: (response) => {
        //     console.log(response);
        //   },
        //   error: (error) => {
        //     console.log(error);
        //   }
        // });

        if (this.getFormIndexValue() < this.formSequence.length - 1) {
          this.incrementIndex();
          this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
        }

        if (this.isQuote) {
          this.isQuote = false;
          sessionStorage.setItem("isQuote", this.isQuote);
        }
        console.log(this.isQuote);
      }
      else {
        console.log('Form is invalid', this.dynamicFormGroup);
        Object.keys(this.dynamicFormGroup.controls).forEach(field => {
          const control = this.dynamicFormGroup.get(field);
          if (control instanceof FormArray) {
            control.controls.forEach(arrayControl => {
              if (arrayControl instanceof FormGroup) {
                Object.keys(arrayControl.controls).forEach(nestedField => {
                  const nestedControl = arrayControl.get(nestedField);
                  nestedControl?.markAsTouched({ onlySelf: true });
                });
              } else {
                arrayControl?.markAsTouched({ onlySelf: true });
              }
            });
          }
          else if (control instanceof FormGroup) {
            control?.markAsDirty({ onlySelf: true });
          }
          else {
            control?.markAsTouched({ onlySelf: true });
          }
        });
        if (this.dynamicFormGroup.invalid)
          this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 })
        else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
          this.toast.warning({ detail: "Warning", summary: "Indian residency is required", duration: 3000 })
      }

    }
  }
  async calculateBBPremium() {
    let memberDob: any;
    let premiumObj;
    let memberRelation;
    let familyConstruct = 1;
    let selfDob: any;
    let spouseDob: any;
    let sortedArray: any[] = []
    const sinsuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
    sinsuredMembersArray.controls.forEach((memberControl: any, i: any) => {
      const memberGroup = sinsuredMembersArray.at(i) as FormGroup;
      console.log(sinsuredMembersArray.at(i).get('relation')?.value);
      console.log(sinsuredMembersArray.at(i).get('dob')?.value);
      console.log(memberGroup);
      memberDob = sinsuredMembersArray.at(i).get('dob')?.value;
      memberRelation = sinsuredMembersArray.at(i).get('relation')?.value;
      if (memberRelation == "Self") {
        selfDob = sinsuredMembersArray.at(i).get('dob')?.value
      }
      if (memberRelation == "Spouse") {
        familyConstruct = 2
        spouseDob = sinsuredMembersArray.at(i).get('dob')?.value
      }
      console.log('member Relationship Type:', memberRelation);
      console.log('member dob:', memberDob);
      if (!sortedArray.includes(memberRelation)) {
        sortedArray.push(memberRelation);
      } else {
        console.log(`${memberRelation} is already in the array.`);
      }
    });
    console.log(this.familyConstructsData);
    console.log(sortedArray);
    console.log(sortedArray.length);
    if(sortedArray.length == 1 && sortedArray.includes('Self')){
      familyConstruct = 1
    }else if(sortedArray.length == 2 && sortedArray.includes('Self') && sortedArray.includes('Spouse')){
      familyConstruct = 2
    }else if(sortedArray.length == 2 && sortedArray.includes('Self') && !sortedArray.includes('Spouse')){
      familyConstruct = 5
    }else if(sortedArray.length == 3 && sortedArray.includes('Self') && !sortedArray.includes('Spouse')){
      familyConstruct = 6
    }else if(sortedArray.length == 3 && sortedArray.includes('Self') && sortedArray.includes('Spouse')){
      familyConstruct = 3
    }else{
      familyConstruct = 4
    }
    console.log(familyConstruct);
    // this.yatraService.policyDetails.familyConstructId = familyConstruct.toString();
    this.dynamicFormGroup.get('familyConstructId')?.setValue(familyConstruct.toString());

    let filteredFamilyConstruct = this.familyConstructsData.filter((item: any) => item.familyConstructID === familyConstruct.toString());
    console.log(filteredFamilyConstruct);
    this.dynamicFormGroup.get('familyConstruct')?.setValue(filteredFamilyConstruct[0].displayText);
    // this.yatraService.policyDetails.familyConstruct = filteredFamilyConstruct[0].displayText;
    if(this.bbdetails.productCode == "R03"){
      
      if(familyConstruct == 1 || this.familyConstruct == 5 || this.familyConstruct == 6 ){
        let selfAgeRange=this.returnMemberAgeRange(familyConstruct,memberDob);
        premiumObj = this.bbPremiumData.filter((ele: any) => {
          
          return ( ele.familyConstructId == familyConstruct && ele.ageRange == selfAgeRange) 
        })
       }else{
        let elderPersonAge = this.getAgeFromDOB(spouseDob) >  this.getAgeFromDOB(selfDob) ?   spouseDob :   selfDob;
        let selfAgeRange = this.returnMemberAgeRange(familyConstruct,selfDob);
        let spouseAgeRange = this.returnMemberAgeRange(familyConstruct,spouseDob );
        // let ageRange = this.returnAgeRange(this.familyConstruct , this.dobform.get('spouseDob')?.value, this.dataService.policyDetails.proposerDetails.dob) // put this at dob this.dataService.policyDetails.proposerDetails.dob
        let ageRange = this.returnMemberAgeRange(familyConstruct ,elderPersonAge) 
        // put this at dob this.dataService.policyDetails.proposerDetails.dob
        premiumObj = this.bbPremiumData.filter((ele: any) => {
          
          return ( ele.familyConstructId == familyConstruct &&(( ele.ageRange == ageRange && ele.combinationName == 'GHI')||(ele.ageRange == selfAgeRange &&ele.combinationName == 'GP')||(ele.ageRange == spouseAgeRange && ele.combinationName == 'GP') )) 
        })
       
        console.log(premiumObj);
      }
    }else{
      let ageRange = this.returnAgeRange(familyConstruct, spouseDob, selfDob)
      console.log(ageRange);
      console.log(this.dynamicFormGroup.value, this.dynamicFormGroup, this.form);
      console.log(this.sumInsuredData);
      if(this.sumInsuredData == undefined){
        let filterArr;
        let sumInsuredObj = {
          ProductCode: this.bbdetails.productCode
        }
        await this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
          next: (res: any) => {
            res = JSON.parse(res.data).data
            this.sumInsuredData = res.productSIDetails;
            console.log(this.sumInsuredData);
            if (this.formSequence[this.getFormIndexValue()].formName != "Customer Summary") {  
              console.log(this.dynamicFormGroup.get('sumInsured')?.value)
              filterArr = this.sumInsuredData.filter((obj: any) => obj.siPlanValue.split('.')[0] == this.dynamicFormGroup.get('sumInsured')?.value)
              console.log(filterArr);
              if(this.formSequence[this.getFormIndexValue()].formName != "Customer Summary"){
                this.getBbPremium(filterArr);
              }
            }
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
      console.log(this.bbPremiumData)
      this.familyConstruct = familyConstruct;
      premiumObj = this.bbPremiumData.filter((ele: any) => {
        return (ele.familyConstructId == this.familyConstruct)
      })
      if(this.bbdetails.productCode != "R03"){
      premiumObj = this.bbPremiumData.filter((ele: any) => {
        return ((ele.ageRange == ageRange && ele.familyConstructId == this.familyConstruct) || (ele.familyConstructId == (this.familyConstruct == "6" || this.familyConstruct == "5" || this.familyConstruct == "1" ? "1" : "2") && ele.combinationName == 'GPA')) || (ele.familyConstructId == (this.familyConstruct == "6" || this.familyConstruct == "5" || this.familyConstruct == "1" ? "1" : "2") && ele.ageRange == ageRange && ele.combinationName == 'GCI') || (ele.familyConstructId == this.familyConstruct && ele.combinationName == 'GP')
      })
    }
      let orderOfPremium = ['GHI', 'GPA', 'GCI', 'GHI-5L', 'GHI-10L', 'GP']
      for(let i = 0; i <= orderOfPremium.length; i++){
  
        premiumObj.forEach((ele: any) => {
          if(ele.combinationName == orderOfPremium[i]){
            sortedArray.push(ele)
          }
        })
      }
    }
    console.log(premiumObj);
    console.log(this.dynamicFormGroup.get('planAvailable')?.value)
    if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI"
      );
      console.log(filteredData);
      this.bbdetails.ghiPremium = filteredData[0].premium.toString();
      this.bbdetails.productPlanName = "GHI";
      this.bbdetails.totalPremium = (filteredData[0].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);

    }
    else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA"
      );
      console.log(filteredData);
      console.log(this.bbdetails);
      this.bbdetails.ghiPremium = filteredData[0].premium.toString();
      this.bbdetails.gpaPremium = filteredData[1].premium.toString();
      this.bbdetails.productPlanName = "GHI,GPA";
      this.bbdetails.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
      if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
        return ele;
      }
      });
      this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);

    }
    else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA+GCI"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA" || item.combinationName === "GCI"
      );
      console.log(filteredData);
      this.bbdetails.ghiPremium = filteredData[0].premium.toString();
      this.bbdetails.gciPremium = filteredData[1].premium.toString();
      this.bbdetails.gpaPremium = filteredData[2].premium.toString();
      this.bbdetails.productPlanName = "GHI,GPA,GCI";
      this.bbdetails.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gciPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[2].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA,GCI");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);


    }else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI-5L"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GHI-5L"
      );
      console.log(filteredData);
      this.bbdetails.deductibleAmount = filteredData[1].premium.toString();
      this.bbdetails.productPlanName = "GHI-5L";
      this.bbdetails.totalPremium = (filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('deductibleAmount')?.setValue("500000");
      this.dynamicFormGroup.value.totalPremium = (filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI-5L");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);


    }else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI-10L"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GHI-10L"
      );
      console.log(filteredData);
      console.log(this.dynamicFormGroup.get('sumInsured')?.value);
      if(this.dynamicFormGroup.get('sumInsured')?.value == '10000000'){
        this.bbdetails.deductibleAmount = filteredData[1].premium.toString();
        this.bbdetails.productPlanName = "GHI-10L";
        this.bbdetails.totalPremium = (filteredData[1].premium).toFixed(2);
        this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
        this.dynamicFormGroup.get('gpaPremium')?.setValue(null);
  
        this.dynamicFormGroup.get('deductibleAmount')?.setValue("1000000");
        this.dynamicFormGroup.value.totalPremium = (filteredData[1].premium).toFixed(2);
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
        this.dynamicFormGroup.get('productPlanName')?.setValue("GHI-10L");
        this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
        let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
          if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
            return ele;
          }
          });
          this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      }else{
        this.dynamicFormGroup.get('planAvailable')?.setValue('GHI');
        this.toast.warning({ detail: "Warning", summary: "Please select Sum Insured as 1CR", duration: 3000 });
        this.calculateBBPremium();
      }
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);

    }else{
      if(this.bbdetails.productCode == "R03"){
        let premium=0
        let  fppGPpremium=0;
        let fppGhiPremium=0;
        premiumObj?.forEach((element: any) => {
          element.premium || 0; // Handle potential undefined or null premiums
      
          // Check if filteredPremiumArray length is greater than 2
          if (premiumObj.length > 2) {
              // Handle 'GP' and other combinations
              if (element.combinationName === "GP") {
                fppGPpremium = fppGPpremium+ element.premium / 2;
                  premium +=  element.premium / 2;
              } else {
                fppGhiPremium +=  element.premium;
                  premium +=  element.premium;
              }
          } else {
            if (element.combinationName === "GP") {
              fppGPpremium +=  element.premium;
             
          } else {
              fppGhiPremium +=  element.premium;
             
          }
              // If length <= 2, add full premium for each case
              premium+=element.premium
          }
      }); 
      
    
      this.bbdetails.ghiPremium =premiumObj.length > 2?fppGhiPremium: premiumObj[0].premium.toString();
      this.bbdetails.gpPremium = premiumObj.length > 2?fppGPpremium:premiumObj[1].premium.toString();
      this.bbdetails.totalPremium = (premiumObj.length > 2?premium:premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(premiumObj.length > 2?fppGhiPremium.toString():premiumObj[0].premium.toString());

      // this.yatraService.policyDetails.ghiPremium = premiumObj[0].premium.toString();
      // this.yatraService.policyDetails.gpPremium = premiumObj[1].premium.toString();
      this.dynamicFormGroup.get('gpPremium')?.setValue(premiumObj.length > 2?fppGPpremium.toString():premiumObj[1].premium.toString());
  
      this.dynamicFormGroup.value.totalPremium = (premiumObj.length > 2?premium:premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      }
      else{
        this.bbdetails.ghiPremium = premiumObj[0].premium.toString();
        this.bbdetails.gpPremium = premiumObj[1].premium.toString();
        this.bbdetails.totalPremium = (premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
        this.dynamicFormGroup.get('ghiPremium')?.setValue(premiumObj[0].premium.toString());
  
        // this.yatraService.policyDetails.ghiPremium = premiumObj[0].premium.toString();
        // this.yatraService.policyDetails.gpPremium = premiumObj[1].premium.toString();
        this.dynamicFormGroup.get('gpPremium')?.setValue(premiumObj[1].premium.toString());
    
        this.dynamicFormGroup.value.totalPremium = (premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      }
    }
    if(this.bbdetails.productCode == "R10"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GPA" || item.combinationName === "GCI"
      );
      this.bbdetails.gpaPremium = filteredData[0].premium.toString();
      this.bbdetails.gciPremium = filteredData[1].premium.toString();
      this.bbdetails.productPlanName = "GPA,GCI";
      this.bbdetails.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gciPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.get('ghiPremium')?.setValue(null);
      this.dynamicFormGroup.get('gpPremium')?.setValue(null);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GPA,GCI");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('combiId')?.setValue('8');
    }    
    if(this.bbdetails.productCode == "R03"){
      this.bbdetails.productPlanName = "GHI,GP";
      console.log(premiumObj);
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GPA" || item.combinationName === "GP"
      );
      console.log(filteredData);
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
      this.dynamicFormGroup.get('combiId')?.setValue('10');
    }
    console.log(this.dynamicFormGroup.value.totalPremium);
    console.log(this.bbdetails);
  }
  returnMemberAgeRange(familyConstructDetails: any, memberDob:any) {
    // Ensure you calculate ages from DOB
   memberDob =this.getAgeFromDOB(memberDob)
    
    if (familyConstructDetails == '2' || familyConstructDetails == '4' || familyConstructDetails == '3') {
        // Check the age ranges for the elder person
        if (memberDob >= 46 && memberDob <= 55) {
            return '46-55';
        } else if (memberDob >= 36 && memberDob <= 45) {
            return '36-45';
        } else if (memberDob >= 18 && memberDob <= 35) {
            return '18-35';
        } else {
            return;  // Invalid age
        }
    } else if (familyConstructDetails == '1' || familyConstructDetails == '5' || familyConstructDetails == '6') {
        // If family construct includes only self (proposer)
        if (memberDob >= 46 && memberDob <= 55) {
            return '46-55';
        } else if (memberDob >= 36 && memberDob <= 45) {
            return '36-45';
        } else if (memberDob >= 18 && memberDob <= 35) {
            return '18-35';
        } else {
            return;  // Invalid age
        }
    } else {
        // If no matching family construct found, return undefined or any default value
        return;
    }
  }
  calculateTSPremium() {
    let memberDob: any;
    let premiumObj;
    let memberRelation;
    let familyConstruct = 1;
    let selfDob;
    let spouseDob;
    let sortedArray: any[] = []
    const sinsuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
    const rawValues = sinsuredMembersArray.getRawValue();
    console.log(rawValues);
    rawValues.forEach((memberControl: any, i: any) => {
      const memberGroup = rawValues.at(i) as FormGroup;
      console.log(sinsuredMembersArray.at(i).get('relation')?.value);
      console.log(memberControl);
      console.log(memberControl.dob);
      memberDob = memberControl.dob;
      memberRelation = memberControl.relation
      if (memberRelation == "Self") {
        selfDob = memberControl.dob
      }
      if (memberRelation == "Spouse") {
        familyConstruct = 2
        spouseDob = memberControl.dob
      }
      console.log('member Relationship Type:', memberRelation);
      console.log('member dob:', memberDob);
      if (!sortedArray.includes(memberRelation)) {
        sortedArray.push(memberRelation);
      } else {
        console.log(`${memberRelation} is already in the array.`);
      }
    });
    console.log(this.familyConstructsData);
    console.log(sortedArray);
    console.log(sortedArray.length);
    if(sortedArray.length == 1 && sortedArray.includes('Self')){
      familyConstruct = 1
    }else if(sortedArray.length == 2 && sortedArray.includes('Self') && sortedArray.includes('Spouse')){
      familyConstruct = 2
    }else if(sortedArray.length == 2 && sortedArray.includes('Self') && !sortedArray.includes('Spouse')){
      familyConstruct = 5
    }else if(sortedArray.length == 3 && sortedArray.includes('Self') && !sortedArray.includes('Spouse')){
      familyConstruct = 6
    }else if(sortedArray.length == 3 && sortedArray.includes('Self') && sortedArray.includes('Spouse')){
      familyConstruct = 3
    }else{
      familyConstruct = 4
    }
    console.log(familyConstruct);
    // this.yatraService.policyDetails.familyConstructId = familyConstruct.toString();
    this.dynamicFormGroup.get('familyConstructId')?.setValue(familyConstruct.toString());

    let filteredFamilyConstruct = this.familyConstructsData.filter((item: any) => item.familyConstructID === familyConstruct.toString());
    console.log(filteredFamilyConstruct);
    this.dynamicFormGroup.get('familyConstruct')?.setValue(filteredFamilyConstruct[0].displayText);
    // this.yatraService.policyDetails.familyConstruct = filteredFamilyConstruct[0].displayText;
    let ageRange = this.returnAgeRange(familyConstruct, spouseDob, selfDob)
    console.log(ageRange);
    console.log(this.dynamicFormGroup.value, this.dynamicFormGroup, this.form);
    console.log(this.bbPremiumData)
    this.familyConstruct = familyConstruct;
    premiumObj = this.bbPremiumData.filter((ele: any) => {
      return (ele.familyConstructId == this.familyConstruct)
    })
    if(this.tsDetails.productCode != "R03"){
    premiumObj = this.bbPremiumData.filter((ele: any) => {
      return ((ele.ageRange == ageRange && ele.familyConstructId == this.familyConstruct) || (ele.familyConstructId == (this.familyConstruct == "6" || this.familyConstruct == "5" || this.familyConstruct == "1" ? "1" : "2") && ele.combinationName == 'GPA')) || (ele.familyConstructId == (this.familyConstruct == "6" || this.familyConstruct == "5" || this.familyConstruct == "1" ? "1" : "2") && ele.ageRange == ageRange && ele.combinationName == 'GCI') || (ele.familyConstructId == this.familyConstruct && ele.combinationName == 'GP')
    })
  }
    let orderOfPremium = ['GHI', 'GPA', 'GCI', 'GHI-5L', 'GHI-10L', 'GP']
    for(let i = 0; i <= orderOfPremium.length; i++){

      premiumObj.forEach((ele: any) => {
        if(ele.combinationName == orderOfPremium[i]){
          sortedArray.push(ele)
        }
      })
    }
    console.log(premiumObj);
    console.log(this.dynamicFormGroup.get('planAvailable')?.value)
    if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI"
      );
      console.log(filteredData);
      this.tsDetails.ghiPremium = filteredData[0].premium.toString();
      this.tsDetails.productPlanName = "GHI";
      this.tsDetails.totalPremium = (filteredData[0].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI");
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);

    }
    else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA"
      );
      console.log(filteredData);
      console.log(this.bbdetails);
      this.bbdetails.ghiPremium = filteredData[0].premium.toString();
      this.bbdetails.gpaPremium = filteredData[1].premium.toString();
      this.bbdetails.productPlanName = "GHI,GPA";
      this.bbdetails.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA");
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
      if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
        return ele;
      }
      });
      this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);

    }
    else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA+GCI"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA" || item.combinationName === "GCI"
      );
      console.log(filteredData);
      this.bbdetails.ghiPremium = filteredData[0].premium.toString();
      this.bbdetails.gciPremium = filteredData[1].premium.toString();
      this.bbdetails.gpaPremium = filteredData[2].premium.toString();
      this.bbdetails.productPlanName = "GHI,GPA,GCI";
      this.bbdetails.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gciPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[2].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA,GCI");
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);


    }else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI-5L"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GHI-5L"
      );
      console.log(filteredData);
      this.tsDetails.deductibleAmount = filteredData[1].premium.toString();
      this.tsDetails.productPlanName = "GHI-5L";
      this.tsDetails.totalPremium = (filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('deductibleAmount')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI-5L");
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);


    }else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI-10L"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GHI" || item.combinationName === "GHI-10L"
      );
      console.log(filteredData);
      console.log(this.dynamicFormGroup.get('sumInsured')?.value);
      if(this.dynamicFormGroup.get('sumInsured')?.value == '10000000'){
        this.tsDetails.deductibleAmount = filteredData[1].premium.toString();
        this.tsDetails.productPlanName = "GHI-10L";
        this.tsDetails.totalPremium = (filteredData[1].premium).toFixed(2);
        this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
        this.dynamicFormGroup.get('gpaPremium')?.setValue(null);
  
        this.dynamicFormGroup.get('deductibleAmount')?.setValue(filteredData[1].premium.toString());
        this.dynamicFormGroup.value.totalPremium = (filteredData[1].premium).toFixed(2);
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
        this.dynamicFormGroup.get('productPlanName')?.setValue("GHI-10L");
        let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
          if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
            return ele;
          }
          });
          this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      }else{
        this.dynamicFormGroup.get('planAvailable')?.setValue('GHI');
        this.toast.warning({ detail: "Warning", summary: "Please select Sum Insured as 1CR", duration: 3000 });
        this.calculateBBPremium();
      }
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);

    }else{
      this.tsDetails.ghiPremium = premiumObj[0].premium.toString();
      this.tsDetails.gpPremium = premiumObj[1].premium.toString();
      this.tsDetails.totalPremium = (premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(premiumObj[0].premium.toString());

      // this.yatraService.policyDetails.ghiPremium = premiumObj[0].premium.toString();
      // this.yatraService.policyDetails.gpPremium = premiumObj[1].premium.toString();
      this.dynamicFormGroup.get('gpPremium')?.setValue(premiumObj[1].premium.toString());
  
      this.dynamicFormGroup.value.totalPremium = (premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
    }
    if(this.tsDetails.productCode == "T04"){
      const filteredData = premiumObj.filter(
        (item: any) => item.combinationName === "GPA" || item.combinationName === "GCI"
      );
      this.tsDetails.gpaPremium = filteredData[0].premium.toString();
      this.tsDetails.gciPremium = filteredData[1].premium.toString();
      this.tsDetails.productPlanName = "GPA,GCI";
      this.tsDetails.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[0].premium.toString());
      this.dynamicFormGroup.get('gciPremium')?.setValue(filteredData[1].premium.toString());
      this.dynamicFormGroup.get('ghiPremium')?.setValue(null);
      this.dynamicFormGroup.get('gpPremium')?.setValue(null);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GPA,GCI");
      this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('combiId')?.setValue('8');
    }    
    if(this.tsDetails.productCode == "R03"){
      this.tsDetails.productPlanName = "GHI,GP";
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
      this.dynamicFormGroup.get('combiId')?.setValue('10');
    }
    console.log(this.dynamicFormGroup.value.totalPremium);
    console.log(this.tsDetails);
  }
  updateValidators(planAvailable: string) {
    const annualIncomeControl = this.dynamicFormGroup.get('annualIncome ');
    const occupationControl = this.dynamicFormGroup.get('occupation');
    
    if (planAvailable === 'GHI+GPA') {
      annualIncomeControl?.setValidators([Validators.required]);
      occupationControl?.setValidators([Validators.required]);
    } else {
      annualIncomeControl?.clearValidators();
      occupationControl?.clearValidators();
    }
  
    annualIncomeControl?.updateValueAndValidity();
    occupationControl?.updateValueAndValidity();
  }
  onBbCustomerSubmit(){
    // let reqObjBody = {
    //   leadId: this.bbdetails.leadId,
    //   productName: this.bbdetails.productName,
    //   mobileNumber: this.bbdetails.proposerMobileNumber,
    //   email: this.bbdetails.proposerEmailAddress
    // }
    console.log(this.dynamicFormGroup.value);
    console.log(this.dynamicFormGroup.get('decl2')?.value);
    console.log(this.dynamicFormGroup.get('decl3')?.value);
    console.log(this.dynamicFormGroup.valid);
    if (this.dynamicFormGroup.get('decl2')?.value == true && this.dynamicFormGroup.get('decl3')?.value == true && this.dynamicFormGroup.valid) {
      let reqObjBody = {
        "leadId": this.leadId,
        "productName": "Freedom Plus Plan",
        "mobileNumber": this.bbdetails?.proposerMobileNumber,
        "email": this.bbdetails?.proposerEmailAddress
      }
      const dialogRef = this.dialog.open(CaptchaPopupComponent, {
        width: "500px",
        autoFocus: false,
        data: reqObjBody
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result);
        const dialogRef = this.dialog.open(OtpPopupComponent, {
          width: "500px",
          autoFocus: false,
          data: { leadId: this.leadId, message: result.statusMessage, generateOtpReq: reqObjBody }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          console.log(result);
          if (result?.message == "OTP has been validated Successfully.") {
            const dialogRef = this.dialog.open(PaymentInfoComponent, {
              width: "500px",
              autoFocus: false,
              data: {
                leadId: this.bbdetails.leadId,
                customerName: this.bbdetails?.customerFirstName + " " + this.bbdetails?.customerLastName,
                mobileNumber: this.bbdetails?.proposerMobileNumber,
                amount: this.bbdetails?.totalPremium
              }
            });
            dialogRef.afterClosed().subscribe((result: any) => {
              console.log(result);
              if (this.bbdetails?.paymentMode == 'yes') {
                if (this.getFormIndexValue() < this.formSequence.length - 1) {
                  this.incrementIndex();
                  this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                }
              } else {
                console.log(this.bbdetails)
                // let reqBody = {
                //   leadId: this.bbdetails?.leadId
                // }
                let commonDraftRequest = {
                  "leadId": this.bbdetails?.leadId
                }
                this.rugService.bbHalfQuote(commonDraftRequest).subscribe({
                  next: (res: any) => {
                    let halfQuoteResponse: any;
                    console.log(res);
                    halfQuoteResponse = JSON.parse(res.data);
                    if (halfQuoteResponse.isSuccess == true && halfQuoteResponse.statusCode == 200) {
                      this.toast.success({ detail: "Success", summary: halfQuoteResponse.message, duration: 3000 });
                      let justpayPayload = {
                        "agentcode": this.agentCode,
                        "proposalNumber": this.bbdetails?.leadId,
                        //  "paymentMethod": "autoDebit",
                        "paymentMethod": this.bbdetails?.paymentOption == "eMandate" ? "emandate_payment" : "autoDebit",
                        "source": "RUG",
                        "policyType": "New Business",
                        "policyNumber": "",
                        "quoteNumber": "",
                        "OrderId": "",
                        "Amount": Math.round(this.bbdetails?.totalPremium),
                        "FirstName": this.bbdetails?.customerFirstName,
                        "MiddleName": "",
                        "LastName": this.bbdetails?.customerLastName,
                        "Phone": this.bbdetails?.proposerMobileNumber,
                        "Email": this.bbdetails?.proposerEmailAddress,
                        "DOB": this.bbdetails?.proposerDob,
                        "appName": "BRANCHBANKING"

                      }
                      console.log(justpayPayload);
                      this.d2cJustPayRedirection(justpayPayload)
                      // if (this.getFormIndexValue() < this.formSequence.length - 1) {
                      //   this.incrementIndex();
                      //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);

                      // }

                    } else {
                      this.toast.success({ detail: "Success", summary: halfQuoteResponse.message, duration: 3000 });

                    }

                  },
                  error: (err) => {
                    console.error(err);
                  }
                });
              }
            })
          }
        })
      })
    } else {
      this.toast.warning({ detail: "Warning", summary: "Declaration to be selected mandatorily to proceed with the journey", duration: 3000 });
    }
  }
  ond2cSubmit(){
    if(this.dynamicFormGroup.valid){
      if(this.getFormIndexValue() == 0 ||this.getFormIndexValue() == 1 || this.getFormIndexValue() == 2 || this.getFormIndexValue() == 3 || this.getFormIndexValue() == 4){
        if(this.getFormIndexValue() == 2 && this.isDeclarationSelected.value != "no"){
          this.toast.warning({ detail: "Warning", summary: "Basis the information provided this proposal cannot be processed.", duration: 3000 });
          return;
        }
        if(this.getFormIndexValue() == 2 && this.dynamicFormGroup.get('decl2')?.value != true && this.dynamicFormGroup.get('decl1')?.value != true){
          this.toast.warning({ detail: "Warning", summary: "Declaration to be selected mandatorily to proceed with the journey", duration: 3000 });
          return
        }
        // if(this.getFormIndexValue() == 3){
        //   this.dynamicFormGroup.value.accountNumber = this.bbdetails.accountNumber;
        //   // this.dynamicFormGroup.get('accountNumber')?.setValue(this.bbdetails.accountNumber);
        // }
        let reqData = {
          "proposalNum": this.leadId,
          "partnerId": this.partnerId,  
          "agentCode": this.agentCode,        
          "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId.toString(),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue(), // index of the form from FormSequence
          "leadNumber": this.leadId, // will be generated in the save of the first form (leads page) and will be sent as response of this API in the incoming requests, u need to pass that response's lead Id here
          "quoteNumber": this.formData.quoteId ? this.formData.quoteId : "",// will be generate in getQuoteForSingleProducts and top selling products
          "portalName": "RUG",
      }
        console.log(reqData);
        this.yatraService.Insertorupdateformdata(reqData).subscribe({
          next: (res: any) => {
            // this.toast.success({ detail: "Success", summary: "Form Data Saved Successfully.", duration: 3000 });
            console.log(res);
            this.leadnumber = res.data;
            console.log(this.d2cDetails)
            if (res.isSuccess == true && res.statusCode == 200) {
              this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
              if(this.productId == 31){
                if(this.getFormIndexValue() == 3){
                  let nomineeRelationCode = this.filterRelationByName(this.d2cDetails.nomineeRelation);
                  this.selectedOccupationCode = this.occupationList.filter(
                    (item: any) => item.occupationName === this.d2cDetails.occupation
                  );
                  const payloadObject = {
                    proposerDetails: {
                      leadId: this.d2cDetails.leadId,
                      occupationName:null,
                      // customerId: this.d2cDetails.customerId,
                      salutation: this.d2cDetails.proposerGender == 'M' ? "MR" : this.d2cDetails.proposerGender == 'F' ? "MS" : "Mr",
                      customerName: this.d2cDetails.customerName,
                      // customerLastName: this.d2cDetails.customerLastName,
                      address:this.d2cDetails.proposerAddress,
                      city:this.d2cDetails.proposerCity,
                      pinCode: this.d2cDetails.proposerPincode,
                      state: this.d2cDetails.proposerState || "GUJRAT",
                      dob: this.d2cDetails.proposerDob,
                      gender: this.d2cDetails.proposerGender,
                      mobileNumber: this.d2cDetails.proposerMobileNumber,
                      nationality: this.d2cDetails.proposerNationality,
                      emailAddress: this.d2cDetails.proposerEmailAddress || "LHMUE.SHAH@ARVIND.IN",
                      maritalStatus: this.d2cDetails.proposerMaritalStatus,
                      occupationType: null,
                      occupation: this.d2cDetails.occupation,
                      panNumber: this.d2cDetails.proposerPanNumber,
                      sumInsured: this.d2cDetails.sumInsured,
                      premium: this.d2cDetails.totalPremium.toString(),
                      isMinor: this.d2cDetails.IsMinor,
                      relationShipWithChild: null,
                      relationShipWithChildCode: null,
                      isSubmitted: null,
                      isPayment: null,              
                      leadStatus: this.d2cDetails.leadStatus,
                      quotationNumber: null,
                      productCode: this.productId == '7' ?  "D01" : this.productId == '8' ? "D02" : "D03",
                      productName: null,
                      productPlanCode: this.d2cDetails.productPlanCode.toString(),
                      productPlan: "GHI,GPA",                  
                      groupCode: this.d2cDetails.groupCode,
                      combiId: this.d2cDetails.combiId,
                      combiName: null,
                      familyConstruct: this.d2cDetails.familyConstruct,
                      familyConstructId: Number(this.d2cDetails.familyConstructId),
                      ghiPremium: this.d2cDetails.ghiPremium ? this.d2cDetails.ghiPremium : null,
                      gpaPremium: this.d2cDetails.gpaPremium ? this.d2cDetails.gpaPremium : null,
                      gciPremium: this.d2cDetails.gciPremium ? this.d2cDetails.gciPremium : null,
                      deductibleAmount: this.d2cDetails.gciPremiumFiveLakhDeductable ? this.d2cDetails.gciPremiumFiveLakhDeductable : this.d2cDetails.gciPremiumTenLakhDeductable ? this.d2cDetails.gciPremiumTenLakhDeductable : null,
                      ghiQuoteNumber: null,
                      gfbQuoteNumber: null,
                      accountNumber: this.d2cDetails.accountNumber,
                      ifsc: this.d2cDetails.ifscCode,
                      accType: this.d2cDetails.accType,
                      bankName: this.d2cDetails.bankName,
                      bankAccountType: this.d2cDetails.accountType,
                      micrCode: this.d2cDetails.micrCode,
                      branchName: this.d2cDetails.branchName,
                      annualIncome:null            
                      
                    },
                    insuredDetails: [{
                      leadId:  this.d2cDetails.leadId,
                      name: this.d2cDetails.childName.split(" ").length > 1 ? this.d2cDetails.childName : this.d2cDetails.childName + ".",
                      dob: this.d2cDetails.childDob,
                      relationName:  this.d2cDetails.childRelation,
                      relationCode: this.d2cDetails.childRelation == "son" ? "R003" : "R004" || "",
                      gender: this.d2cDetails.childgender,
                      height: null,
                      weight: null,
                    }],
                    nomineeDetails: {
                      leadId: this.d2cDetails.leadId,
                      nomineeName: this.d2cDetails.firstName,
                      nomineeRelation: this.d2cDetails.nomineeRelation,
                      nomineeRelationCode: nomineeRelationCode,
                      nomineeDOB: this.d2cDetails.nomineeDob,
                      nomineeGender: this.d2cDetails.nomineeGender,
                      nomineeMobileNumber: this.d2cDetails.mobileNumber,
                      nomineeAddress: this.d2cDetails.nomineeAddress || "kanpur",// Assuming not provided
                      appointeeDOB: null,
                      appointeeName: this.d2cDetails.appointeeName || null,
                      appointeeContactNo: this.d2cDetails.appointeeMobileNumber || null,
                      relationshipOfAppointeeWithNominee: this.d2cDetails.relationWithNominee || "",
                      defaultShare: this.d2cDetails.nomineeDefaultShare,
                    }
                  };
                  console.log(payloadObject);
                  let testObj = {"leadId":"3000886759975308","requestData":"{\"proposerDetails\":{\"leadId\":\"3000886759975308\",\"salutation\":\"MR\",\"customerName\":\"Dfyjemo Person\",\"address\":\"11-BAVA F INSTAL RN IRAJALAWRAP K~ ~RVANPGNAURA\",\"city\":\"AHMEDABAD\",\"pinCode\":\"302019\",\"state\":\"GUJARAT\",\"dob\":\"20-02-1974\",\"gender\":\"M\",\"mobileNumber\":\"9992298551\",\"nationality\":\"IN\",\"emailAddress\":\"LHMUE.SHAH@ARVIND.IN\",\"maritalStatus\":\"Y\",\"occupationType\":\"BUSINESS -HNI\",\"panNumber\":\"ALXPS0000L\",\"sumInsured\":\"5000000\",\"premium\":\"16899\",\"isMinor\":false,\"relationShipWithChild\":null,\"relationShipWithChildCode\":null,\"isSubmitted\":null,\"isPayment\":null,\"leadStatus\":\"INITIAL\",\"quotationNumber\":null,\"productCode\":\"D02\",\"productName\":null,\"occupationName\":null,\"productPlanCode\":\"11\",\"productPlan\":\"GHI\",\"groupCode\":\"GRP001\",\"combiId\":\"1\",\"combiName\":\"GHI\",\"familyConstruct\":\"1A\",\"familyConstructId\":1,\"ghiPremium\":\"16899\",\"gpaPremium\":null,\"gciPremium\":null,\"deductibleAmount\":null,\"ghiQuoteNumber\":null,\"gfbQuoteNumber\":null,\"accountNumber\":\"003010100000264\",\"ifsc\":\"hughvgy\",\"accType\":\"secondary\",\"bankName\":\"\",\"bankAccountType\":\"Current\",\"micrCode\":\"\",\"branchName\":\"\"},\"insuredDetails\":[{\"leadId\":\"3000886759975308\",\"name\":\"Dfyjemo Person\",\"dob\":\"20-02-1974\",\"relationName\":null,\"relationCode\":\"R001\",\"gender\":\"M\",\"height\":\"165.10\",\"weight\":\"55\"}],\"nomineeDetails\":{\"leadId\":\"3000886759975308\",\"nomineeName\":\"ughj ugugig\",\"nomineeRelation\":\"spouse\",\"nomineeRelationCode\":\"R002\",\"nomineeDOB\":\"11-11-1999\",\"nomineeGender\":\"Male\",\"nomineeMobileNumber\":\"9887787657\",\"nomineeAddress\":\"jhkhb\",\"appointeeName\":\"\",\"appointeeDOB\":\"\",\"appointeeContactNo\":\"\",\"relationshipOfAppointeeWithNominee\":\"\",\"defaultShare\":\"100\"}}","currentPage":4,"isFinalSubmit":true,"leadStatus":"SUBMITTED"}
                  let commonDraftRequest = {
                    leadId: this.leadId,
                    requestData: JSON.stringify(payloadObject),
                    currentPage: this.getFormIndexValue(),
                    isFinalSubmit: true,
                    leadStatus: "SUBMITTED"
                  }
                  this.yatraService.saveD2CCommonDraft(commonDraftRequest).subscribe({
                    next: (res: any) => {
                      console.log(JSON.parse(res.data));
                      res = JSON.parse(res.data)
                      if (res.isSuccess == true && res.statusCode == 200) {
                        this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
                        let justpayPayload = { 
                          "agentcode": this.agentCode,
                           "proposalNumber": this.leadId,
                           "paymentMethod": this.dynamicFormGroup.get('paymentOption')?.value == "eMandate" ? "emandate_payment" : "autoDebit",
                           "source": "RUG",
                           "policyType": "New Business",
                           "policyNumber": "", 
                           "quoteNumber": "",
                           "OrderId": "",
                           "Amount": Math.round(this.d2cDetails.totalPremium),
                           "FirstName": this.d2cDetails.customerName.split(' ')?.[0],
                           "MiddleName": "",
                           "LastName": this.d2cDetails.customerName.split(' ')?.[1] || '.',
                           "Phone": this.d2cDetails.proposerMobileNumber,
                           "Email": this.d2cDetails.proposerEmailAddress,
                           "DOB": this.d2cDetails.proposerDob,                   
                           "appName":"D2C"
                                  
                          }
                        this.d2cJustPayRedirection(justpayPayload)
                        // if (this.getFormIndexValue() < this.formSequence.length - 1) {
                        //   this.incrementIndex();
                        //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                          
                        // }
              
                      }
              
                    },
                    error: (err) => {
                      console.error(err);
                    }
                  });
                }else{
                  if (this.getFormIndexValue() < this.formSequence.length - 1) {
                    this.incrementIndex();
                    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                  }
                }
              }else{

                if(this.getFormIndexValue() == 3){
                  console.log(this.d2cDetails);
                  let nomineeRelationCode = this.filterRelationByName(this.d2cDetails.nomineeRelation);
                  this.selectedOccupationCode = this.occupationList.filter(
                    (item: any) => item.occupationName === this.d2cDetails.occupation
                  );
                  const payloadObject = {
                    proposerDetails: {
                      leadId: this.d2cDetails.leadId,
                      // customerId: this.d2cDetails.customerId,
                      salutation: this.d2cDetails.proposerGender == 'M' ? "MR" : this.d2cDetails.proposerGender == 'F' ? "MS" : "Mr",
                      customerName: this.d2cDetails.insuredMemberDetails[0].name,
                      // customerLastName: this.d2cDetails.customerLastName,
                      address:this.d2cDetails.proposerAddress,
                      city:this.d2cDetails.proposerCity,
                      pinCode: this.d2cDetails.proposerPincode,
                      state: this.d2cDetails.proposerState || "GUJRAT",
                      dob: this.d2cDetails.proposerDob,
                      gender: this.d2cDetails.proposerGender,
                      mobileNumber: this.d2cDetails.proposerMobileNumber,
                      nationality: this.d2cDetails.proposerNationality,
                      emailAddress: this.d2cDetails.proposerEmailAddress || "LHMUE.SHAH@ARVIND.IN",
                      maritalStatus: this.d2cDetails.proposerMaritalStatus,
                      occupationType: this.selectedOccupationCode[0]?.occupationCode,
                      occupationName: this.d2cDetails.occupation,
                      annualIncome: this.d2cDetails.annualIncome ,
                      panNumber: this.d2cDetails.proposerPanNumber,
                      sumInsured: this.d2cDetails.sumInsured,
                      premium: this.d2cDetails.totalPremium.toString(),
                      isMinor: this.d2cDetails.IsMinor,
                      relationShipWithChild: null,
                      relationShipWithChildCode: null,
                      isSubmitted: null,
                      isPayment: null,              
                      leadStatus: this.d2cDetails.leadStatus,
                      quotationNumber: null,
                      productCode: this.productId == '7' ?  "D01" : this.productId == '8' ? "D02" :  this.productId == '30'  ? "D04" : "",
                      productName: null,
                      productPlanCode: this.d2cDetails.productPlanCode.toString(),
                      productPlan: this.d2cDetails.productPlanName,                  
                      groupCode: this.d2cDetails.groupCode,
                      combiId: this.d2cDetails.combiId,
                      combiName: this.d2cDetails.planAvailable,
                      familyConstruct: this.d2cDetails.familyConstruct,
                      familyConstructId: Number(this.d2cDetails.familyConstructId),
                      ghiPremium: this.d2cDetails.ghiPremium ? this.d2cDetails.ghiPremium : null,
                      gpaPremium: this.d2cDetails.gpaPremium ? this.d2cDetails.gpaPremium : null,
                      gciPremium: this.d2cDetails.gciPremium ? this.d2cDetails.gciPremium : null,
                      deductibleAmount: this.d2cDetails.gciPremiumFiveLakhDeductable ? this.d2cDetails.gciPremiumFiveLakhDeductable : this.d2cDetails.gciPremiumTenLakhDeductable ? this.d2cDetails.gciPremiumTenLakhDeductable : null,
                      ghiQuoteNumber: null,
                      gfbQuoteNumber: null,
                      accountNumber: this.d2cDetails.accountNumber,
                      ifsc: this.d2cDetails.ifscCode,
                      accType: this.d2cDetails.accountType,
                      bankName: this.d2cDetails.bankName,
                      bankAccountType: this.d2cDetails.accountType,
                      micrCode: this.d2cDetails.micrCode,
                      branchName: this.d2cDetails.branchName,
                      
                      // address: this.d2cDetails.proposerAddress,
                      // city: this.d2cDetails.proposerCity,
                
                      // isNRI: this.d2cDetails.proposerIsNri,
                      // tenure: 1,
                      // sumInsured: this.d2cDetails.sumInsured,
                      // premium: this.d2cDetails.totalPremium,
                      // annualIncome: "",
                      // axisProductCode: this.d2cDetails.axisProductCode,
                      // axisProductName: this.d2cDetails.axisProductName,
                      
                      // isAxisBankAccount: this.d2cDetails.isAxisBankAccount,
                      // accountNumber: this.d2cDetails.accountNumber,
                      // ifscCode: this.d2cDetails.ifscCode,
                      // branchName: this.d2cDetails.branchName,
                      // branchSolId: this.d2cDetails.branchSolId,
                      // amount: "",
                      // isGoGreen: true,
                      // bankName: this.d2cDetails.bankName,
                      // debitType: this.d2cDetails.debitType || "",
                      // endDate: this.d2cDetails.endDate || "",
                      // frequencyOfPayment: this.d2cDetails.frequencyOfPayment || "",
                      // maskedAccountNo: "",
                      // paymentMode: this.d2cDetails.paymentMode == "no" ? "paymentgateway" : "easyPay",
                      // startDate: this.d2cDetails.startDate || "",
                      // idType: this.d2cDetails.idType,
                      // idValue: this.d2cDetails.idValue,
                      // occupationType: "",
                      // occupation: "",
                      // leadStatus: null,
                      // productCode: this.d2cDetails.productCode,
                      // productName: this.d2cDetails.productName,
                      // isSubmitted: false,
                      // isPayment: false,
                      // productPlanName: "GHI,GP",
                      // productPlanCode: "22",
                      
                      // familyConstructId: "1",
                      // ghiPremium: "15665",
                      // gpaPremium: null,
                      // gciPremium: null,
                      // deductibleAmount: null,
                      // gpPremium: "1332",
                      // micrCode: this.d2cDetails.micrCode,
                      // accType: this.d2cDetails.accType == "primary" ? "Primary" : "Primary",
                      // bankAccountType: this.d2cDetails.bankAccountType || "saving"
                    },
                    insuredDetails: this.d2cDetails.insuredMemberDetails.map((member: any) => ({
                      leadId: this.d2cDetails.leadId,
                      name: member.name ? member.name : member.firstName + (member.middleName ? ' ' + member.middleName : '') + ' ' + member.lastName,
                      dob: member.dob,
                      relationName: member.relation,
                      relationCode: (member.relation != "Son2" && member.relation != "Daughter2") ? JSON.parse(member.relationshipType)?.id : member.relation == "Son2" ? "R003" : "R004" || "",
                      gender: member.gender,                
                      height: this.convertToCentimeters(member.height, member.heightInches).toFixed(2).toString() || 0,
                      weight: member.weight
                    })),
                    nomineeDetails: {
                      leadId: this.d2cDetails.leadId,
                      nomineeName: this.d2cDetails.firstName,
                      nomineeRelation: this.d2cDetails.nomineeRelation,
                      nomineeRelationCode: nomineeRelationCode[0].relationCode,
                      nomineeDOB: this.d2cDetails.nomineeDob,
                      nomineeGender: this.d2cDetails.nomineeGender || null,
                      nomineeMobileNumber: this.d2cDetails.mobileNumber,
                      nomineeAddress: this.d2cDetails.nomineeAddress || "kanpur",// Assuming not provided
                      appointeeDOB: null,
                      appointeeName: this.d2cDetails.appointeeName || null,
                      appointeeContactNo: this.d2cDetails.appointeeMobileNumber || null,
                      relationshipOfAppointeeWithNominee: this.d2cDetails.relationWithNominee || "",
                      defaultShare: this.d2cDetails.nomineeDefaultShare,
                    }
                  };
                  console.log(payloadObject);
                  let testObj = {"leadId":"3000886759975308","requestData":"{\"proposerDetails\":{\"leadId\":\"3000886759975308\",\"salutation\":\"MR\",\"customerName\":\"Dfyjemo Person\",\"address\":\"11-BAVA F INSTAL RN IRAJALAWRAP K~ ~RVANPGNAURA\",\"city\":\"AHMEDABAD\",\"pinCode\":\"302019\",\"state\":\"GUJARAT\",\"dob\":\"20-02-1974\",\"gender\":\"M\",\"mobileNumber\":\"9992298551\",\"nationality\":\"IN\",\"emailAddress\":\"LHMUE.SHAH@ARVIND.IN\",\"maritalStatus\":\"Y\",\"occupationType\":\"BUSINESS -HNI\",\"panNumber\":\"ALXPS0000L\",\"sumInsured\":\"5000000\",\"premium\":\"16899\",\"isMinor\":false,\"relationShipWithChild\":null,\"relationShipWithChildCode\":null,\"isSubmitted\":null,\"isPayment\":null,\"leadStatus\":\"INITIAL\",\"quotationNumber\":null,\"productCode\":\"D02\",\"productName\":null,\"occupationName\":null,\"productPlanCode\":\"11\",\"productPlan\":\"GHI\",\"groupCode\":\"GRP001\",\"combiId\":\"1\",\"combiName\":\"GHI\",\"familyConstruct\":\"1A\",\"familyConstructId\":1,\"ghiPremium\":\"16899\",\"gpaPremium\":null,\"gciPremium\":null,\"deductibleAmount\":null,\"ghiQuoteNumber\":null,\"gfbQuoteNumber\":null,\"accountNumber\":\"003010100000264\",\"ifsc\":\"hughvgy\",\"accType\":\"secondary\",\"bankName\":\"\",\"bankAccountType\":\"Current\",\"micrCode\":\"\",\"branchName\":\"\"},\"insuredDetails\":[{\"leadId\":\"3000886759975308\",\"name\":\"Dfyjemo Person\",\"dob\":\"20-02-1974\",\"relationName\":null,\"relationCode\":\"R001\",\"gender\":\"M\",\"height\":\"165.10\",\"weight\":\"55\"}],\"nomineeDetails\":{\"leadId\":\"3000886759975308\",\"nomineeName\":\"ughj ugugig\",\"nomineeRelation\":\"spouse\",\"nomineeRelationCode\":\"R002\",\"nomineeDOB\":\"11-11-1999\",\"nomineeGender\":\"Male\",\"nomineeMobileNumber\":\"9887787657\",\"nomineeAddress\":\"jhkhb\",\"appointeeName\":\"\",\"appointeeDOB\":\"\",\"appointeeContactNo\":\"\",\"relationshipOfAppointeeWithNominee\":\"\",\"defaultShare\":\"100\"}}","currentPage":4,"isFinalSubmit":true,"leadStatus":"SUBMITTED"}
                  let commonDraftRequest = {
                    leadId: this.leadId,
                    requestData: JSON.stringify(payloadObject),
                    currentPage: this.getFormIndexValue(),
                    isFinalSubmit: true,
                    leadStatus: "SUBMITTED"
                  }
                  this.yatraService.saveD2CCommonDraft(commonDraftRequest).subscribe({
                    next: (res: any) => {
                      console.log(JSON.parse(res.data));
                      res = JSON.parse(res.data)
                      if (res.isSuccess == true && res.statusCode == 200) {
                        this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
                        let justpayPayload = { 
                          "agentcode": this.agentCode,
                           "proposalNumber": this.leadId,
                           "paymentMethod": this.dynamicFormGroup.get('paymentOption')?.value == "eMandate" ? "emandate_payment" : "autoDebit",
                           "source": "RUG",
                           "policyType": "New Business",
                           "policyNumber": "", 
                           "quoteNumber": "",
                           "OrderId": "",
                           "Amount": Math.round(this.d2cDetails.totalPremium),
                           "FirstName": this.d2cDetails.insuredMemberDetails[0].name.split(' ')?.[0],
                           "MiddleName": "",
                           "LastName": this.d2cDetails.insuredMemberDetails[0].name.split(' ')?.[1] || '.',
                           "Phone": this.d2cDetails.proposerMobileNumber,
                           "Email": this.d2cDetails.proposerEmailAddress,
                           "DOB": this.d2cDetails.proposerDob,                       
                           "appName":"D2C"
                                  
                          }
                        this.d2cJustPayRedirection(justpayPayload)
                        // if (this.getFormIndexValue() < this.formSequence.length - 1) {
                        //   this.incrementIndex();
                        //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                          
                        // }
              
                      }
              
                    },
                    error: (err) => {
                      console.error(err);
                    }
                  });
                }else{
                  if (this.getFormIndexValue() < this.formSequence.length - 1) {
                    this.incrementIndex();
                    this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                  }
                }
              }
            }
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    }
    else {
      console.log('Form is invalid', this.dynamicFormGroup);
      let firstInvalidTabIndex: number | null = null;
      if (this.dynamicFormGroup.get('insuredMemberDetails')) {
        this.form.formSections.forEach(section => {
          section.formControls.forEach(control => {
            if (control.dynamicControls) {
              control.dynamicControls.forEach((tabControls: any, tabIndex: number) => {
                const formGroup = (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray).controls.at(tabIndex); // Assuming tabIndex maps to form group
                console.log(formGroup);
                if (formGroup && formGroup.invalid && firstInvalidTabIndex === null) {
                  firstInvalidTabIndex = tabIndex; // Capture the first invalid tab
                }
              })
            }
          })
        })
      }
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach(nestedField => {
                const nestedControl = arrayControl.get(nestedField);
                nestedControl?.markAsTouched({ onlySelf: true });
              });
            } else {
              arrayControl?.markAsTouched({ onlySelf: true });
            }
          });
        }
        else if (control instanceof FormGroup) {
          control?.markAsDirty({ onlySelf: true });
        }
        else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
      if (this.dynamicFormGroup.invalid) {
        this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 });
        if (firstInvalidTabIndex !== null) {
          // Navigate to the first invalid tab
          this.activeMemberTabIndex = firstInvalidTabIndex;
          // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
        }
      }
      else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
        this.toast.warning({ detail: "Warning", summary: "Indian residency is required", duration: 3000 })
    }
    // if (this.getFormIndexValue() < this.formSequence.length - 1) {
    //   this.incrementIndex();
    //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
      
    // }
  }

  d2cJustPayRedirection(req:any){
    let payload =     {    "agentcode": "4620973",    "proposalNumber": "UPP102810271861",    "paymentMethod": "autoDebit",    "source": "RUG",    "policyType": "New Business",    "policyNumber": "",    "quoteNumber": "",    "OrderId": "",    "Amount": 500000,    "FirstName": "Demojs",    "MiddleName": "",    "LastName": "Person",    "Phone": "9992232551",    "Email": "LHME.SHAH@ARVIND.IN",    "DOB": "10/07/1997"}
    this.yatraService.d2cJustpayRedirection(req).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
          this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
          window.location.href = res.data.paymentURL
          // if (this.getFormIndexValue() < this.formSequence.length - 1) {
          //   this.incrementIndex();
          //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
            
          // }

        }else{
          this.toast.warning({ detail: "Warning", summary: res.message, duration: 3000 });
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onBbSubmit() {
    this.changesMade = false;
    console.log(this.bbdetails);
    console.log(this.dynamicFormGroup.value);
    console.log(this.dynamicFormGroup.value.insuredMembers);
    console.log(this.formSequence);
    console.log(this.formIndexValue);
    console.log(this.getFormIndexValue());
    console.log(this.dynamicFormGroup.get('decl2')?.value);
    // console.log(this.dynamicFormGroup.get('decl3')?.value);
    if(this.getFormIndexValue() == 4 && this.isDeclarationSelected.value != "no"){
      this.toast.warning({ detail: "Warning", summary: "Basis the information provided this proposal cannot be processed.", duration: 3000 });
      return;
    }
    console.log(this.dynamicFormGroup.valid);
    if(this.dynamicFormGroup.valid){
      if(this.getFormIndexValue() == 0 || this.getFormIndexValue() == 1 || this.getFormIndexValue() == 2 || this.getFormIndexValue() == 3 || this.getFormIndexValue() == 4){
        if(this.getFormIndexValue() == 3){
          this.dynamicFormGroup.value.accountNumber = this.bbdetails.accountNumber;
          // this.dynamicFormGroup.get('accountNumber')?.setValue(this.bbdetails.accountNumber);
        }
        let reqData = {
          "proposalNum": (this.bbdetails.leadId != null || this.bbdetails.leadId != "") ? this.bbdetails.leadId : this.dynamicFormGroup.value.leadNumber,
          "partnerId": this.partnerId,
          "agentCode": this.agentCode,
          "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId.toString(),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue(), // index of the form from FormSequence
          "leadNumber": (this.bbdetails.leadId != null || this.bbdetails.leadId != "") ? this.bbdetails.leadId : this.dynamicFormGroup.value.leadNumber, // will be generated in the save of the first form (leads page) and will be sent as response of this API in the incoming requests, u need to pass that response's lead Id here
          "quoteNumber": this.formData.quoteId ? this.formData.quoteId : "",// will be generate in getQuoteForSingleProducts and top selling products,
          "portalName": "RUG"
      }
        console.log(reqData);
        this.yatraService.Insertorupdateformdata(reqData).subscribe({
          next: (res: any) => {
            console.log(res);
            this.leadnumber = res.data;
            if (res.isSuccess == true && res.statusCode == 200) {
              let nomineeRelationCode = this.filterRelationByName(this.bbdetails.relationWithProposer);
              this.selectedOccupationCode = this.occupationList.filter(
                (item: any) => item.occupationName === this.bbdetails.occupation
              );
              
              this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
              if(this.getFormIndexValue() == 4){
                const payloadObject = {
                  proposerDetails: {
                    leadId: this.bbdetails.leadId,
                    customerId: this.bbdetails.customerId,
                    salutation: "Mr",
                    customerFirstName: this.bbdetails.customerFirstName,
                    customerLastName: this.bbdetails.customerLastName,
                    gender: this.bbdetails.proposerGender,
                    dob: this.bbdetails.proposerDob,
                    mobileNumber: this.bbdetails.proposerMobileNumber,
                    panNumber: this.bbdetails.proposerPanNumber,
                    emailAddress: this.bbdetails.proposerEmailAddress,
                    address: this.bbdetails.proposerAddress,
                    city: this.bbdetails.proposerCity,
                    state: this.bbdetails.proposerState,
                    pinCode: this.bbdetails.proposerPincode,
                    isNRI: this.bbdetails.proposerIsNri,
                    tenure: 1,
                    sumInsured: this.bbdetails.sumInsured,
                    premium: this.bbdetails.totalPremium,
                    annualIncome: this.bbdetails.annualIncome ,
                    axisProductCode: this.bbdetails.axisProductCode,
                    axisProductName: this.bbdetails.axisProductName,
                    familyConstruct: this.bbdetails.familyConstruct,
                    isAxisBankAccount: this.bbdetails.isAxisBankAccount,
                    accountNumber: this.bbdetails.accountNumber,
                    ifscCode: this.bbdetails.ifscCode,
                    branchName: this.bbdetails.branchName,
                    branchSolId: this.bbdetails.branchSolId,
                    amount: this.bbdetails.totalPremium,
                    isGoGreen: true,
                    bankName: this.bbdetails.bankName,
                    debitType: this.bbdetails.debitType || "",
                    endDate: this.bbdetails.endDate || "",
                    frequencyOfPayment: this.bbdetails.frequencyOfPayment || "",
                    maskedAccountNo: "",
                    paymentMode: this.bbdetails.paymentMode == "no" ? "paymentgateway" : "easyPay",
                    startDate: this.bbdetails.startDate || "",
                    idType: this.bbdetails.idType,
                    idValue: this.bbdetails.idValue,
                    occupationType: this.selectedOccupationCode[0]?.occupationCode,
                    occupation: this.bbdetails.occupation,
                    leadStatus: null,
                    productCode: this.bbdetails.productCode,
                    productName: this.bbdetails.productName,
                    isSubmitted: true,
                    isPayment: false,
                    groupCode: this.bbdetails.groupCode,
                    productPlanName: this.bbdetails.productPlanName,
                    productPlanCode: this.bbdetails.productPlanCode.toString(),
                    combiId: this.bbdetails.combiId,
                    combiName: null,
                    familyConstructId: this.bbdetails.familyConstructId,
                    ghiPremium: this.bbdetails.ghiPremium,
                    gpaPremium: this.bbdetails.gpaPremium,
                    gciPremium: this.bbdetails.gciPremium,
                    deductibleAmount: this.bbdetails.deductibleAmount,
                    gpPremium: this.bbdetails.gpPremium,
                    micrCode: this.bbdetails.micrCode,
                    accType: this.bbdetails.accType == "primary" ? "Primary" : "Primary",
                    bankAccountType: this.bbdetails.bankAccountType || "saving"
                  },
                  insuredDetails: this.bbdetails.insuredMemberDetails.map((member: any) => ({
                    leadId: this.bbdetails.leadId,
                    salutation: "Mr",
                    firstName: member.firstName,
                    lastName: member.lastName,
                    gender: member.gender,
                    dob: member.dob,
                    age: member.age,
                    ageType: "years",
                    relationWithProposer: JSON.parse(member.relationshipType)?.name || member.relation,
                    relationCode: (member.relation != "Son2" && member.relation != "Daughter2") ? JSON.parse(member.relationshipType)?.id : member.relation == "Son2" ? "R003" : "R004" || "",
                    tenure: null,
                    height: this.convertToCentimeters(member.height, member.heightInches).toFixed(2).toString() || 0,
                    heightInch: member.heightInches || null,
                    weight: member.weight
                  })),
                  nomineeDetails: {
                    leadId: this.bbdetails.leadId,
                    NomineeSalutation: this.bbdetails.nomineeGender == "M" ? "Mr" : this.bbdetails.nomineeGender == "F" ? "Ms" : null, // Assuming not provided
                    nomineeRelation: this.bbdetails.relationWithProposer || "son",
                    NomineeRelationCode: nomineeRelationCode[0].relationCode,
                    nomineeFirstname: this.bbdetails.nomineeFirstName,
                    nomineeLastname: this.bbdetails.nomineeLastName,
                    nomineeContactNumber: this.bbdetails.nomineeMobileNumber,
                    nomineeAddress: this.bbdetails.nomineeAddress || null,
                    appointeeDOB: null,
                    appointeeName: this.bbdetails.appointeeName || null,
                    appointeeContactNo: this.bbdetails.appointeeMobileNumber || null,
                    relationshipOfAppointeeWithNominee: this.bbdetails.relationWithNominee || "",
                    dateOfBirth: this.bbdetails.nomineeDob,
                    defaultShare: this.bbdetails.nomineeDefaultShare,
                    nomineeGender: this.bbdetails.nomineeGender || null
                  }
                };
                console.log(payloadObject);
                let testObj = {
                  "leadId": "155217345435",
                  "requestData": "{\"proposerDetails\":{\"leadId\":\"155217345435\",\"customerId\":\"260618000044\",\"salutation\":\"Mr\",\"customerFirstName\":\"ARNASDA\",\"customerLastName\":\"BANKING\",\"gender\":\"M\",\"dob\":\"1988-12-19\",\"mobileNumber\":\"9823901274\",\"panNumber\":\"DDDDD6456A\",\"emailAddress\":\"atul.shirwadkar1@adityabirlacapital.com\",\"address\":\"Om hrad ntalatiof, holOmshre, talathioficeeachol, OmshreeSada9talathi\",\"city\":\"MUMBAI\",\"state\":\"MAHARASHTRA\",\"pinCode\":\"45102\",\"isNRI\":\"N\",\"tenure\":1,\"sumInsured\":\"500000\",\"premium\":\"16997.00\",\"annualIncome\":\"\",\"axisProductCode\":\"2171\",\"axisProductName\":\"Freedom Plus Plan\",\"familyConstruct\":\"1A\",\"isAxisBankAccount\":true,\"accountNumber\":\"9170100000000329\",\"ifscCode\":\"UTIB0000016\",\"branchName\":\"Banglore\",\"branchSolId\":\"051\",\"amount\":\"\",\"isGoGreen\":true,\"bankName\":\"Axis Bank\",\"debitType\":\"\",\"endDate\":\"\",\"frequencyOfPayment\":\"\",\"maskedAccountNo\":\"\",\"paymentMode\":\"paymentgateway\",\"startDate\":\"\",\"idType\":\"Aadhar Card\",\"idValue\":\"5478-2589-3688\",\"occupationType\":\"\",\"occupation\":\"\",\"leadStatus\":null,\"productCode\":\"R03\",\"productName\":\"Freedom Plus Plan\",\"isSubmitted\":false,\"isPayment\":false,\"groupCode\":\"GRP001\",\"productPlanName\":\"GHI,GP\",\"productPlanCode\":\"22\",\"combiId\":\"10\",\"combiName\":null,\"familyConstructId\":\"1\",\"ghiPremium\":\"15665\",\"gpaPremium\":null,\"gciPremium\":null,\"deductibleAmount\":null,\"gpPremium\":\"1332\",\"micrCode\":\"12345\",\"accType\":\"Primary\",\"bankAccountType\":\"saving\"},\"insuredDetails\":[{\"leadId\":\"155217345435\",\"salutation\":\"Mr\",\"firstName\":\"ARNASDA\",\"lastName\":\"BANKING\",\"gender\":\"M\",\"dob\":\"1988-12-19\",\"age\":\"35\",\"ageType\":\"years\",\"relationWithProposer\":\"Self\",\"relationCode\":\"R001\",\"tenure\":null,\"height\":\"5\",\"heightInch\":\"5\",\"weight\":\"66\"}],\"nomineeDetails\":{\"leadId\":\"155217345435\",\"NomineeSalutation\":\"Ms\",\"nomineeRelation\":\"spouse\",\"NomineeRelationCode\":\"R003\",\"nomineeFirstname\":\"ajsdjsag\",\"nomineeLastname\":\"aksndasd\",\"nomineeContactNumber\":\"9999999999\",\"nomineeAddress\":null,\"appointeeDOB\":null,\"appointeeName\":null,\"appointeeContactNo\":null,\"relationshipOfAppointeeWithNominee\":\"\",\"dateOfBirth\":\"2000-12-12\",\"defaultShare\":\"100\",\"nomineeGender\":\"F\"}}",
                  "isFinalSubmit": true,
                  "leadStatus": "SUBMITTED"
              } 
                let commonDraftRequest = {
                  leadId: this.bbdetails.leadId,
                  requestData: JSON.stringify(payloadObject),
                  isFinalSubmit: true,
                  leadStatus: "SUBMITTED"
                }
                console.log(commonDraftRequest);
                this.yatraService.saveBBCommonDraft(commonDraftRequest).subscribe({
                  next: (res: any) => {
                    console.log(res);
                    let responseData = JSON.parse(res.data);
                    if (responseData.isSuccess == true && responseData.statusCode == 200) {
                      this.toast.success({ detail: "Success", summary: responseData.message, duration: 3000 });
                      if (this.getFormIndexValue() < this.formSequence.length - 1) {
                        this.incrementIndex();
                        this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                      }
                    }else{
                      this.toast.warning({ detail: "Warning", summary: responseData.message, duration: 3000 });
  
                    }
                  },
                  error: (err) => {
                    console.error(err);
                  }
                });
              }else{
                if (this.getFormIndexValue() < this.formSequence.length - 1) {
                  this.incrementIndex();
                  this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                }
              }
            }
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
      else{
        //https://usp.monocept.ai/api/v1/SaveBBCommonDraft
        let commonDraftRequest = {
          leadId: this.yatraService.policyDetails.proposerDetails.leadId,
          requestData: JSON.stringify({      
            proposerDetails: this.yatraService.policyDetails.proposerDetails,
            insuredDetails:this.yatraService.policyDetails.insuredDetails,
            nomineeDetails:this.yatraService.policyDetails.nomineeDetails
          }),
          isFinalSubmit: true,
          leadStatus: "SUBMITTED"
        }
        this.yatraService.saveBBCommonDraft(commonDraftRequest).subscribe({
          next: (res: any) => {
            console.log(res);
            if (res.isSuccess == true && res.statusCode == 200) {
              this.toast.success({ detail: "Success", summary: res.statusMessage, duration: 3000 });
              if (this.getFormIndexValue() < this.formSequence.length - 1) {
                this.incrementIndex();
                this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                
              }
    
            }
    
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    }
    else {
      console.log('Form is invalid', this.dynamicFormGroup);
      let firstInvalidTabIndex: number | null = null;
      if (this.dynamicFormGroup.get('insuredMemberDetails')) {
        this.form.formSections.forEach(section => {
          section.formControls.forEach(control => {
            if (control.dynamicControls) {
              control.dynamicControls.forEach((tabControls: any, tabIndex: number) => {
                const formGroup = (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray).controls.at(tabIndex); // Assuming tabIndex maps to form group
                console.log(formGroup);
                if (formGroup && formGroup.invalid && firstInvalidTabIndex === null) {
                  firstInvalidTabIndex = tabIndex; // Capture the first invalid tab
                }
              })
            }
          })
        })
      }
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach(nestedField => {
                const nestedControl = arrayControl.get(nestedField);
                nestedControl?.markAsTouched({ onlySelf: true });
              });
            } else {
              arrayControl?.markAsTouched({ onlySelf: true });
            }
          });
        }
        else if (control instanceof FormGroup) {
          control?.markAsDirty({ onlySelf: true });
        }
        else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
      if (this.dynamicFormGroup.invalid) {
        this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 });
        if (firstInvalidTabIndex !== null) {
          // Navigate to the first invalid tab
          this.activeMemberTabIndex = firstInvalidTabIndex;
          // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
        }
      }
      else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
        this.toast.warning({ detail: "Warning", summary: "Indian residency is required", duration: 3000 })
    }
  }

  onTsSubmit(){
    console.log(this.tsDetails);
    console.log(this.dynamicFormGroup.value);
    console.log(this.dynamicFormGroup.value.insuredMembers);
    console.log(this.formSequence);
    console.log(this.formIndexValue);
    console.log(this.getFormIndexValue());
    console.log(this.nomineeRelations);
    let filteredDispositionData: any;
    if(this.dynamicFormGroup.valid){
      if(this.getFormIndexValue() == 1 || this.getFormIndexValue() == 2 || this.getFormIndexValue() == 3 || this.getFormIndexValue() == 4 || this.getFormIndexValue() == 5 || this.getFormIndexValue() == 6){
        // if(this.getFormIndexValue() == 3){
        //   this.dynamicFormGroup.value.accountNumber = this.bbdetails.accountNumber;
        // }
        let reqData = {
          "proposalNum": (this.tsDetails.leadId != null || this.tsDetails.leadId != "") ? this.tsDetails.leadId : this.dynamicFormGroup.value.leadNumber,
          "partnerId": this.partnerId,
          "agentCode": this.agentCode,
          "formData": JSON.stringify(this.dynamicFormGroup.getRawValue()),
          "formName": this.formSequence[this.getFormIndexValue()].formName,
          "formConfig": JSON.stringify(this.formSequence),
          "productId": this.productId.toString(),
          "formId": this.formSequence[this.getFormIndexValue()].formId,
          "jsonForm": JSON.stringify(this.form),
          "formSequence": this.getFormIndexValue(), // index of the form from FormSequence
          "leadNumber": (this.tsDetails.leadId != null || this.tsDetails.leadId != "") ? this.tsDetails.leadId : this.dynamicFormGroup.value.leadNumber, // will be generated in the save of the first form (leads page) and will be sent as response of this API in the incoming requests, u need to pass that response's lead Id here
          "quoteNumber": this.formData.quoteId ? this.formData.quoteId : "",// will be generate in getQuoteForSingleProducts and top selling products,
          "portalName": "RUG"
      }
        console.log(reqData);
        this.yatraService.Insertorupdateformdata(reqData).subscribe({
          next: async (res: any) => {
            console.log(res);
            this.leadnumber = res.data;
            if (res.isSuccess == true && res.statusCode == 200) {
              this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
              console.log(this.tsDetails);
              console.log(this.getFormIndexValue());
              console.log(this.nomineeRelations);
              if(this.getFormIndexValue() == 6 || (this.getFormIndexValue() == 5 && this.agentCode == "467897")){
              let nomineeRelationCode = this.filterRelationByName(this.tsDetails.relationWithProposer);
              console.log(this.subDispositionList);
              console.log(this.dispositionList);
              if(this.dispositionList != undefined){
                filteredDispositionData = this.dispositionList.filter(
                  (item: any) => {
                    if(this.getFormIndexValue() == 5){
                      if(item.dispositionId == this.dynamicFormGroup.get('disposition')?.value){
                        console.log(item);
                        return item;
                      }
                      if(item.dispositionId == this.tsDetails.disposition){
                        console.log(item);
                        return item;
                      }
                    }else{
                      if(item.dispositionId == this.tsDetails.disposition){
                        console.log(item);
                        return item;
                      }
                    }
                  }
                );
              }else{
                this.rugService.getDispositions().subscribe({
                  next: (res: any) => {
                    console.log(res)
                    res = JSON.parse(res.data).data
                    console.log(res);
                    this.dispositionList = res.allDisposition;
                    filteredDispositionData = this.dispositionList.filter(
                      (item: any) => {
                        if(this.getFormIndexValue() == 5){
                          if(item.dispositionId == this.dynamicFormGroup.get('disposition')?.value){
                            console.log(item);
                            return item;
                          }
                          if(item.dispositionId == this.tsDetails.disposition){
                            console.log(item);
                            return item;
                          }
                        }else{
                          if(item.dispositionId == this.tsDetails.disposition){
                            console.log(item);
                            return item;
                          }
                        }
                      }
                    );            
                  },
                  error: (err) => {
                    console.error(err);
                  }
                });
              }

              console.log(this.dynamicFormGroup.get('subDisposition')?.value);
              const filteredSubDispositionData = this.subDispositionList.filter(
                (item: any) => {
                  if(this.getFormIndexValue() == 5){
                    if(item.subDispositionId == this.dynamicFormGroup.get('subDisposition')?.value){
                      console.log(item);
                      return item;
                    }
                    if(item.subDispositionId == this.tsDetails.subDisposition){
                      console.log(item);
                      return item;
                    }
                  }else{
                    if(item.subDispositionId == this.tsDetails.subDisposition){
                      console.log(item);
                      return item;
                    }
                  }
                }

              );
              console.log(this.dispositionList);
              console.log(this.tsDetails);
              console.log(this.occupationList);
              if(this.occupationList != undefined){
                this.selectedOccupationCode = this.occupationList.filter(
                  (item: any) => item.occupationName === this.tsDetails.occupation
                );
              }else{
                await this.rugService.getMasterData().subscribe({
                  next: (res: any) => {
                    console.log(res);
                    this.occupationList = JSON.parse(res?.data).data.occupation;
                    this.selectedOccupationCode = this.occupationList.filter(
                      (item: any) => item.occupationName === this.tsDetails.occupation
                    );
                  },
                  error: (err: any) => {
                  console.error(err)
                  }
                });
              }
              console.log(this.selectedOccupationCode);
                const payloadObject = {
                    agentDetails: {
                      axisProcess: this.tsDetails.axisProcess,
                      axisLOB: this.tsDetails.axisLob,
                      baseCallerId: this.tsDetails.baseCallerId,
                      baseCallerName: this.tsDetails.baseCallerName,
                      tL_ID: this.tsDetails.tlId,
                      tlName: this.tsDetails.tlName,
                      avCode: this.tsDetails.avCode,
                      avName:  this.tsDetails.avName,
                      axisLocation: this.tsDetails.axisLocation,
                      imdCode: this.tsDetails.imdCode,
                      leadId: this.tsDetails.leadId,
                      customerId: this.tsDetails.customerId,
                      axisVendor: this.tsDetails.axisVendor
                    },
                    proposerDetails: {
                      leadId: this.tsDetails.leadId,
                      customerId: this.tsDetails.customerId,
                      salutation: this.tsDetails.preFix,
                      customerFirstName: this.tsDetails.customerFirstName,
                      customerLastName: this.tsDetails.customerLastName,
                      gender:  this.tsDetails.proposerGender,
                      dob: this.tsDetails.proposerDob,
                      mobileNumber: this.tsDetails.proposerMobileNumber,
                      mobileNumber1: this.tsDetails.proposerMobileNumber,
                      email: this.tsDetails.proposerEmailAddress,
                      addressLine1: this.tsDetails.proposerAddress,
                      addressLine2: "nbv",
                      addressLine3: null,
                      city: this.tsDetails.proposerCity,
                      state: this.tsDetails.proposerState,
                      pinCode: this.tsDetails.proposerPincode,
                      panNumber: this.tsDetails.proposerPanNumber,
                      tenure: 1,
                      sumInsured: this.tsDetails.sumInsured,
                      premium: this.tsDetails.totalPremium,
                      annualIncome: this.tsDetails.annualIncome,
                      familyConstructId: this.tsDetails.familyConstructId,
                      familyConstruct: this.tsDetails.familyConstruct,
                      occupationType: this.selectedOccupationCode[0]?.occupationCode,
                      occupation:  this.tsDetails.occupation,
                      leadStatus: "DRAFT",
                      productCode: this.tsDetails.productCode,
                      productName: this.tsDetails.productName,
                      isSubmitted: false,
                      isPayment: false,
                      isOtpValidated: false,
                      groupCode: this.tsDetails.groupCode,
                      productPlanName: this.tsDetails.productPlanName,
                      productPlanCode: this.tsDetails.productPlanCode.toString(),
                      combiId: this.tsDetails.combiId,
                      combiName: null,
                      ghiPremium: this.tsDetails.ghiPremium,
                      gpaPremium: this.tsDetails.gpaPremium,
                      gciPremium: this.tsDetails.gciPremium,
                      gpPremium: this.tsDetails.gpPremium,
                      deductibleAmount: this.tsDetails.deductibleAmount,
                      avid: this.agentCode.toString(),
                      createdBy: this.agentCode.toString(),
                      currentUser: this.agentCode.toString(),
                      modeOfPayment: "Juspay",
                      preferredContactDate: this.tsDetails.preferredContactDate,
                      preferredContactTime: this.tsDetails.preferredContactTime,
                      avRemark: this.tsDetails.avRemark,
                      disposition: filteredDispositionData[0].dispositionName,
                      subDisposition: filteredSubDispositionData[0].subDispositionName,
                      allHealthDeclaration: [],
                      accountNumber: this.tsDetails.accountNumber,
                      ifscCode: this.tsDetails.ifscCode,
                      branchName: this.tsDetails.branchName,
                      bankName: this.tsDetails.bankName,
                      bankAccountType: this.tsDetails.bankAccountType,
                      micrCode: this.tsDetails.micrCode,
                      accountType: this.tsDetails.accType,
                      isGoGreen: true,
                      productPlan: this.tsDetails.productPlanName,
                    },
                    insuredDetails: this.tsDetails.insuredMemberDetails.map((member: any) => ({
                      id: member.memberIndex,
                      leadId: this.tsDetails.leadId,
                      salutation:  member.salutation,
                      firstName: member.firstName,
                      lastName: member.lastName,
                      gender: member.gender,
                      dob: member.dob,
                      age: member.age,
                      relationWithProposer: JSON.parse(member.relationshipType)?.name || member.relation,
                      relationCode: (member.relation != "Son2" && member.relation != "Daughter2") ? JSON.parse(member.relationshipType)?.id : member.relation == "Son2" ? "R003" : "R004" || "",
                      email: member.emailId,
                      mobileNumber: member.mobileNumber,
                      height: this.convertToCentimeters(member.height, member.heightInches).toFixed(2).toString() || 0,
                      heightInch: member.heightInches || null,
                      weight: member.weight,
                      allDisease: null,
                      memberId: member.memberIndex,
                      allDiseases: []
                    })),
                    nomineeDetails: {
                      leadId:  this.tsDetails.leadId,
                      nomineeSalutation: this.tsDetails.preFix,
                      nomineeFirstName: this.tsDetails.nomineeFirstName,
                      nomineeLastName: this.tsDetails.nomineeLastName,
                      gender: this.tsDetails.nomineeGender == "M" ? "Male" : "Female" ,
                      nomineeRelation: this.tsDetails.relationWithProposer,
                      nomineeRelationCode: nomineeRelationCode[0].relationCode,
                      dob: this.tsDetails.nomineeDob,
                      nomineeContactNumber: this.tsDetails.nomineeContactNumber,
                      email: this.tsDetails.nomineeEmail,
                      address: this.tsDetails.nomineeAddress,
                      appointeeName: this.tsDetails.appointeeName,
                      appointeeDOB: this.tsDetails.appointeeDob,
                      appointeeContactNo: this.tsDetails.appointeeContactNo,
                      relationshipOfAppointeeWithNominee: this.tsDetails.relationshipOfAppointeeWithNominee,
                      defaultShare: this.tsDetails.defaultShare,
                    }
                  
                };
                console.log(payloadObject);
                let commonDraftRequest = {
                  leadId: this.tsDetails.leadId,
                  requestData: JSON.stringify(payloadObject),
                  isFinalSubmit: this.agentCode != "467897" ? true : false,
                  leadStatus: "SUBMITTED"
                }
                this.rugService.saveTsCommonDraft(commonDraftRequest).subscribe({
                  next: (res: any) => {
                    console.log(res);
                    let responseData = JSON.parse(res.data);
                    if (responseData.isSuccess == true && responseData.statusCode == 200) {
                      this.toast.success({ detail: "Success", summary: responseData.message, duration: 3000 });
                      if(this.getFormIndexValue() == 5 && this.agentCode == "467897"){
                        if (this.getFormIndexValue() < this.formSequence.length - 1) {
                          this.incrementIndex();
                          this.incrementIndex();
                          this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                        }
                      }else{
                        if (this.getFormIndexValue() < this.formSequence.length - 1) {
                          this.incrementIndex();
                          this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                        }
                      }
                    }else{
                      this.toast.warning({ detail: "Warning", summary: responseData.message, duration: 3000 });
  
                    }
                  },
                  error: (err) => {
                    console.error(err);
                  }
                });
              }else{
                if (this.getFormIndexValue() < this.formSequence.length - 1) {
                  this.incrementIndex();
                  this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                }
              }
            }
          },
          error: (err) => {
            console.error(err);
          }
        });
      // }
      // else{
      //   //https://usp.monocept.ai/api/v1/SaveBBCommonDraft
      //   let commonDraftRequest = {
      //     leadId: this.yatraService.policyDetails.proposerDetails.leadId,
      //     requestData: JSON.stringify({      
      //       proposerDetails: this.yatraService.policyDetails.proposerDetails,
      //       insuredDetails:this.yatraService.policyDetails.insuredDetails,
      //       nomineeDetails:this.yatraService.policyDetails.nomineeDetails
      //     }),
      //     isFinalSubmit: true,
      //     leadStatus: "SUBMITTED"
      //   }
      //   this.yatraService.saveBBCommonDraft(commonDraftRequest).subscribe({
      //     next: (res: any) => {
      //       console.log(res);
      //       if (res.isSuccess == true && res.statusCode == 200) {
      //         this.toast.success({ detail: "Success", summary: res.statusMessage, duration: 3000 });
      //         if (this.getFormIndexValue() < this.formSequence.length - 1) {
      //           this.incrementIndex();
      //           this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
                
      //         }
    
      //       }
    
      //     },
      //     error: (err) => {
      //       console.error(err);
      //     }
      //   });
      // }
      }
    }
    else {
      console.log('Form is invalid', this.dynamicFormGroup);
      let firstInvalidTabIndex: number | null = null;
      if (this.dynamicFormGroup.get('insuredMemberDetails')) {
        this.form.formSections.forEach(section => {
          section.formControls.forEach(control => {
            if (control.dynamicControls) {
              control.dynamicControls.forEach((tabControls: any, tabIndex: number) => {
                const formGroup = (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray).controls.at(tabIndex); // Assuming tabIndex maps to form group
                console.log(formGroup);
                if (formGroup && formGroup.invalid && firstInvalidTabIndex === null) {
                  firstInvalidTabIndex = tabIndex; // Capture the first invalid tab
                }
              })
            }
          })
        })
      }
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach(nestedField => {
                const nestedControl = arrayControl.get(nestedField);
                nestedControl?.markAsTouched({ onlySelf: true });
              });
            } else {
              arrayControl?.markAsTouched({ onlySelf: true });
            }
          });
        }
        else if (control instanceof FormGroup) {
          control?.markAsDirty({ onlySelf: true });
        }
        else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
      if (this.dynamicFormGroup.invalid) {
        this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 });
        if (firstInvalidTabIndex !== null) {
          // Navigate to the first invalid tab
          this.activeMemberTabIndex = firstInvalidTabIndex;
          // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
        }
      }
      else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
        this.toast.warning({ detail: "Warning", summary: "Indian residency is required", duration: 3000 })
    }
  }
  onTsCustomerSubmit(){
    console.log(this.dynamicFormGroup.get('decl2')?.value);
    console.log(this.dynamicFormGroup.get('decl3')?.value);
    if (this.dynamicFormGroup.get('decl2')?.value == true) {
      let commonDraftRequest = {
        "leadId": this.tsDetails?.leadId
      }
      this.rugService.postTsHalfQuote(commonDraftRequest).subscribe({
        next: (res: any) => {
          let halfQuoteResponse: any;
          console.log(res);
          halfQuoteResponse = JSON.parse(res.data);
          if (halfQuoteResponse.isSuccess == true && halfQuoteResponse.statusCode == 200) {
            this.toast.success({ detail: "Success", summary: halfQuoteResponse.message, duration: 3000 });
            let justpayPayload = {
              "agentcode": this.agentCode,
              "proposalNumber": this.tsDetails?.leadId,
              //  "paymentMethod": "autoDebit",
              "paymentMethod": this.tsDetails?.paymentOption == "eMandate" ? "emandate_payment" : "autoDebit",
              "source": "RUG",
              "policyType": "New Business",
              "policyNumber": "",
              "quoteNumber": "",
              "OrderId": "",
              "Amount": Math.round(this.tsDetails?.totalPremium),
              "FirstName": this.tsDetails?.customerFirstName,
              "MiddleName": "",
              "LastName": this.tsDetails?.customerLastName,
              "Phone": this.tsDetails?.proposerMobileNumber,
              "Email": this.tsDetails?.proposerEmailAddress,
              "DOB": this.tsDetails?.proposerDob,
              "appName": "TELESALES"

            }
            console.log(justpayPayload);
            this.d2cJustPayRedirection(justpayPayload)
            // if (this.getFormIndexValue() < this.formSequence.length - 1) {
            //   this.incrementIndex();
            //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);

            // }

          } else {
            this.toast.success({ detail: "Success", summary: res.statusMessage, duration: 3000 });

          }

        },
        error: (err) => {
          console.error(err);
        }
      });
    }else {
      this.toast.warning({ detail: "Warning", summary: "Declaration to be selected mandatorily to proceed with the journey", duration: 3000 });
    }
  }
  filterRelationByName(relationName: string) {
    if(this.nomineeRelations != undefined){
      return this.nomineeRelations.filter((relation: any) => relation.relationName === relationName);
    }else{
      this.yatraService.getRelations().subscribe({
        next: (response: any) => {
          response = JSON.parse(response.data).data;
          this.nomineeRelations = response;
          console.log(this.nomineeRelations);
          this.nomineeRelations = this.nomineeRelations.relationShipModels;
          return this.nomineeRelations.filter((relation: any) => relation.relationName === relationName);
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
  mergeArrays(firstArray: any[], insuredDetails: any[]): void {
    console.log(firstArray);
    console.log(insuredDetails);
    firstArray.forEach((firstItem, index) => {
      console.log(JSON.parse(firstItem.relationshipType));
      console.log(index);
      let firstItemRelation = JSON.parse(firstItem.relationshipType);
      insuredDetails.splice(1);
      const existingItem = insuredDetails.find((item, index) => (firstItemRelation.id != undefined && item.relationCode === firstItemRelation.id));
      if (existingItem) {
        existingItem.firstName = firstItem.firstName;
        existingItem.lastName = firstItem.lastName;
        existingItem.gender = firstItem.memberGender;
        existingItem.dob = firstItem.memberdob;
        existingItem.age = firstItem.memberAge.toString();
        existingItem.ageType = "years";
        existingItem.relationWithProposer = firstItem.relation;
        existingItem.weight = firstItem.weight;
        existingItem.height = this.convertToCentimeters(firstItem.height, firstItem.heightInches).toFixed(2).toString();
        existingItem.heightInch = null;
      } else {
        if (insuredDetails.length < 4) {
          insuredDetails.push({
            leadId: insuredDetails[0].leadId,  // Use a common `leadId` or generate it as needed
            salutation: firstItemRelation.id == "R002" ? "Ms" : "Mr",           // Add appropriate salutation if needed
            firstName: firstItem.firstName,
            lastName: firstItem.lastName,
            gender: firstItem.memberGender,
            dob: firstItem.memberdob,
            age: firstItem.memberAge.toString(),
            ageType: "years",           // Customize this field as required
            relationWithProposer: (firstItemRelation.id != undefined && firstItemRelation.id == "R003") ? firstItem.relation.replace(/\d+$/, '') : firstItem.relation.replace(/\d+$/, ''),
            relationCode: firstItemRelation.id != undefined ? firstItemRelation.id : firstItemRelation.value.replace(/\d+$/, '') == "Son" ? "R003" : "R004" ,
            tenure: null,
            height: this.convertToCentimeters(firstItem.height, firstItem.heightInches).toFixed(2).toString(),
            heightInch: null,
            weight: firstItem.weight
          });
        }
      }
    });
  }
  convertToCentimeters(feet: number, inches: number): number {
    const feetToCentimeters = feet * 30.48;
    const inchesToCentimeters = inches * 2.54;
    const totalCentimeters = feetToCentimeters + inchesToCentimeters;
    return totalCentimeters;
  }
  returnAgeRange(familyConstructDetails: any, spouseDob: any=0, selfDob: any) {
    if (familyConstructDetails == '2' || familyConstructDetails == '4' || familyConstructDetails == '3') {
      spouseDob = this.getAgeFromDOB(spouseDob);
      selfDob = this.getAgeFromDOB(selfDob);
      let elderPerson = spouseDob > selfDob ? spouseDob : selfDob;
      if (elderPerson > 45 && elderPerson <= 55) {
        return '46-55'
      } else if (elderPerson >= 18 && elderPerson <= 45) {
        return '18-45'
      } else {
        return
      }
    } else if (familyConstructDetails == '1' || familyConstructDetails == '5' || familyConstructDetails == '6') {
      selfDob = this.getAgeFromDOB(selfDob);
      if (selfDob > 45 && selfDob <= 55) {
        return '46-55'
      } else if (selfDob >= 18 && selfDob <= 45) {
        return '18-45'
      } else {
        return
      }
    } else {
      return
    }

  }
  getAgeFromDOB(birthDateString: string): number {
    if (this.IsNotNullOrEmpty(birthDateString)) {
      if (birthDateString?.includes("-")) {
        if (birthDateString.split("-")[0].length == 2) {
          birthDateString = this.formatDate(birthDateString);
        }
      } else if (birthDateString?.includes("/")) {
        if (birthDateString.split("/")[0].length == 2) {
          birthDateString = this.formatDate(birthDateString);
        }
      }
      const birthDate = new Date(birthDateString);
      const today = new Date();
      const birthYear = birthDate.getFullYear();
      const currentYear = today.getFullYear();

      let age = currentYear - birthYear;

      // Check if the birthday has occurred this year
      const birthMonth = birthDate.getMonth();
      const currentMonth = today.getMonth();
      const birthDay = birthDate.getDate();
      const currentDay = today.getDate();

      if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
      }

      return age;
    } else {
      return 0
    }

  }
  IsNotNullOrEmpty(input: any): boolean {
    if (input !== null || input !== "" || input !== undefined || input.length >= 0 || input != 0)
      return true;
    else
      return false;
  }
  IsNullOrEmpty(input: any): boolean {
    if (input === null || input === "" || input === undefined || input.length <= 0 || input == 0)
      return true;
    else
      return false;
  }
  formatDate(inputDate: string, outputFormat: string = 'YYYY-MM-DD'): string {
    let parts: any;
    if (this.IsNullOrEmpty(inputDate)) {
      return "";
    }
    else {
      if (inputDate.includes("/")) {
        parts = inputDate?.split('/').map(part => parseInt(part, 10));
      } else if (inputDate.includes("-")) {
        parts = inputDate?.split('-').map(part => parseInt(part, 10));
      }
      let formattedDate = ''
      if (parts?.length === 3 && !parts.some(isNaN)) {
        if (outputFormat == 'YYYY-MM-DD') {
          const [day, month, year] = parts;
          formattedDate = outputFormat
            .replace('YYYY', year.toString())
            .replace('MM', ('0' + month).slice(-2))
            .replace('DD', ('0' + day).slice(-2));
        } else if (outputFormat == 'DD-MM-YYYY') {
          const [year, month, day] = parts;
          formattedDate = outputFormat
            .replace('YYYY', year.toString())
            .replace('MM', ('0' + month).slice(-2))
            .replace('DD', ('0' + day).slice(-2));
        }


        return formattedDate;
      } else {
        throw new Error('Invalid date format');
      }
    }

  }
  changeMainFormDependentControls(
    dependentControlNames: (string | { name: string; visibility: boolean })[],
    visibility: boolean,
    controlName: string | null = null,
    parentControlName: string | null = null,
    controlIndex: number | null = null
  ) {
    console.log(dependentControlNames, visibility);

    const tempIndex = this.activeMemberTabIndex;
    setTimeout(() => {
      dependentControlNames.forEach((dependent) => {
        // Extract control name and visibility from either string or object
        const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
        const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;

        this.form.formSections.forEach((section: IFormSections) => {
          section.formControls.forEach((control: IFormControl) => {
            if (control.dynamicControls && controlIndex != null && control.dynamicControls.length > controlIndex) {
              const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex]));
              targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
                if (dynamicControl.name === dependentName) {
                  dynamicControl.visible = dependentVisibility;
                } else if (dynamicControl.subControls && dynamicControl.name === parentControlName) {
                  dynamicControl.subControls.forEach((subControlArray: any) => {
                    subControlArray.forEach((subControl: ISubControl) => {
                      if (subControl.name === dependentName) {
                        subControl.visible = dependentVisibility;
                      }
                    });
                  });
                }
              });

              control.dynamicControls[controlIndex] = targetDynamicControl;

            } else if (control.name === dependentName) {
              control.visible = dependentVisibility;
              if (dependentVisibility) {
                let controlValidators: any = [];
                control.validators?.forEach((val: IValidator) => {
                  if (val.validatorName === 'required') controlValidators.push(Validators.required);
                  if (val.validatorName === 'email') controlValidators.push(Validators.email);
                  if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                  if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                  if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                });
                this.dynamicFormGroup.get(control.name)?.setValidators(controlValidators);
              } else {
                this.dynamicFormGroup.get(control.name)?.clearValidators();
                this.dynamicFormGroup.get(control.name)?.reset();
              }
            }
          });
        });
      });
      this.changeDetectorRef.detectChanges();
    }, 0);

    this.activeMemberTabIndex = tempIndex;
    console.log(this.form);
  }

  changeBBPaymentDependentControls(
    dependentControlNames: (string | { name: string; visibility: boolean })[],
    visibility: boolean,
    controlName: string | null = null,
    parentControlName: string | null = null,
    controlIndex: number | null = null
  ) {
    console.log(dependentControlNames, visibility);

    const tempIndex = this.activeMemberTabIndex;
    setTimeout(() => {
      dependentControlNames.forEach((dependent) => {
        // Extract control name and visibility from either string or object
        const dependentName = typeof dependent === 'string' ? dependent : dependent.name;
        const dependentVisibility = typeof dependent === 'string' ? visibility : dependent.visibility;

        this.form.formSections.forEach((section: IFormSections) => {
          section.formControls.forEach((control: IFormControl) => {
            if (control.dynamicControls && controlIndex != null && control.dynamicControls.length > controlIndex) {
              const targetDynamicControl = JSON.parse(JSON.stringify(control.dynamicControls[controlIndex]));
              targetDynamicControl.forEach((dynamicControl: IDynamicControl) => {
                if (dynamicControl.name === dependentName) {
                  dynamicControl.visible = dependentVisibility;
                } else if (dynamicControl.subControls && dynamicControl.name === parentControlName) {
                  dynamicControl.subControls.forEach((subControlArray: any) => {
                    subControlArray.forEach((subControl: ISubControl) => {
                      if (subControl.name === dependentName) {
                        subControl.visible = dependentVisibility;
                      }
                    });
                  });
                }
              });

              control.dynamicControls[controlIndex] = targetDynamicControl;

            } else if (control.name === dependentName) {
              control.visible = dependentVisibility;
              if (dependentVisibility) {
                let controlValidators: any = [];
                control.validators?.forEach((val: IValidator) => {
                  if (val.validatorName === 'required') controlValidators.push(Validators.required);
                  if (val.validatorName === 'email') controlValidators.push(Validators.email);
                  if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength as number));
                  if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength as number));
                  if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern as string));
                });
                this.dynamicFormGroup.get(control.name)?.setValidators(controlValidators);
              } else {
                this.dynamicFormGroup.get(control.name)?.clearValidators();
                this.dynamicFormGroup.get(control.name)?.reset();
              }
            }
          });
        });
      });
      this.changeDetectorRef.detectChanges();
    }, 0);

    this.activeMemberTabIndex = tempIndex;
    console.log(this.form);
    console.log(this.dynamicFormGroup.get('paymentMode')?.value);
    if(this.dynamicFormGroup.get('paymentMode')?.value == 'yes'){
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      this.dynamicFormGroup.patchValue({
        consentDeclare: true,
        frequencyOfPayment: 'As and when presented',
        startDate: formattedDate,
        endDate: "Untill Cancelled",
        debitType: "Maximum Amount"
      })
      this.dynamicFormGroup.get('consentDeclare')?.disable();
      this.form.formSections.forEach((section: IFormSections) => {
        section.formControls.forEach((control: IFormControl) => {
          if(control.name == "consentDeclare"){
            if (control.class) {
              control.label = "Consent To Auto Renew"
              control.class = "col-md-12 acceptTermsCheck";
          }
        }else{}
        })
      })

    }else{
      this.form.formSections.forEach((section: IFormSections) => {
        section.formControls.forEach((control: IFormControl) => {
          if(control.name == "consentDeclare"){
            console.log(control);
              // control.visible = false;
              // control.visibleLabel = false;
              control.class = "line-container";
              control.label = ""
          }
        })
      })
    }
  }



  generateLeadAndProposalId(control: any) {
    if (this.dynamicFormGroup.valid) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((formControl: any) => {
          if (formControl.name == control.name) {
            formControl.visible = false;
            const dependentControlName = formControl.dependentControl[0];
            const dependentControl = section.formControls.find((fc: any) => fc.name === dependentControlName);

            if (dependentControl) {
              dependentControl.visible = true;
            }
          }
        })
      })
      const reqData = {
        "proposalNum": this.proposalNum,
        "productId": this.productid,
        "insuranceTypeCode": this.insurancetypecode,
        "leadFirstName": this.dynamicFormGroup.get('leadFirstName')?.value,
        "leadLastName": this.dynamicFormGroup.get('leadLastName')?.value,
        "leadMobileNo": this.dynamicFormGroup.get('leadMobileNo')?.value,
        "leadEmailId": this.dynamicFormGroup.get('leadEmailId')?.value,
      }
      // this.adminService.insertLeadDetails(reqData).subscribe({
      //   next: (res) => {
      //     this.leadId = res.leadId;
      //     this.proposalId = res.proposalId;
      //     this.quoteId = res.quoteId;
      //     sessionStorage.setItem("leadId", this.encryptionService.encrypt(this.leadId));
      //     this.dynamicFormGroup.addControl("leadId", this.fb.control(this.leadId));
      //     sessionStorage.setItem("proposalId", this.encryptionService.encrypt(this.proposalId));
      //     this.dynamicFormGroup.addControl("proposalId", this.fb.control(this.proposalId));
      //     sessionStorage.setItem("quoteId", this.encryptionService.encrypt(this.quoteId));
      //     this.dynamicFormGroup.addControl("quoteId", this.fb.control(this.quoteId));
      //     this.toast.success({ detail: "Success", summary: "Lead Created Successfully.", duration: 3000 });

      //   },
      //   error: (err) => {
      //     console.error(err);
      //   }
      // });
    }
    else {
      console.log('Form is invalid');
      Object.keys(this.dynamicFormGroup.controls).forEach(field => {
        const control = this.dynamicFormGroup.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 })
    }
  }

  async getPremiumAmount() {
    
    console.log(this.tenureAmount, this.formData.insuredMemberDetails, this.isQuote, Object.keys(this.formData).length);

    if (this.changesMade) {
      this.changeRecalculate(false);
    }

    if (this.isQuote == false) {
      
      if (Object.keys(this.formData).length > 0) {
        // const modifiedInsuredMemberDetails = JSON.parse(JSON.stringify(this.formData));
        this.formData.insuredMemberDetails.forEach((member: any) => {
          console.log(member);

          // Only set 'covers' if it doesn't exist
          if (!member.hasOwnProperty('covers')) {
            member['covers'] = [];
          }

          // Only set 'isChronic' if it doesn't exist
          if (!member.hasOwnProperty('isChronic')) {
            member['isChronic'] = "No";
          }

          // Only set 'chronicDiseases' if it doesn't exist
          if (!member.hasOwnProperty('chronicDiseases')) {
            member['chronicDiseases'] = null;
          }

          // Only set 'roomCategory' if it doesn't exist
          if (!member.hasOwnProperty('roomCategory')) {
            member['roomCategory'] = "";
          }

          // Assign 'memberRelationCode' based on the relation, only if it's not already set
          if (!member.hasOwnProperty('memberRelationCode')) {
            if (member.relation === 'Self') {
              member['memberRelationCode'] = 24;
            } else if (member.relation === 'Spouse') {
              member['memberRelationCode'] = 22;
            } else if (member.relation.includes('Son')) {
              member['memberRelationCode'] = 23;
            } else if (member.relation.includes('Daughter')) {
              member['memberRelationCode'] = 19;
            }
          }
        });

        console.log(this.formData.insuredMemberDetails);

        if (this.formData['sumInsured'] == null) {
          this.formData['sumInsured'] = this.formData.insuredMemberDetails[0].sumInsured;
        }

        this.formData['familySize'] = this.formData.insuredMemberDetails.length + 'A';
        this.formData['proposerName'] = this.formData['firstName'] + this.formData['lastName'];

        if (this.formData.memberPolicyType == 'Family Floater') {
          this.formData.insuredMemberDetails.forEach((member: any) => {
            member.pincode = this.formData['proposerPincode']
          })
        }
        else
          this.formData['proposerPincode'] = this.formData.insuredMemberDetails[0].pincode;

        console.log(this.formData.insuredMemberDetails, this.productId, this.agentCode);

        let reqData = {
          "agentCode": this.agentCode,
          "productId": this.productId,
          "quoteData": JSON.stringify(this.formData)
        }

        console.log(reqData);

        this.commonService.GetSingleProductQuote(reqData).pipe(
          tap((res: any) => {
            
            // Update tenureAmount and discountList after receiving the response
            this.QuoteNumber = [];
            for (let i = 1; i <= 3; i++) {
              const premiumKey = `tenure${i}Premium`;
              const discountKey = `t${i}DiscountPercentage`;
              const Quote = `tenure${i}QuoteNumber`
              this.QuoteNumber.push(res.data[Quote]);
              console.log(res.data[premiumKey], res.data[discountKey]);

              this.tenureAmount[i - 1] = Math.round(res.data[premiumKey]);
              this.discountList[i - 1] = res.data[discountKey] ? res.data[discountKey] : 0;
            }
            console.log(this.QuoteNumber, this.selectedIndex);
            this.formData.quoteId = this.QuoteNumber[this.selectedIndex];
            // this.formData.tenure = this.selectedIndex;
            sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
          })
        ).subscribe({
          next: () => {
            // After setting tenureAmount and discountList, call setPremiumAmount()
            this.setPremiumAmount();
            
          },
          error: (err) => {
            console.log("Error while fetching product tenure", err);
            
          }
        });


      }
    }


    // this.premiumDetails = [];
    // this.premiumAmountDetails = [];
    // var relationShip: string = '';
    // var maxAge: number = 0;

    // if (this.formData.planType === 'Multi Individual' || this.formData.planType === 'Individual') {
    //   relationShip = 'Multi Individual'
    // }
    // else {
    //   this.formData.insuredMemberDetails.forEach((member: any) => {
    //     if (relationShip.length > 0)
    //       relationShip += ','

    //     relationShip += JSON.parse(member.relationshipType).value;

    //     if (member.memberAge > maxAge) {
    //       maxAge = member.memberAge;
    //     }

    //   })
    // }

    // if (Object.keys(this.formData).length > 0) {
    //   const modifiedInsuredMemberDetails = JSON.parse(JSON.stringify(this.formData));
    //   modifiedInsuredMemberDetails.insuredMemberDetails.forEach((member: any) => {
    //     const relationshipValue = JSON.parse(member.relationshipType);
    //     member.relationshipType = relationshipValue.value;
    //     member['relationShip'] = relationShip;
    //     member['prodCd'] = ''
    //     if (this.formData.memberPolicyType == 'Family Floater') {
    //       member['sumInsured'] = this.formData.memberSumInsured;
    //       member['zone'] = this.formData.zone;
    //       member['city'] = this.formData.city;
    //       member.prodCd = this.formData.memberPlan;
    //       member.memberAge = maxAge;
    //       member['pincode'] = this.formData.pincode;
    //       // member['preExistingDisease'] = "no";
    //     }
    //   });


    //   if (modifiedInsuredMemberDetails.productType == 'AS') {
    //     const transformedInsuredMemberDetails: any[] = [];

    //     modifiedInsuredMemberDetails.insuredMemberDetails.forEach((member: any) => {

    //       var commonDetails = {};
    //       Object.keys(member).forEach((key: string) => {
    //         if (!Array.isArray(member[key])) {
    //           if (key === "isEarning") {
    //             if (member[key])
    //               commonDetails = { ...commonDetails, "isEarning": 1 };
    //             else
    //               commonDetails = { ...commonDetails, "isEarning": 0 };
    //           }
    //           else
    //             commonDetails = { ...commonDetails, [key]: member[key] };
    //         }
    //       });



    //       Object.keys(member).forEach((key: string) => {

    //         if (Array.isArray(member[key]) && member[key].length > 0) {

    //           const addOn = member[key][0];
    //           const firstKey = Object.keys(addOn)[0];

    //           if (addOn[firstKey]) {
    //             if (addOn.coverType == "PA") {
    //               addOn['riskClass'] = JSON.parse(addOn.natureOfDuties).value;
    //             }
    //             transformedInsuredMemberDetails.push({ ...commonDetails, ...addOn });
    //           }
    //         }
    //       });
    //     });
    //     modifiedInsuredMemberDetails.insuredMemberDetails = transformedInsuredMemberDetails;
    //   }
    //   var reqData = {
    //     code: this.Code,
    //     insuranceTypeCode: this.insurancetypecode,
    //     productId: this.productid,
    //     configuration_Json: JSON.stringify(modifiedInsuredMemberDetails)
    //   };

    //   console.log(reqData);


    //   try {

    //     let quoteResponse: any;

    //     if (this.formData.productType == 'AF') {
    //       quoteResponse = await new Promise((resolve, reject) => {
    //         this.service.getActiveFitQoute(reqData).subscribe({
    //           next: (res) => {
    //             resolve(res)
    //           },
    //           error: (err) => { reject(err) }
    //         });
    //       });
    //     }
    //     else {
    //       quoteResponse = await new Promise((resolve, reject) => {
    //         this.service.getQoute(reqData).subscribe({
    //           next: (res) => {
    //             resolve(res)
    //           },
    //           error: (err) => { reject(err) }
    //         });
    //       });
    //     }

    //     if (this.formData.planType == 'Multi Individual' || this.formData.planType == 'Individual') {
    //       quoteResponse.forEach((element: any) => {
    //         element.prmMemDtlSecureEntity.forEach((member: any) => {
    //           let tempArray: number[] = [];
    //           member.premium.forEach((premium: any) => {
    //             // if (premium.tenure === 1) {
    //             //   this.tenureAmount[premium.te] += premium.premium || 0;
    //             // } else if (premium.tenure === 2) {
    //             //   this.tenure2Total += premium.premium || 0;
    //             // } else if (premium.tenure === 3) {
    //             //   this.tenure3Total += premium.premium || 0;
    //             // }
    //             this.tenureAmount[premium.tenure - 1] += premium.premium || 0;
    //             tempArray.push(premium.premium);
    //           });
    //           console.log(this.tenureAmount);

    //           this.premiumDetails.push(member.premium);
    //           this.premiumAmountDetails.push(tempArray);
    //         });
    //       });
    //       // console.log(this.premiumAmountDetails);
    //       sessionStorage.setItem("premiumAmountDetails", this.encryptionService.encrypt(this.premiumAmountDetails));
    //     }
    //     else {
    //       quoteResponse.forEach((element: any) => {
    //         let tempArray: number[] = [];
    //         element.prmMemDtlSecureEntity[0].premium.forEach((premium: any) => {
    //           this.tenureAmount[premium.tenure - 1] += premium.premium || 0;
    //           tempArray.push(premium.premium);
    //         });

    //         this.premiumAmountDetails.push(tempArray);
    //       })

    //       for (let i = 0; i < this.formData.numberOfInsuredMembers - 1; i++) {
    //         this.premiumAmountDetails.push([0, 0, 0]);
    //       }
    //     }



    //     this.tenureAmount.forEach(member => {
    //       console.log(member);

    //     })
    //     console.log(this.premiumAmountDetails);
    //     console.log(this.premiumDetails);

    //     // Second API Call
    //     let reqData2: {
    //       productType: any;
    //       overAllSIAge: number[];
    //       totalPremium: number[][];
    //       valueUnit: any[];
    //       yearlyDiscount: number[];
    //       zoneDiscount: number;
    //       memberDiscount: number;
    //       addOnList: any[];
    //     };

    //     var overAllSIAge: number[] = [];
    //     var valueUnit: any[] = [];


    //     this.formData['insuredMemberDetails'].forEach((member: any) => {
    //       overAllSIAge.push(parseInt(member.memberAge));
    //       valueUnit.push(null);
    //     });

    //     reqData2 = {
    //       productType: this.formData['productType'],
    //       overAllSIAge: overAllSIAge,
    //       totalPremium: this.premiumAmountDetails,
    //       valueUnit: valueUnit,
    //       yearlyDiscount: [0, 7.5, 10],
    //       zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
    //       memberDiscount: 0,
    //       addOnList: this.addOnList
    //     };

    //     if (this.formData['numberOfInsuredMembers'] > 1 && this.formData['planType'] == 'Multi Individual') {
    //       reqData2.memberDiscount = 5;
    //     }
    //     

    //     console.log(reqData2);


    //     const addOnPremiumResponse: any = await new Promise((resolve, reject) => {
    //       this.service.getAddOnPremium(reqData2).subscribe({
    //         next: (response) => resolve(response),
    //         error: (err) => reject(err)
    //       });
    //     });

    //     addOnPremiumResponse.calculatedValuesList.forEach((member: number, index: number) => {
    //       this.tenureAmount[index] = Math.round(member)
    //     })

    //     console.log(this.tenureAmount);

    //     this.taxList = addOnPremiumResponse.taxList;
    //     this.netPremiumList = addOnPremiumResponse.netPremiumList;
    //     this.totalPremiumList = addOnPremiumResponse.totalPremiumList;
    //     this.indPremiumList = addOnPremiumResponse.indPremiumList;
    //     this.addOnPremiumValueList = addOnPremiumResponse.totalPremiumValue;

    //     const roundedDiscountValues = addOnPremiumResponse.discountValueList.map((value: number) => Math.round(value));
    //     this.displayTaxList = addOnPremiumResponse.taxList.map((value: number) => Math.round(value));

    //     // this.dynamicFormGroup.get('premiumAmount')?.setValue(this.tenure1Total);

    //     sessionStorage.setItem('displayTaxList', this.encryptionService.encrypt(this.displayTaxList))
    //     sessionStorage.setItem('tenureAmount', this.encryptionService.encrypt(this.tenureAmount))
    //     this.changeDetectorRef.detectChanges();
    //     
    //   } catch (err) {
    //     console.error(err);
    //     
    //   }
    // }
    // this.setPremiumAmount();
  }

  flattenObjectInsert(obj: any, prefix = '') {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const arrayKey = prefix + index;
        this.flattenObjectInsert(item, arrayKey + '.');
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = prefix + key;
        if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
          this.flattenObjectInsert(value, newKey + '.');
        } else {
          this.formData[newKey] = value;
        }
      });
    } else {
      this.formData[prefix] = obj;
    }
  }

  flattenObject(obj: any, prefix = '') {
    console.log(obj);
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix + key;
      // console.log(newKey);
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        if (typeof value === 'object' && value !== null && 'id' in value) {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
        else if (this.dynamicFormGroup.get(newKey) instanceof FormGroup) {
          const formGroup = this.dynamicFormGroup.get(newKey);
          Object.keys(value).forEach((key2) => {
            console.log(value[key2], key2);
            if (key2 == 'covers') {
              console.log(formGroup?.get(key2), typeof formGroup?.get(key2));
              console.log(formGroup?.get(key2) instanceof FormArray);

            }
            if (formGroup?.get(key2) instanceof FormArray) {
              const formArray = formGroup?.get(key2) as FormArray;

              console.log(formArray);

              // Clear any existing controls if needed
              // formArray.clear();

              // Array of objects that you want to set in the FormArray
              const arrayOfObject = value[key2];
              console.log(arrayOfObject);
              // Loop through the array and create FormGroups for each object
              arrayOfObject.forEach((obj: any) => {
                if (key2 == 'covers') {
                  const group = this.fb.group({
                    coverId: [obj.coverId],
                    value: [obj.value]
                  });
                  formArray.push(group);
                }
                // else {
                //   const group = formArray.controls[0]
                //   console.log(group);
                //   formArray.push(group)
                // }
              });
            }
            else
              formGroup?.get(key2)?.setValue(value[key2]);
          })

        }
        else {
          this.flattenObject(value, newKey + '.');
        }
      }
      else {
        if (this.dynamicFormGroup.get(newKey) && this.dynamicFormGroup.get(newKey)?.value == "") {
          this.dynamicFormGroup.get(newKey)?.patchValue(value);
        }
      }
    });
    console.log(this.dynamicFormGroup.value);

  }


  // async fullQuotation() {
  //   
  //   console.log(this.formData);
  //   const data = await this.mappedFormDataFullQuote(this.formData);
  //   console.log(data);


  //   var reqData: any = {
  //     agentCode: this.agentCode,
  //     productId: this.productId,
  //     productType: 'AO',
  //     fullQuoteRequestJson: JSON.stringify(data)
  //   }
  //     this.yatraService.getFullQuote(reqData).subscribe({
  //       next: (response:any) => {
  //         console.log(response);
  //         if (response?.data && response.data['ns0:ActiveHealthRes']) {
  //           const healthRes = response.data['ns0:ActiveHealthRes'];
  //           const polCreationResponse = healthRes.PolCreationRespons;
  //           const receiptResponse = healthRes.ReceiptCreationResponse;

  //           this.quoteNo = polCreationResponse.quoteNumber;
  //           this.customerId = polCreationResponse.customerId;
  //           console.log(healthRes,polCreationResponse,receiptResponse.ReceiptNumber,this.quoteNo,this.customerId);
  //           console.log(this.dynamicFormGroup);


  //           // Setting the form values using FormGroup's setValue() method
  //           this.dynamicFormGroup.get('policyNumber')?.setValue(polCreationResponse.policyNumber);
  //           this.dynamicFormGroup.get('customerId')?.setValue(polCreationResponse.customerId);
  //           this.dynamicFormGroup.get('quoteValidFromDate')?.setValue(polCreationResponse.quoteValidFromDate);
  //           this.dynamicFormGroup.get('quoteValidToDate')?.setValue(polCreationResponse.quoteValidToDate);
  //           this.dynamicFormGroup.get('policyStatus')?.setValue(polCreationResponse.policyStatus);
  //           this.dynamicFormGroup.get('ReceiptNumber')?.setValue(receiptResponse.ReceiptNumber);
  //           console.log(this.dynamicFormGroup.value);   
  //         } else {
  //           console.error("No valid data in response", response);
  //         }

  //       this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
  //       sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
  //       this.toast.success({ detail: "Success", summary: `Full Quotation Generated Successfully.${this.customerId}`, duration: 3000 });
  //       
  //       },
  //       error: (err) => {
  //         
  //         console.error(err);
  //       }
  //     });

  // }

  async fullQuotation(): Promise<void> {
    return new Promise((resolve, reject) => {
      
      console.log(this.formData);
      this.mappedFormDataFullQuote(this.formData).then((data) => {
        console.log(data);

        var reqData: any = {
          agentCode: this.agentCode,
          productId: this.productId.toString(),
          productType: 'AO',
          fullQuoteRequestJson: JSON.stringify(data)
        }
        console.log(reqData);


        this.yatraService.getFullQuote(reqData).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response?.data && response.data['ns0ActiveHealthRes']) {
              const healthRes = response.data['ns0ActiveHealthRes'];
              const polCreationResponse = healthRes.polCreationRespons;
              const receiptResponse = healthRes.receiptCreationResponse;

              console.log(healthRes);


              this.quoteNo = polCreationResponse.quoteNumber;
              this.customerId = polCreationResponse.customerId;
              console.log(healthRes, polCreationResponse, receiptResponse.ReceiptNumber, this.quoteNo, this.customerId);
              console.log(this.dynamicFormGroup);

              // Setting the form values
              if (polCreationResponse.policyNumber) {
                this.formData.policyNumber = polCreationResponse.policyNumber;
              }

              if (polCreationResponse.customerId) {
                this.formData.customerId = polCreationResponse.customerId;
              }

              if (polCreationResponse.quoteValidFromDate) {
                this.formData.quoteValidFromDate = polCreationResponse.quoteValidFromDate;
              }

              if (polCreationResponse.quoteValidToDate) {
                this.formData.quoteValidToDate = polCreationResponse.quoteValidToDate;
              }

              if (polCreationResponse.policyStatus) {
                this.formData.policyStatus = polCreationResponse.policyStatus;
              }

              if (receiptResponse.receiptNumber) {
                this.formData.ReceiptNumber = receiptResponse.receiptNumber;
              }
              console.log(this.dynamicFormGroup.value);
            } else {
              console.error("No valid data in response", response);
            }

            this.formData = { ...this.formData, ...this.dynamicFormGroup.value };
            sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
            this.toast.success({ detail: "Success", summary: `Full Quotation Generated Successfully. ${this.customerId}`, duration: 3000 });
            
            resolve(); // Resolving the promise once the API call completes
          },
          error: (err) => {
            
            console.error(err);
            this.toast.error({ detail: "Error", summary: "Something went wrong. Please try again.", duration: 3000 });
            reject(err); // Rejecting the promise if there is an error
          }
        });
      }).catch((err) => { 
        this.toast.error({ detail: "Error", summary: "Failed to map form data", duration: 3000 });
        reject(err);
      });
    });
  }


  /* AddOn Related Method */

  onCheckboxChange(event: any, control: any, parentControl: any = null, index: number | null = null) {
    console.log(event, event.target, control, parentControl, index, this.dynamicFormGroup);

    this.changesMade = true;
    if (parentControl != null && typeof parentControl === 'object') {
      this.parentControl = parentControl;
    }
    if ((event.target.type === 'button')) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'questionnaire') {
        console.log(event.target.type, event.target.checked);
        console.log(control, parentControl);
        this.question = parentControl.name;
        this.openPopUp();
        // this.showOverlay(parentControl);
      }
    }
    if ((event.target.type === 'checkbox' && event.target.checked)) {
      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        const firstKey = Object.keys((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        (this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls[firstKey].setValue(false);
        this.showOverlay(parentControl);
      }

      if (parentControl != null && parentControl.type == 'questionnaire') {
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        console.log('questionnaire', arrayName, event.target.checked);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            console.log(subControl, event.target.value);
          }

          if (subControl.name === 'doneButton') {
            subControl.disabled = !event.target.checked;
            console.log(subControl, event.target.value);
          }
        });
        this.openPopUp();
        // this.showOverlay(parentControl);
      }

      // Call the method only if the 'method' key is present in the JSON and the checkbox is checked  this.resolveMethod(control.method, control?.popUpFormId, control?.name, control?.dependentControls, 'add');
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, true, control?.name, parentControl?.name, index, 'add');
    }

    else if (event.target.type === 'checkbox' && event.target.checked == false) {

      if (parentControl != null && typeof parentControl === 'object' && parentControl.type == 'combinedCheckbox') {
        // if()
        // console.log(parentControl,this.dynamicFormGroup.get(parentControl.name),this.dynamicFormGroup);

        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.innerSubControls) {
            for (let i = 1; i < subControl.innerSubControls.length; i++) {
              console.log(subControl.innerSubControls[i]);

              if (subControl.innerSubControls[i].coreControls) {
                for (let j = 0; j < subControl.innerSubControls[i].coreControls.length; j++) {
                  console.log(subControl.innerSubControls[i].coreControls[j], this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`));
                  if (this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.value == true) {

                    this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue(false);
                  }
                  else {
                    this.dynamicFormGroup.get(`${parentControl.name}.${subControl.name}.${subControl.innerSubControls[i].name}.${j}.${subControl.innerSubControls[i].coreControls[j].name}`)?.setValue('');
                  }
                }
              }
            }
          }
        })
        this.changeRecalculate(true);
        this.addOnRemoved(control, parentControl);
      }
      if (parentControl != null && parentControl.type == 'questionnaire') {
        const arrayName = (control.name).charAt(0).toUpperCase() + (control.name).slice(1);
        console.log('questionnaire', arrayName, event.target.checked);
        parentControl.subControls.forEach((subControl: any) => {
          if (subControl.name === arrayName) {
            subControl.visible = event.target.checked;
            if (event.target.checked == false) {
              subControl.innerArrayControl = subControl.innerArrayControl?.slice(0, 2);

              let formArray = (this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls[arrayName] as FormArray;
              console.log(formArray);
              // Remove all items from the FormArray
              while (formArray.length > 1) {
                formArray.removeAt(1);
              }

              // Reset the value of the first element in the FormArray to an empty string.
              const firstControl = formArray.at(0) as FormGroup;
              Object.keys(firstControl.controls).forEach(key => {
                firstControl.get(key)?.setValue('');
              });

              Object.keys(this.formData).forEach(key => {
                const baseKey = `${control.name}.${subControl.name}.`;

                // Check if the key starts with the baseKey.
                if (key.startsWith(baseKey)) {
                  const index = key.substring(baseKey.length).split('.')[0];

                  // If the index is not "0", remove the key; otherwise, reset its value.
                  if (index !== '0') {
                    delete this.formData[key];
                  } else {
                    this.formData[key] = ''; // Reset value for index 0.
                  }
                }
              });
              console.log(this.formData, this.dynamicFormGroup.value, this.form);
            }
            console.log(subControl, event.target.value);
          }

          if (subControl.name === 'doneButton') {
            subControl.disabled = false;
            console.log(subControl, event.target.value);
          }
        });
        this.openPopUp();
        // this.showOverlay(parentControl);
      }
      if (control.onChangeMethod)
        this.resolveMethod(control.onChangeMethod, control?.popUpFormId, control?.dependentControls, false, control?.name, parentControl?.name, index, 'remove');
    }
  }

  addOnAdded(control: any, parentControl: any = null) {
    // let reqData: {
    //   productType: any;
    //   overAllSIAge: number[];
    //   totalPremium: number[][];
    //   valueUnit: any[];
    //   yearlyDiscount: number[];
    //   zoneDiscount: number;
    //   memberDiscount: number;
    //   addOnList: any[];
    // };

    // var overAllSIAge: number[] = [];
    // var valueUnit: any[] = [];
    // var premiumPerype: any;
    // this.formData['insuredMemberDetails'].forEach((member: any) => {
    //   overAllSIAge.push(parseInt(member.memberAge));
    //   valueUnit.push(null);
    // });

    // console.log(control);

    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
    console.log(addOnData);

    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;
    console.log(modifiedInsuredMemberDetails);

    Object.keys(addOnData.addOnDetails).forEach((key) => {
      // Check if memberCheckbox is true for the current member
      if (addOnData.addOnDetails[key][0].memberCheckbox === true) {
        modifiedInsuredMemberDetails.forEach((member: any) => {
          // Find the matching member by relation (e.g., Self, Spouse, etc.)
          if (member.relation == key) {
            let addOnSumInsured: any = 0;
            const coverId = addOnData.addOnId;
            const coverName = addOnData.additionalCoverName;
            let coverFound = false;

            if (!member.covers) {
              member['covers'] = [];
            }

            addOnData.addOnDetails[key].forEach((addOnDetail: any) => {
              if (addOnDetail.addOnSumInsured) {
                addOnSumInsured = addOnDetail.addOnSumInsured;
              }
              if (addOnData.addOnId == 'PA' && addOnDetail.occupation) {
                member['occupationCode'] = JSON.parse(addOnDetail.occupation).value;
              }
              if (addOnData.addOnId == 'PA' && addOnDetail.occupationRisk) {
                member['natureOfDutyCode'] = JSON.parse(addOnDetail.occupationRisk).value;
              }
            });

            // if(addOnData.addOnId == 'PA'){
            //   member['occupationCode'] = JSON.parse(addOnData.addOnDetails[key][1].occupation).id;
            //   member['natureOfDutyCode'] = JSON.parse(addOnData.addOnDetails[key][1].occupationRisk).id;
            // }

            // Check if the add-on (coverId) is already present in the covers array
            member.covers.forEach((cover: any) => {
              if (cover.coverId === coverId) {
                // Update the existing add-on with the new sum insured
                cover.value = addOnSumInsured;
                coverFound = true;
              }
            });

            // If the add-on is not found, push it as a new cover
            if (!coverFound) {
              member.covers.push({
                coverId: coverId,
                value: addOnSumInsured,
                coverName: coverName
              });
            }
          }
        });
      }
      else if (addOnData.addOnDetails[key][0].memberCheckbox === false) {
        modifiedInsuredMemberDetails.forEach((member: any) => {
          // Find the matching member by relation (e.g., Self, Spouse, etc.)
          if (member.relation == key) {
            const coverId = addOnData.addOnId;

            if (member.covers) {
              // Remove the add-on by filtering out the cover with the matching coverId
              member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
            }
          }
        });
      }
    });
    // this.getPremiumAmount();

  }

  // addOnRemoved(control: any, parentControl: any) {

  //   console.log(parentControl);

  //   let reqData: {
  //     productType: any;
  //     overAllSIAge: number[];
  //     totalPremium: number[][];
  //     valueUnit: any[];
  //     yearlyDiscount: number[];
  //     zoneDiscount: number;
  //     memberDiscount: number;
  //     addOnList: any[];
  //   };

  //   var overAllSIAge: number[] = [];
  //   var valueUnit: any[] = [];


  //   this.formData['insuredMemberDetails'].forEach((member: any) => {
  //     overAllSIAge.push(parseInt(member.memberAge));
  //     valueUnit.push(null);
  //   });


  //   let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
  //   console.log(this.addOnList);

  //   const indexToRemove = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);

  //   if (addOnData.addOnId === 'AHPA' && indexToRemove !== -1) {
  //     this.isAHPAAdded = false;
  //     this.AHPARiskValue = '';
  //   }

  //   if (indexToRemove !== -1) {
  //     this.addOnList.splice(indexToRemove, 1);
  //   }


  //   reqData = {
  //     productType: this.formData['productType'],
  //     overAllSIAge: overAllSIAge,
  //     totalPremium: this.premiumAmountDetails,
  //     valueUnit: valueUnit,
  //     yearlyDiscount: [0, 7.5, 10],
  //     zoneDiscount: this.formData.productType == 'AF' || this.formData.productType == 'AA' || this.formData.productType == 'AO' || this.formData.productType == 'AC' || this.formData.productType == 'AGS' || this.formData.productType == 'STUB' || this.formData.productType == 'GHS' ? 0 : 9,
  //     memberDiscount: 0,
  //     addOnList: this.addOnList
  //   };

  //   if (this.formData['numberOfInsuredMembers'] > 1) {
  //     reqData.memberDiscount = 5;
  //   }

  //   console.log(reqData);


  //   this.yatraService.getAddOnPremium(reqData).pipe(
  //     // 1. Step: First process the API response
  //     tap((response:any) => {
  //       console.log(response);

  //       // Update tenure amounts
  //       for (let i = 0; i < response.calculatedValuesList.length; i++) {
  //         this.tenureAmount[i] = Math.round(response.calculatedValuesList[i]);
  //       }
  //       console.log('Updated tenureAmount:', this.tenureAmount, this.selectedIndex);

  //       // Set other lists
  //       this.taxList = response.taxList;
  //       this.netPremiumList = response.netPremiumList;
  //       this.totalPremiumList = response.totalPremiumList;
  //       this.indPremiumList = response.indPremiumList;
  //       this.addOnPremiumValueList = response.totalPremiumValue;

  //       // Set discount values
  //       const roundedDiscountValues = response.discountValueList.map((value: number) => Math.round(value));
  //     }),
  //     // 2. Step: Process the form controls after updating the tenureAmount
  //     tap(() => {
  //       this.form.formSections.forEach((section: any) => {
  //         section.formControls.forEach((formControl: any) => {
  //           if (formControl.name === 'totalPremium' && formControl.radioOptions) {
  //             formControl.radioOptions.forEach((option: any, index: number) => {
  //               const tenureAmount = this.tenureAmount[index];
  //               option.label = `<b>Rs - ${tenureAmount}</b>`;
  //               option.value = tenureAmount;

  //               if (index === 0) {
  //                 option.year = '1 year';
  //               } else if (index === 1) {
  //                 option.year = '2 years';
  //                 option.discount = '7.5% off';
  //               } else if (index === 2) {
  //                 option.year = '3 years';
  //                 option.discount = '10% off';
  //               }

  //               if (index === this.selectedIndex) {
  //                 this.dynamicFormGroup.value.totalPremium = tenureAmount;
  //               }
  //             });
  //           }
  //         });
  //       });
  //     }),
  //     // 3. Step: Process the add-on data
  //     concatMap(() => {
  //       let index = 0; // Initialize the index variable
  //       const addOnProcessing = Object.keys(addOnData).map((key: string) => {
  //         if (Array.isArray(addOnData[key])) {
  //           const addOnDataArray = addOnData[key].at(0);
  //           if (addOnDataArray.hasOwnProperty('addOnSumInsured')) {
  //             let reqData = {
  //               "optionalId": addOnData.addOnId,
  //               "si": addOnDataArray.addOnSumInsured,
  //               "optionalCoverName": addOnData.optionalCoverName,
  //               "optionalCoverValue": addOnData.optionalCoverValue,
  //               "premium": 0,
  //               "riskClass": ""
  //             };

  //             if (addOnData.addOnId === 'AHPA') {
  //               this.isAHPAAdded = true;
  //               const occupationRisk = JSON.parse(addOnDataArray.occupationRisk);
  //               this.AHPARiskValue = occupationRisk['value'];
  //               reqData = { ...reqData, riskClass: occupationRisk['value'] };
  //             }

  //             if (this.selectedIndex !== -1) {
  //               const addOnIndex = this.addOnList.findIndex((addOn: any) => addOn.optionalId === addOnData.addOnId);
  //               reqData.premium = this.addOnPremiumValueList[addOnIndex][index][this.selectedIndex];
  //             }

  //             if (this.addOnDetails[index]) {
  //               this.addOnDetails[index].push(reqData);
  //             }

  //             index++;
  //           }
  //         }
  //         return of(null); // Map to observable
  //       });
  //       return of(...addOnProcessing); // Return observables as a pipeline
  //     }),
  //     // 4. Step: Finalize AHPA if it's added
  //     tap(() => {
  //       if (this.isAHPAAdded) {
  //         this.addOnDetails.forEach((member: any) => {
  //           member.forEach((addOn: any) => {
  //             addOn.riskClass = this.AHPARiskValue;
  //           });
  //         });
  //       }
  //     })
  //   ).subscribe({
  //     next: () => {
  //       console.log('All operations completed successfully.');
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   });
  // }
  addOnRemoved(control: any, parentControl: any = null) {
    let addOnData = this.dynamicFormGroup.get(parentControl.name)?.value;
    console.log(addOnData);

    let modifiedInsuredMemberDetails = this.formData.insuredMemberDetails;
    console.log(modifiedInsuredMemberDetails);

    // Iterate over each member and remove the specified add-on from the covers
    modifiedInsuredMemberDetails.forEach((member: any) => {
      // Get the coverId (addOnId) to be removed
      const coverId = addOnData.addOnId;

      // Remove the add-on from the covers array by filtering it out
      member.covers = member.covers.filter((cover: any) => cover.coverId !== coverId);
    });

    // Call the getPremiumAmount method after removing the add-on
    // this.getPremiumAmount();
  }


  calculatePremiumPerype(insuredMembers: any): String {
    var premiumPerype = "";
    premiumPerype = insuredMembers.length + "A";
    return premiumPerype;
  }

  setProposerPincode() {
    if (this.formData.planType == 'Multi Individual' || this.formData.planType == 'Individual') {
      this.formData.insuredMemberDetails.forEach((member: any) => {
        if (member.relation == 'Self') {

          this.form.formSections.forEach((section: IFormSections) => {
            if (section.sectionTitle == 'Product Information') {
              section.formControls.forEach((control: IFormControl) => {
                if (control.name == 'proposerPincode') {
                  control.value = member.pincode;
                }
                if (control.name == 'proposerState') {
                  control.value = member.state;
                }
                if (control.name == 'proposerCity') {
                  control.value = member.city;
                }
              })
            }
          })
        }

      })

      if (this.dynamicFormGroup.get('proposerState')?.value == "") {
        const reqdata = {
          "pincode": this.dynamicFormGroup.get('proposerPincode')?.value
        }
        // this.commonService.getPinCodeByCity(reqdata).subscribe({
        //   next: (res) => {
        //     console.log(res)
        //     this.dynamicFormGroup.get('proposerCity')?.setValue(res.strcity);
        //     this.dynamicFormGroup.get('proposerState')?.setValue(res.strstate);
        //   },
        //   error: (err) => {
        //     console.error(err)
        //   }
        // });

      }
    }
    else if (this.formData.planType == 'Family Floater') {

      this.form.formSections.forEach((section: IFormSections) => {
        if (section.sectionTitle == 'Product Information') {
          section.formControls.forEach((control: IFormControl) => {
            if (control.name == 'proposerPincode') {
              control.value = this.formData.pincode;
            }
            if (control.name == 'proposerState') {
              control.value = this.formData.state;
            }
            if (control.name == 'proposerCity') {
              control.value = this.formData.city;
            }
          })
        }
      })
    }
  }

  getDependentControlValue(control: any) {
    console.log(control);

    const value = this.formData[control.dependentControls[0]];

    console.log(value);


    if (value && (typeof value == 'string') && (value.startsWith('{') && value.endsWith('}'))) {
      control.value = JSON.parse(value).value;
    }
    else
      control.value = value;
  }

  lastPageRedirect() {
    this.onSubmit();
    this.router.navigate(['products']);
  }

  setPremiumAmount(control?: any) {
    console.log(this.displayTaxList, this.selectedIndex, this.formData);
    this.tenureAmount.forEach(member => {
      console.log(member);

    })

    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name == 'totalPremium') {
          if (formControl.radioOptions) {
            formControl.radioOptions.forEach((option: any, index: number) => {
              if (index === 0) {
                // this.totalPremium = this.tenure1Total;
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                // formControl.value = this.tenureAmount[index];
                option.year = "1 year"
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                if (this.selectedIndex == index) {
                  this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
                  this.selectedIndex = index;
                  this.formData.tenure = this.selectedIndex + 1;
                }
                console.log(this.selectedIndex);
              } else if (index === 1) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "2 years"
                option.discount = "7.5% off"
                if (this.selectedIndex == index) {
                  this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
                  this.selectedIndex = index;
                  this.formData.tenure = this.selectedIndex + 1;
                }
              } else if (index === 2) {
                option.label = `<b>Rs - ${this.tenureAmount[index]}</b>`;
                section.toolTipText = `Tax: Rs ${this.displayTaxList[0]}`;
                option.value = this.tenureAmount[index];
                option.year = "3 years"
                option.discount = "10% off"
                if (this.selectedIndex == index) {
                  this.dynamicFormGroup.value.totalPremium = this.tenureAmount[index];
                  this.selectedIndex = index;
                  this.formData.tenure = this.selectedIndex + 1;
                }
              }
            });
          }
        }
      });
    });
  }

  mergeMember(control: any) {
    const a = Object.keys(this.formData.insuredMembers).filter(
      key => this.formData.insuredMembers[key] === true
    );
    control.value = a;
    console.log(control, this.formData, a);
  }
  mergeBbMember(control: any){
    const a = Object.keys(this.bbdetails.insuredMembers).filter(
      key => this.bbdetails.insuredMembers[key] === true
    );
    control.value = a;
    console.log(control, this.formData, a);
  }

  selectEditField(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == control.name) {
          controls.disabled = false
          console.log(controls);
        }
      });
    });
  }

  toggleSection(sectionTitle: string) {
    this.collapsedSections[sectionTitle] = !this.collapsedSections[sectionTitle];
  }

  isSectionCollapsed(sectionTitle: string): boolean {
    return !!this.collapsedSections[sectionTitle];
  }
  generateHeader(control: any, i: any) {
    // console.log(this.formData[control.name][i-1].relationshipType,control,i);
    const imagePath = JSON.parse(this.formData[control.name][i - 1].relationshipType)?.imagePath;
    // console.log(i,imagePath);
    return imagePath;
  }

  addOnMemberAdded(subControl: any, parentControl: any = null) {
    console.log(subControl, parentControl);

    if (parentControl != null) {
      let count = 0;
      let memberDetails = this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.value;
      console.log(memberDetails);

      Object.keys(memberDetails).forEach(key => {
        let memberArray = memberDetails[key];
        console.log(memberArray);

        // Check if memberCheckbox is false for any member and set other fields to empty
        let memberCheckbox = memberArray.find((member: any) => member.memberCheckbox === false);

        if (memberCheckbox) {
          memberArray.forEach((member: any) => {
            if (!member.memberCheckbox) {
              // Set other fields to empty if memberCheckbox is false
              Object.keys(member).forEach(memberKey => {
                console.log(memberKey);
                if (memberKey !== 'memberCheckbox') {
                  member[memberKey] = '';
                  console.log((this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray);
                  let memberArrayControl = (this.dynamicFormGroup.get(parentControl.name)?.get(subControl.name)?.get(key)) as FormArray;
                  let memberFormGroup = memberArrayControl.controls.find((group: AbstractControl) => {
                    return (group as FormGroup).get(memberKey)
                  }) as FormGroup;
                  let memberFormGroupControl = memberFormGroup.get(memberKey);
                  if (memberFormGroupControl) {
                    memberFormGroupControl.setValue('');
                  }

                }
              });
            }
          });
        } else {
          count++;
          console.log(subControl, parentControl);
          let dependentControls: string[] = [];
          let tempControlArray = (((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.get(subControl.name) as FormGroup)?.get(key) as FormArray);
          let breakFlag = false;
          this.form.formSections.forEach((section: IFormSections) => {
            if (breakFlag) return;
            section.formControls.forEach((control: IFormControl) => {
              if (breakFlag) return;
              if (control.name == parentControl.name && control.subControls) {
                control.subControls.forEach((subControl: ISubControl) => {
                  if (breakFlag) return;
                  if (subControl.innerSubControls) {
                    subControl.innerSubControls.forEach((innerSubControl: ISubControl) => {
                      if (breakFlag) return;
                      if (innerSubControl.name == key) {
                        innerSubControl.coreControls?.forEach((coreControl: ISubControl) => {
                          if (breakFlag) return;
                          if (coreControl.name == 'memberCheckbox' && coreControl.dependentControls) {
                            dependentControls = coreControl.dependentControls;
                          }
                          console.log(dependentControls);

                          let memberFormGroup = tempControlArray.controls.find((group: AbstractControl) => {
                            return (group as FormGroup).get(coreControl.name)
                          }) as FormGroup;
                          console.log(memberFormGroup);

                          let memberFormGroupControl = memberFormGroup.get(coreControl.name);
                          if (memberFormGroupControl?.value == '' && coreControl.type == 'text' && coreControl.name == 'addOnSumInsured') {
                            memberFormGroupControl.setValue(this.formData.sumInsured);
                          }
                          else if (memberFormGroupControl?.value == '') {

                            tempControlArray.controls.forEach((coreControlGroup: any) => {
                              Object.keys(coreControlGroup.controls).forEach((controlName: string) => {
                                const control = coreControlGroup.get(controlName);

                                if (control) {
                                  if (control.value === true) {
                                    // If the control's value is true, set it to false
                                    control.setValue(false);
                                  } else {
                                    // Set all other values to an empty string
                                    control.setValue('');
                                  }
                                }
                              });

                            })
                            breakFlag = true;
                            count--;
                          }

                          console.log(memberFormGroup);


                          // if{

                          // }
                        })
                      }
                    })
                  }
                })
              }
            })
          })
        }
      });

      console.log(memberDetails, count);

      console.log((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)
      // ?.controls[0].setValue(false);
      let control = this.dynamicFormGroup.get(parentControl.name) as FormGroup;
      if (control) {
        const firstKey = Object.keys((this.dynamicFormGroup.get(parentControl.name) as FormGroup)?.controls)[0];
        console.log(firstKey, count);
        // Get the first key
        if (count == 0) {
          control.controls[firstKey].setValue(false);
          this.addOnRemoved(subControl, parentControl)
        }
        else {
          control.controls[firstKey].setValue(true);
          this.changeOverLayDone(subControl, parentControl, true);
          this.addOnAdded(subControl, parentControl);
        }
      }

    }
    this.closeOverlay(subControl);




  }

  closeOverlay(subControl: any) {
    this.closePopUp();
    subControl.visible = false;
  }
  closePopUp() {
    this.isOverlayVisible = false;
  }

  changeOverLayDone(control: any, parentControl: any, changeValue: boolean = false) {

    this.form.formSections.forEach((section) => {
      section.formControls.forEach((controls: any) => {
        if (controls.name == 'recalculate') {
          controls.visible = true;
        }
        if (controls.name == 'next') {
          controls.visible = false;
        }
        if (controls.name == parentControl.name) {
          if (parentControl.subControls) {
            parentControl.subControls.forEach((subControl: any) => {
              if (subControl.innerSubControls) {
                subControl.innerSubControls.forEach((innerSubControl: any) => {
                  if (innerSubControl.name == 'doneButton') {
                    innerSubControl.disabled = changeValue;
                  }
                })
              }
            })
          }
        }
      })
    })
  }

  showOverlay(control: any) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        console.log(formControl, control);
        if (formControl.name == control.name && formControl.subControls) {
          formControl.subControls.forEach((subControl: any) => {
            if (subControl.name == 'addOnDetails') {
              subControl.visible = true;
            }
          })
        }
      })
    })
    this.openPopUp();
  }
  openPopUp() {
    this.isOverlayVisible = true;
  }
  verifyKYC(control: any) {
    const proposerDOB = this.dynamicFormGroup.get('memberDobProposer')?.value;
    const panNumber = this.dynamicFormGroup.get('panNo')?.value;

    const dobDate = new Date(proposerDOB);
    const formattedDOB = dobDate.getFullYear() + '-' +
      String(dobDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(dobDate.getDate()).padStart(2, '0');

    const reqData = {
      dateOfBirth: formattedDOB,
      panNumber: panNumber
    };
    console.log(reqData, this.dynamicFormGroup.value);

    

    this.yatraService.GetKycDetails(reqData).subscribe({
      next: (response: any) => {
        console.log('KYC details:', response);
        if (response.isSuccess == true) {
          this.toast.success({ detail: "Success", summary: "KYC Details Fetched Successfully", duration: 3000 });
          
          control.disabled = true;
          if (typeof response.data === 'object' && response.data !== null) {
            Object.keys(response.data).forEach((key: any) => {
              this.dynamicFormGroup.get(key)?.setValue(response.data[key])
              const insuredMemberDetailsControl = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;

              if (insuredMemberDetailsControl) {
                insuredMemberDetailsControl.controls.forEach((control: any) => {
                  if (control.get('relation')?.value === 'Self') {
                    // Set the value for the matching 'self' relation
                    control.get(key)?.setValue(response.data[key]);
                  }
                });
              }
              this.form.formSections.forEach((section: any) => {
                section.formControls.forEach((control: any) => {
                  if (control.name === key) {
                    control.disabled = true; // Disable the field in the JSON structure
                    control.value = response.data[key]; // Update the value in the JSON as well
                  }
                });
              });
            });
          }
        }
        else {
          this.toast.warning({ detail: "Warning", summary: "No Record Found", duration: 3000 });
        }
        // else {
        //   console.error('Expected response.data to be an object, but received:', response.data);
        // }
        // this.dynamicFormGroup.get('ckycNo')?.setValue(response.data.ckycNo);
      },
      error: (error) => {
        
        this.toast.warning({ detail: "Warning", summary: "Failed to fetch KYC Details", duration: 3000 });
        console.error('Error fetching KYC details:', error);
      }
    });
  }

  getPolicyDetails(control: any) {
    const policyNumberDetails = this.dynamicFormGroup.get('getPolicyNumber')?.value;
    const reqData = {
      policyNumber: policyNumberDetails
    };
    console.log(reqData);

    

    this.yatraService.GetCustomerDetailsViaPolicyNumber(reqData).subscribe({
      next: (response: any) => {
        console.log('Policy details:', response);
        this.toast.success({ detail: "Success", summary: "Policy Details Fetched Successfully", duration: 3000 });
        
        control.disabled = true;

        this.isPolicyDetailsFetch = true;
        console.log(this.dynamicFormGroup.value, this.form);

        console.log(this.dynamicFormGroup.get('insuredMembers'));

        if (response.data['insuredMemberDetails'].length > 0) {
          this.formData['insuredMemberDetails'] = response.data['insuredMemberDetails'];
          const insuredMembers: { [key: string]: boolean } = {};

          response.data['insuredMemberDetails'].forEach((member: any) => {
            insuredMembers[member.relation] = true; // Set as true
          });

          this.formData['insuredMembers'] = insuredMembers;
        }


        console.log(this.formData);


        Object.keys(response.data).forEach((key: string) => {
          this.dynamicFormGroup.get(key)?.setValue(response.data[key]);
          if (key == 'memberPolicyType') {
            this.form.formSections.forEach((section: any) => {
              const targetControl = section.formControls.find((formControl: any) => formControl.name === 'memberPolicyType');
              if (targetControl) {
                this.handlePolicyTypeChange(targetControl, response.data['memberPolicyTypeChange']);
              }
            });
          }
        })
      },
      error: (error) => {
        
        this.toast.warning({ detail: "Warning", summary: "Failed to fetch Policy Details", duration: 3000 });
        console.error('Error fetching Policy details:', error);
      }
    });
  }


  addDiseaseList(subControl?: any, control?: any) {
    console.log(this.dynamicFormGroup.value, this.form);
    if (this.isOverlayVisible) {
      this.isOverlayVisible = false;
    }
    else {
      this.isOverlayVisible = true;
    }
    console.log(subControl, control, this.form);
  }
  addNewDisease(subControl: any, control: any) {
    console.log(subControl, control);
    // if (subControl.innerArrayControl.length < 2) {
    //   const innerarrayControl = subControl.innerArrayControl[0]
    //   const firstKey = innerarrayControl.shift();  // This is the checkbox object
    //   console.log(innerarrayControl, firstKey);
    //   // Step 2: Group the checkbox with the rest of the controls in a new array
    //   const groupedControls = [
    //     [firstKey, ...innerarrayControl],  // First group with checkbox
    //     [...innerarrayControl]  // Second group without checkbox
    //   ];
    //   subControl.innerArrayControl = groupedControls;
    // }
    // else {
    //   subControl.innerArrayControl.push(subControl.innerArrayControl[1]);
    // }
    let tempControl = subControl.innerArrayControl[0].map((element: any) => ({ ...element }));

    subControl.innerArrayControl.push(tempControl);
    const controlNames = Object.keys((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls || {});
    const subName = controlNames.find(name => name === subControl.name);

    if (subName) {  // Check if abc is not undefined
      console.log(subName);
      // console.log(abc, (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[abc]);
      // const formArr = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[abc] as FormArray;
      let formArr = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subName] as FormArray;
      formArr.push(this.initializeDynamicFormControls(tempControl, subControl.innerArrayControl.length - 1));
      // formArr.push(this.initializeDynamicFormControls(subControl.innerArrayControl[0], subControl.innerArrayControl.length - 1));
    }
    console.log(this.dynamicFormGroup, this.dynamicFormGroup.get(control.name) as FormGroup);
    console.log(this.form);
  }
  removeDisease(subControl: any, control: any, index: any) {
    console.log(subControl, control, index, this.form, this.dynamicFormGroup.value);
    // 

    if (subControl.innerArrayControl.length > 1) {
      subControl.innerArrayControl?.splice(index, 1);
      let formArray = (this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subControl.name] as FormArray;
      formArray.removeAt(index - 1);
      Object.keys(this.formData).forEach(key => {
        if (key.startsWith(`${control.name}.${subControl.name}.${index - 1}.`)) {
          delete this.formData[key];
        }
        // if (key.includes(option.value)) {
        //   delete this.formData[key]
        // }
      });
      // setTimeout(() => { 
      //   // 
      // }, 0);
      // subControl.innerArrayControl.splice(index, 1);

      // ((this.dynamicFormGroup.get(control.name) as FormGroup)?.controls[subControl.name] as FormArray)?.removeAt(index);
      this.changeDetectorRef.detectChanges();
    }
    console.log(control, this.dynamicFormGroup.value, this.form);
  }
  copyText(control: any) {
    console.log(control);
    this.clipboard.copy(control);
    // this.messageService.add({severity:'success', summary: 'Success', detail: 'Text copied to clipboard!'});
  }


  async mappedFormDataFullQuote(formData: any): Promise<Partial<IFullQuoteMapping>> {
    const nomineeAge: any = await this.calculateAge(formData?.nomineeDob);
    console.log(formData);

    const mappedData: Partial<IFullQuoteMapping> = {
      agentCode: this.agentCode || '',
      productName: formData?.productName || '',
      productCode: formData?.productId || '',
      planCode: formData?.planCode || '',
      planName: formData?.productVariant || '',
      proposalNum: this.proposalNum || '',
      policyType: formData?.memberPolicyType || '',
      businessType: formData?.typeOfBusiness || '',
      insuredMemberDetails: formData?.insuredMemberDetails?.map((member: any, index: any) => {
        return {
          relation: member?.relation || '',
          memberrelationCode: this.jsonParse(member.relationshipType, 'id') || '',
          memberSalutation: formData[`insuredMemberDetails.${index}.preFix`] || '',
          firstName: member?.firstName || '',
          middleName: member?.middleName || '',
          lastName: member?.lastName || '',
          height: member?.height || '',
          heightInInches: formData[`insuredMemberDetails.${index}.heightInches`] || '',
          weight: member?.weight || '',
          memberdob: member?.memberdob || '',
          emailId: member?.emailId || '',
          mobileNumber: member?.mobileNumber || '',
          memberNationality: this.jsonParse(formData.nationality, 'name') || '',
          relationshipType: member.relation || '',
          memberAge: member?.memberAge || '',
          memberGender: member?.memberGender || '',
          memberPincode: member?.pincode || '',
          preExistingDisease: member?.preExistingDisease || '',
          memberIndex: formData[`insuredMemberDetails.${index}.memberIndex`],
          zone: member?.zone || '',
          state: member?.state || '',
          city: member?.city || '',
          memberType: member?.memberType || '',
          memberSumInsured: formData[`insuredMemberDetails.${index}.sumInsured`] || '',
          memberZone: member?.zoneValue || '',
          memberNatureOfDuty: formData[`insuredMemberDetails.${index}.productMemberNatureWork`] || '',
          memberDesignation: formData[`insuredMemberDetails.${index}.productMemberDesignation`] || '',
          memberOccupation: formData[`insuredMemberDetails.${index}.productMemberOccupation`] || '',
          covers: member?.covers || [],
          productQuestionnaire: formData[`insuredMemberDetails.${index}.productQuestionnaire`] || '',
          memberRoomCategory: ''
        };
      }) || [],
      CKYCNo: formData?.ckycNo || '',
      QuoteId: formData?.quoteId || '',
      LeadId: formData?.leadNumber || '',
      proposerSalutation: formData?.preFix || '',
      proposerFirstName: formData?.firstName || '',
      proposerMiddleName: formData?.middleName || '',
      proposerLastName: formData?.lastName || '',
      proposerDob: formData?.memberDobProposer || '',
      proposerAge: formData?.memberAgeProposer || '',
      proposerGender: formData?.proposerGender || '',
      proposerMobileNumber: formData?.mobileNumber || '',
      proposerWhatsAppNo: formData?.whatsappNo || formData?.mobileNumber,
      proposerAddress1: formData?.proposerAddress1 || '',
      proposerAddress2: formData?.proposerAddress2 || '',
      proposerCity: formData?.city || '',
      proposerState: formData?.state || '',
      proposerEmailId: formData?.emailId || '',
      proposerPincode: formData?.proposerPincode || '',
      idProof: this.jsonParse(formData?.idProof, 'value') || '',
      idNo: formData?.idNo || '',
      proposerAnnualIncome: formData?.annualIncome || '',
      proposerOccupation: this.jsonParse(formData?.occupation, 'value') || '',
      proposerEducation: this.jsonParse(formData?.educationDetails, 'id') || '',
      proposerPANNo: formData?.panNo || '',
      gstDetails: formData?.gstDetails || '',
      proposerMaritalStatus: this.jsonParse(formData?.maritalStatus, 'value') || '',
      ifPEP: formData?.isPep || '',
      proposerNationality: this.jsonParse(formData.nationality, 'name') || '',
      nomineeFirstName: formData?.nomineeFirstName || '',
      nomineeMidleName: formData?.nomineeMiddleName || '',
      nomineeLastName: formData?.nomineeLastName || '',
      nomineeRelation: this.jsonParse(formData?.nomineeRelationWithProposer, 'name') || '',
      nomineeRelationCode: this.jsonParse(formData?.nomineeRelationWithProposer, 'value') || '',
      nomineeContactNumber: formData?.nomineeContactNo || '',
      nomineeAddress: formData?.nomineeAddress || '',
      nomineeDob: formData?.nomineeDob || '',
      nomineeAge: nomineeAge || '',
      NameofAccountHolder: formData?.accountHolderName || '',
      accountNumber: formData?.accountNumber || '',
      accountType: formData?.accountType || '',
      bankCity: this.jsonParse(formData?.bankCity, 'name') || '',
      bankBranch: this.jsonParse(formData?.bankBranch, 'name') || '',
      paymentMode: this.selectedButton || '',
      chequeNumber: formData?.chequeNumber || '',
      chequeDate: formData?.chequeDate || '',
      bankName: this.jsonParse(formData?.bankName, 'name') || '',
      ifscCode: formData?.ifscCode || '',
      micrNo: formData?.micrCode || '',
      premiumAmount: formData?.totalPremium || '',
      selectedTenure: (parseInt(formData?.tenure)).toString() || '',
      paymentDate: new Date().toISOString().split("T")[0] as any || '',
      paymentCollectionMode: formData.paymentOption || '',
      paymentByRelationship: 'Self',
      payerName: formData?.accountHolderName || '',
      paymentBy: 'customer',
      PaymentGatewayName: formData?.PaymentGatewayName || ''
    };

    return mappedData;
  }

  jsonParse(string: any, extract: any) {
    const value = JSON.parse(string);
    return value[extract];
  }

  changeRecalculate(visiblility: boolean) {
    this.form.formSections.forEach((section: any) => {
      section.formControls.forEach((formControl: any) => {
        if (formControl.name == 'recalculate') {
          formControl.visible = visiblility;
        }
        if (formControl.name == 'next') {
          formControl.visible = !visiblility;
        }
      })
    })
  }

  redirectToCreateABHAID() {
    const abhaIDUrl = "https://mtpre.adityabirlahealth.com/healthinsurance/abha";
    window.open(abhaIDUrl, '_blank'); // Opens the URL in a new tab
  }

  setRating(star: number) {
    this.rating = star;
    // this.customerFeedbackForm.patchValue({ rating: this.rating }); // Update form with rating
    this.feedbackSubmit = true;
    this.impressedValues = true;
    if (star > 3) {
      this.impressedLable = 'What Impressed you ?';
      this.feedBackMessage = false;
    } else {
      this.impressedLable = 'Why aren\'t you happy?';
      this.feedBackMessage = true;
    }
  }
  submitFeedback() {
    let reqData: any = {};
    reqData.agentCode = this.agentCode;
    // reqData.rating = this.customerFeedbackForm.value.rating;
    // reqData.remarks = this.feedbackImpressedValue + ":" + this.customerFeedbackForm.value.message;
    reqData.customerId = "";
    this.yatraService.submitFeedback(reqData).subscribe((response) => {
      this.toast.success({ detail: 'Success', summary: 'Feedback submitted successfully! Thank you for your input.' });
    }, (error) => {
      this.toast.error({ detail: 'Error', summary: 'Failed to submit feedback. Please try again later.' });
    });
    // this.customerFeedbackModule.hide();
  }
  onSelectValue(value: String) {
    this.feedbackImpressedValue = value;
  }

  redirectToGooglePlay() {
    const googlePayUrl = "https://play.google.com/store/apps/details?id=com.adityabirlahealth.insurance&pcampaignid=web_share";
    window.open(googlePayUrl, '_blank');
  }

  redirectToAppStore() {
    const appleStoreUrl = "https://apps.apple.com/in/app/activ-health/id1179005764";
    window.open(appleStoreUrl, '_blank');
  }
  async mappingForQuestionnaire(form: any) {
    // console.log(controls);
    // let productQuestionnaire:any=[];
    console.log(this.formData, this.dynamicFormGroup.value, form);
    const dynamicValue = this.dynamicFormGroup.value;
    console.log(dynamicValue);
    // Iterate through each member in the insuredMemberDetails
    await this.formData.insuredMemberDetails.forEach((member: any) => {
      delete member.productQuestionnaire;
    })
    console.log(this.formData);
    await form.formSections.forEach((section: any) => {

      section.formControls.forEach((controls: any) => {
        if (controls.type == 'questionnaire') {
          this.formData.insuredMemberDetails.forEach((member: any, index: any) => {
            // Initialize the optionsArray for each member
            const productQuestionnaire: any[] = [];

            console.log(this.formData.insuredMemberDetails[index], member);

            const optionsArray: any[] = [];
            let questionId: any;
            let questionName: any
            // Find the matching control based on member's relation
            const matchingControl = controls.subControls.find((subControl: any) =>
              subControl.name === member.relation
            );
            questionId = controls.idProperty;
            questionName = controls.name;
            console.log(matchingControl);
            // If a matching control is found
            if (matchingControl) {
              // Iterate through innerArrayControl to find the control with name 'dName'
              matchingControl.innerArrayControl[0].forEach((innerControl: any) => {
                // Check if innerControl has a dName property
                console.log(innerControl);
                // innerControl.forEach((inner:any) => {
                if (innerControl && innerControl.name === 'diseaseName') {
                  // Check if options exist in innerControl
                  if (innerControl.options) {
                    // Push options into the optionsArray
                    optionsArray.push(...innerControl.options);
                  }
                }
                // })
              });
            }
            console.log(optionsArray);
            // Initialize the productQuestionnaire array for the current member

            // Iterate through the dynamicValue object
            Object.keys(dynamicValue).forEach((item: any) => {
              if (questionName == item && dynamicValue[item] != null && typeof dynamicValue[item] === 'object') {
                const innerValue = dynamicValue[item];

                // Iterate through the keys of the inner object
                Object.keys(innerValue).forEach((subItem: any) => {
                  // Check if the member's relation matches the current subItem
                  if (member.relation === subItem) {
                    console.log(subItem, innerValue[subItem]);

                    // Iterate through the array related to the matched subItem
                    innerValue[subItem].forEach((innerArray: any) => {
                      console.log(typeof (Number(innerArray.subQuestionCode)), typeof (innerArray.subQuestionCode));
                      innerArray.parentQuestionCode = questionId;
                      if (!innerArray.hasOwnProperty('subQuestionCode')) {
                        innerArray.subQuestionCode = "";
                      }
                      console.log(innerArray);

                      if (innerArray.diseaseName) {
                        // If optionsArray is not empty, find the corresponding option
                        if (optionsArray.length > 0) {
                          const newOption = optionsArray.find((option: any) => option.value === innerArray.diseaseName);
                          console.log(innerArray, newOption);

                          // Set subQuestionCode and dName based on the found option
                          if (newOption) {
                            innerArray.subQuestionCode = newOption.value;
                            innerArray.diseaseName = newOption.name;
                          }
                        }
                        // else {
                        //     // If optionsArray is empty, set subQuestionCode to an empty string
                        //     innerArray.subQuestionCode = "";
                        // }
                        // Push the innerArray to productQuestionnaire
                      }
                      // else {
                      //     // If no dName, push the innerArray as is
                      //     productQuestionnaire.push(innerArray);
                      // }
                      productQuestionnaire.push(innerArray);
                      console.log(productQuestionnaire);
                    });
                  }
                });

                console.log(item, dynamicValue[item], typeof item, typeof dynamicValue[item]);
              }
            });

            // Assign the populated productQuestionnaire to the member
            console.log(this.formData.insuredMemberDetails[index], member);
            if (member.productQuestionnaire) {
              member.productQuestionnaire = member.productQuestionnaire.concat(productQuestionnaire);
            }
            else {
              member.productQuestionnaire = productQuestionnaire;
            }
            // Log the final productQuestionnaire for debugging
            console.log(member.productQuestionnaire);
          });
        }
      })
    })
    this.formData.insuredMemberDetails.forEach((member: any) => {
      member.productQuestionnaire = JSON.stringify(member.productQuestionnaire);
      this.flattenObjectInsert(this.formData);
    })
    console.log(this.formData, this.dynamicFormGroup.value, this.form);
  }
  getBbRelations(control: any){
    if(this.formSequence[this.getFormIndexValue()].formName == "Add Nominee" || this.formSequence[this.getFormIndexValue()].formName == "Nominee Details" || this.formSequence[this.getFormIndexValue()].formName == "Nominee & Bank Details" || this.formSequence[this.getFormIndexValue()].formName == "Customer Summary" ){
      this.yatraService.getRelations().subscribe({
        next: (response: any) => {
          response = JSON.parse(response.data).data;
          this.nomineeRelations = response;
          console.log(this.nomineeRelations);
          this.nomineeRelations = this.nomineeRelations.relationShipModels;
          this.nomineeRelations.map((item: any) => {
              item.name = item.relationName.charAt(0).toUpperCase() + item.relationName.slice(1);
              item.value = item.relationName;
          })
          this.nomineeRelations = this.nomineeRelations.sort((a: any, b: any) => a.name.localeCompare(b.name))
          control.options = this.nomineeRelations;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
  getTsLob(control: any){
    this.rugService.getLobDetails().subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        console.log(res)
        res.allManageLobs.map((item: any) => {
          item.value = item.lobName,
            item.name = item.lobName
        })
        control.options = res.allManageLobs;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  changePincode(control: any){
    console.log(control.name);//"proposerPincode"
    let pincodeObj = {
      pinCode: this.bbdetails.proposerPincode
    }
    if(this.dynamicFormGroup.get('proposerPincode')?.value){
      pincodeObj.pinCode = this.dynamicFormGroup.get('proposerPincode')?.value
    }

    this.rugService.getDataPincodeDetails(pincodeObj).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        console.log(res)
        this.dynamicFormGroup.get('proposerCity')?.setValue(res.pincodeDetails.city);
        this.dynamicFormGroup.get('proposerState')?.setValue(res.pincodeDetails.state);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getAllDisposition(control: any){
    this.rugService.getDispositions().subscribe({
      next: (res: any) => {
        console.log(res)
        res = JSON.parse(res.data).data
        console.log(res);
        this.dispositionList = res.allDisposition;
        res.allDisposition.map((item: any) => {
          item.value = item.dispositionId,
            item.name = item.dispositionName
        })
        // this.dispositionOptions = this.agentCode == "467896" ? res.allDisposition.filter((item:any)=>item.dispositionId!=9) : res.allDisposition.filter((item:any)=>item.dispositionId!=6);

        // control.options = this.agentCode == "467896" ? res.allDisposition.filter((item:any)=>item.dispositionId!=9) : res.allDisposition.filter((item:any)=>item.dispositionId!=6);
        control.options = res.allDisposition;

      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getSubDisposition(control: any){
    console.log(control.name);
    console.log(this.dynamicFormGroup.get('disposition')?.value);
    let dispositionObj = {
      dispositionId: this.dynamicFormGroup.get('disposition')?.value
    }
    this.rugService.getAllSubDispositions(dispositionObj).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        console.log(res)
        this.subDispositionList = res.allSubDisposition;
        res.allSubDisposition.map((item: any) => {
          item.value = item.subDispositionId,
            item.name = item.subDispositionName
        })
        this.form.formSections.forEach(section => {
          section.formControls.forEach(control => {
          console.log(control.name);
          if(control.name == "subDisposition"){
            control.options = res.allSubDisposition;
            this.dynamicFormGroup.get('subDisposition')?.setValue(res.allSubDisposition[0].value);
          }
          })
        })

      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  changeSubDisposition(control: any){
    console.log(control);
  }
  getTsSumInsured(control: any) {
    console.log(this.tsDetails);
    let filterArr;
    let sumInsuredObj = {
      ProductCode: this.tsDetails.productCode
    }
    this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        // res.productSIDetails.map((item: any) => {
        //   item.value = item.siPlanValue.split('.')[0],
        //     item.name = item.siPlanValue.split('.')[0]
        // })
        if(this.bbdetails.productCode != "T04"){
          res.productSIDetails.map((item: any) => {
            item.value = item.siPlanValue.split('.')[0],
              item.name = item.siPlanValue.split('.')[0]
          })
        }else{
          res.productSIDetails.map((item: any) => {
            item.value = item.siPlanValue.split('.')[0],
              item.name = item.siPlanText
          })
        }
        this.sumInsuredData = res.productSIDetails;
        control.options = res.productSIDetails;
        console.log(this.dynamicFormGroup.get('sumInsured')?.setValue(this.sumInsuredData[0].value));
        this.dynamicFormGroup.get('sumInsured')?.setValue(this.sumInsuredData[0].value)

        filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.get('sumInsured')?.value)
        console.log(filterArr);
        this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
        this.bbdetails.sumInsured = this.dynamicFormGroup.get('sumInsured')?.value;
        this.getTSPremium(filterArr);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getBbSumInsured(control: any) {
    console.log(this.bbdetails);
    let filterArr;
    let sumInsuredObj = {
      ProductCode: this.bbdetails.productCode
    }
    this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        if(this.bbdetails.productCode != "R10"){
          res.productSIDetails.map((item: any) => {
            item.value = item.siPlanValue.split('.')[0],
              item.name = item.siPlanValue.split('.')[0]
          })
        }else{
          res.productSIDetails.map((item: any) => {
            item.value = item.siPlanValue.split('.')[0],
              item.name = item.siPlanText
          })
        }
        this.sumInsuredData = res.productSIDetails;
        control.options = res.productSIDetails;
        if (this.formSequence[this.getFormIndexValue()].formName != "Customer Summary") {
          console.log(this.dynamicFormGroup.get('sumInsured')?.setValue(this.sumInsuredData[0].value));
          this.dynamicFormGroup.get('sumInsured')?.setValue(this.sumInsuredData[0].value)

          filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.get('sumInsured')?.value)
          console.log(filterArr);
          this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
          if (this.bbdetails.productCode != "R10") {
            this.bbdetails.sumInsured = this.dynamicFormGroup.get('sumInsured')?.value;
          } else {
            this.bbdetails.sumInsured = filterArr[0].siPlanText;
          }
          if(this.formSequence[this.getFormIndexValue()].formName != "Customer Summary"){
            this.getBbPremium(filterArr);
          }
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.yatraService.getProductCombinations().subscribe({
      next: (res: any) => {
        console.log(this.aesEncryptionService.axisDecrypt(res.encrypted_Response));
        this.productCombinationData = this.aesEncryptionService.axisDecrypt(res.encrypted_Response);
        this.productCombinationData = this.productCombinationData.productCombinationModel;
        console.log(this.productCombinationData);
      },
      error: (err) => {
        console.error(err);
      }
    });
    let obj = {
      IsMinor: true,
      SIGroupId: 6,
      PlanSID: 22
    }
    this.yatraService.getPremiumData(obj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data).data
        this.bbPremiumData = res.premium;
        console.log(this.bbPremiumData);

      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getD2CSumInsured(control: any) {
    let filterArr;
    let sumInsuredObj = {
      ProductCode: this.productId == '7' ?  "D01" : this.productId == '8' ? "D02" : this.productId == '31' ? "D03" : "D04"
    }
    this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data
        res.productSIDetails.map((item: any) => {
          item.value = item.siPlanValue.split('.')[0],
            item.name = item.siPlanValue.split('.')[0]
        })
        this.sumInsuredData = res.productSIDetails;
        control.options = res.productSIDetails;
         this.dynamicFormGroup.get('sumInsured')?.setValue(this.sumInsuredData[0].value)

        filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.get('sumInsured')?.value)
        console.log(filterArr);
        this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
        this.d2cDetails.sumInsured = this.dynamicFormGroup.get('sumInsured')?.value;
        if(this.bbdetails.productCode != "R10"){
          this.bbdetails.sumInsured = this.dynamicFormGroup.get('sumInsured')?.value;
        }else{
          this.bbdetails.sumInsured = filterArr[0].siPlanText;
        }
        this.getD2CPremium(filterArr);
      },
      error: (err) => {
        console.error(err);
      }
    });

    // this.yatraService.getProductCombinations().subscribe({
    //   next: (res: any) => {
    //     res = JSON.parse(res.data)
    //     this.productCombinationData = res.productCombinationModel;
    //     console.log(this.productCombinationData);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });

  }
  async changeD2CSumInsured(event: any) {
    if(this.productId == '8'){

      this.updatePlansBasedOnSumInsured();
    }
    console.log(this.sumInsuredData);
    console.log(this.dynamicFormGroup.value.sumInsured);
    let filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
    console.log(filterArr);
    // this.yatraService.policyDetails.groupCode = filterArr[0].groupCode;
    // this.yatraService.policyDetails.productPlanName = "GHI,GP";
    // this.yatraService.policyDetails.productPlanCode = filterArr[0].siPlanId.toString();
    // if(this.sumInsuredData == undefined){
    //   let sumInsuredObj = {
    //     ProductCode: this.bbdetails.productCode
    //   }
    //   await this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
    //     next: (res: any) => {
    //       res = JSON.parse(res.data).data
    //       res.productSIDetails.map((item: any) => {
    //         item.value = item.siPlanValue.split('.')[0],
    //           item.name = item.siPlanValue.split('.')[0]
    //       })
    //       this.sumInsuredData = res.productSIDetails;
    //       filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
    //       console.log(filterArr);
    //       this.calculateD2CPremium()
    //     },
    //     error: (err) => {
    //       console.error(err);
    //     }
    //   });
    // }else{
    //   filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
    //   console.log(filterArr);
    //   this.calculateD2CPremium()
    // }
    this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
    // this.yatraService.policyDetails.groupCode = filterArr[0].groupCode;
    // this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
    // this.yatraService.policyDetails.productPlanName = "GHI,GP";
    this.dynamicFormGroup.get('productPlanCode')?.setValue(filterArr[0].siPlanId.toString());
    if (this.formSequence[0].formName == "Know Your Premium" || this.formSequence[0].formName == "Minor Details") {
      let obj = {
        IsMinor: true,
        SIGroupId: filterArr[0].siGroupId,
        PlanSID: filterArr[0].siPlanId
      }
      this.yatraService.getPremiumData(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.bbPremiumData = res.premium;
          this.calculateD2CPremium()
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  async changeBbSumInsured(event: any) {
    console.log(this.sumInsuredData);
    console.log(this.dynamicFormGroup.value.sumInsured);
    console.log(this.bbdetails);
    let filterArr;
    
    if(this.sumInsuredData == undefined){
      let sumInsuredObj = {
        ProductCode: this.bbdetails.productCode
      }
      await this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
        next: (res: any) => {
          res = JSON.parse(res.data).data
          // res.productSIDetails.map((item: any) => {
          //   item.value = item.siPlanValue.split('.')[0],
          //     item.name = item.siPlanValue.split('.')[0]
          // })
          if(this.bbdetails.productCode != "R10"){
            res.productSIDetails.map((item: any) => {
              item.value = item.siPlanValue.split('.')[0],
                item.name = item.siPlanValue.split('.')[0]
            })
          }else{
            res.productSIDetails.map((item: any) => {
              item.value = item.siPlanValue.split('.')[0],
                item.name = item.siPlanText
            })
          }
          this.sumInsuredData = res.productSIDetails;
          filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
          console.log(filterArr);
          if(this.bbdetails.productCode != "R10"){
            this.bbdetails.sumInsured = this.dynamicFormGroup.value.sumInsured;
          }else{
            this.bbdetails.sumInsured = filterArr[0].siPlanText;
          }
          this.getBbPremium(filterArr);
          this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
          this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
          this.dynamicFormGroup.get('productPlanCode')?.setValue(filterArr[0].siPlanId.toString());
        },
        error: (err) => {
          console.error(err);
        }
      });
    }else{
      filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
      console.log(filterArr);
      if(this.bbdetails.productCode != "R10"){
        this.bbdetails.sumInsured = this.dynamicFormGroup.value.sumInsured;
      }else{
        this.bbdetails.sumInsured = filterArr[0].siPlanText;
      }
      this.getBbPremium(filterArr);
      this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filterArr[0].siPlanId.toString());
    }

  }
  async changeTsSumInsured(event: any) {
    console.log(this.sumInsuredData);
    console.log(this.dynamicFormGroup.value.sumInsured);
    console.log(this.tsDetails);
    let filterArr;
    
    if(this.sumInsuredData == undefined){
      let sumInsuredObj = {
        ProductCode: this.tsDetails.productCode
      }
      await this.yatraService.getSumInsuredDetails(sumInsuredObj).subscribe({
        next: (res: any) => {
          res = JSON.parse(res.data).data
          // res.productSIDetails.map((item: any) => {
          //   item.value = item.siPlanValue.split('.')[0],
          //     item.name = item.siPlanValue.split('.')[0]
          // })
          if(this.bbdetails.productCode != "T04"){
            res.productSIDetails.map((item: any) => {
              item.value = item.siPlanValue.split('.')[0],
                item.name = item.siPlanValue.split('.')[0]
            })
          }else{
            res.productSIDetails.map((item: any) => {
              item.value = item.siPlanValue.split('.')[0],
                item.name = item.siPlanText
            })
          }
          this.sumInsuredData = res.productSIDetails;
          filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
          console.log(filterArr);
          this.bbdetails.sumInsured = this.dynamicFormGroup.value.sumInsured;
          this.getTSPremium(filterArr);
          this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
          this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
          this.dynamicFormGroup.get('productPlanCode')?.setValue(filterArr[0].siPlanId.toString());
        },
        error: (err) => {
          console.error(err);
        }
      });
    }else{
      filterArr = this.sumInsuredData.filter((obj: any) => obj.value == this.dynamicFormGroup.value.sumInsured)
      console.log(filterArr);
      this.bbdetails.sumInsured = this.dynamicFormGroup.value.sumInsured;
      this.getTSPremium(filterArr);
      this.dynamicFormGroup.get('groupCode')?.setValue(filterArr[0].groupCode);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GP");
      this.dynamicFormGroup.get('productPlanCode')?.setValue(filterArr[0].siPlanId.toString());
    }
  }
  changeBbInsuredMembers(control: any){
    console.log(control);
  }
  getTSPremium(filterArr: any){
    // if (this.formSequence[0].formName == "Group Health Insurance + Group Protect") {
      let obj = {
        IsMinor: true,
        SIGroupId: filterArr[0].siGroupId,
        PlanSID: filterArr[0].siPlanId
      }
      this.yatraService.getPremiumData(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.bbPremiumData = res.premium;
          this.calculateTSPremium()
        },
        error: (err) => {
          console.error(err);
        }
      });
    // }
  }
  getBbPremium(filterArr: any){
    // if (this.formSequence[0].formName == "Group Health Insurance + Group Protect") {
      let obj = {
        IsMinor: true,
        SIGroupId: filterArr[0].siGroupId,
        PlanSID: filterArr[0].siPlanId
      }
      this.yatraService.getPremiumData(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.bbPremiumData = res.premium;
          this.calculateBBPremium()
        },
        error: (err) => {
          console.error(err);
        }
      });
    // }
  }
  getD2CPremium(filterArr: any){
    // if (this.formSequence[0].formName == "Group Health Insurance + Group Protect") {
      let obj = {
        IsMinor: true,
        SIGroupId: filterArr[0].siGroupId,
        PlanSID: filterArr[0].siPlanId
      }
      this.yatraService.getPremiumData(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data).data
          this.bbPremiumData = res.premium;
          this.calculateD2CPremium()
        },
        error: (err) => {
          console.error(err);
        }
      });
    // }
  }

  calculateD2CPremium() {
    if(this.productId == 31){
      // if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA"){
      // const filteredData = premiumObj.filter(
      //   (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA"
      // );
      // console.log(filteredData);
      this.d2cDetails.ghiPremium = this.bbPremiumData[0].premium.toString();
      this.d2cDetails.gpaPremium = this.bbPremiumData[1].premium.toString();
      this.d2cDetails.productPlanName = "GHI,GPA";
      this.d2cDetails.totalPremium = (this.bbPremiumData[0].premium + this.bbPremiumData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('ghiPremium')?.setValue(this.bbPremiumData[0].premium.toString());
      this.dynamicFormGroup.get('gpaPremium')?.setValue(this.bbPremiumData[1].premium.toString());
      this.dynamicFormGroup.value.totalPremium = (this.bbPremiumData[0].premium + this.bbPremiumData[1].premium).toFixed(2);
      this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
      this.dynamicFormGroup.get('productPlanCode')?.setValue(this.bbPremiumData[0].planSID);
      this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA");
      this.dynamicFormGroup.get('familyConstruct')?.setValue('1C');
      this.dynamicFormGroup.get('familyConstructId')?.setValue(7);
      let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
      if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
        return ele;
      }
      });
      this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);
    // }
      // this.bbPremiumData.
    }else{
      this.premiumArray = []
      let memberDob: any;
      let premiumObj;
      let memberRelation;
      let familyConstruct = 1;
      let selfDob;
      let spouseDob;
      let sortedArray: any[] = []
      const sinsuredMembersArray = this.dynamicFormGroup.get('insuredMemberDetails') as FormArray;
      sinsuredMembersArray.controls.forEach((memberControl: any, i: any) => {
        const memberGroup = sinsuredMembersArray.at(i) as FormGroup;
  
        console.log(memberGroup);
        memberDob = sinsuredMembersArray.at(i).get('dob')?.value;
      memberRelation = sinsuredMembersArray.at(i).get('relation')?.value;
        if (memberRelation == "Self") {
          selfDob = sinsuredMembersArray.at(i).get('dob')?.value
        }
        if (memberRelation == "Spouse") {
          familyConstruct = 2
          spouseDob = sinsuredMembersArray.at(i).get('dob')?.value
        }
        console.log('member Relationship Type:', memberRelation);
        console.log('member dob:', memberDob);
        if (!sortedArray.includes(memberRelation)) {
          sortedArray.push(memberRelation);
        } else {
          console.log(`${memberRelation} is already in the array.`);
        }
      });
      console.log(this.familyConstructsData);
      console.log(sortedArray);
      console.log(sortedArray.length);
      if(sortedArray.length == 1 && sortedArray.includes('Self')){
        familyConstruct = 1
      }else if(sortedArray.length == 2 && sortedArray.includes('Self') && sortedArray.includes('Spouse')){
        familyConstruct = 2
      }else if(sortedArray.length == 2 && sortedArray.includes('Self') && !sortedArray.includes('Spouse')){
        familyConstruct = 5
      }else if(sortedArray.length == 3 && sortedArray.includes('Self') && !sortedArray.includes('Spouse')){
        familyConstruct = 6
      }else if(sortedArray.length == 3 && sortedArray.includes('Self') && sortedArray.includes('Spouse')){
        familyConstruct = 3
      }else{
        familyConstruct = 4
      }
      console.log(familyConstruct);
      // this.yatraService.policyDetails.familyConstructId = familyConstruct.toString();
      let filteredFamilyConstruct = this.familyConstructsData.filter((item: any) => item.familyConstructID === familyConstruct.toString());
      console.log(filteredFamilyConstruct);
      // this.yatraService.policyDetails.familyConstruct = filteredFamilyConstruct[0].displayText;
      let ageRange = this.returnAgeRange(familyConstruct, spouseDob, selfDob)
      console.log(ageRange);
      console.log(this.dynamicFormGroup.value, this.dynamicFormGroup, this.form);
      console.log(this.bbPremiumData)
      this.familyConstruct = familyConstruct;
      // premiumObj = this.bbPremiumData.filter((ele: any) => {
      //   return (ele.familyConstructId == this.familyConstruct)
      // })
  
  
      this.dynamicFormGroup.get('familyConstruct')?.setValue(filteredFamilyConstruct[0].displayText);
      this.dynamicFormGroup.get('familyConstructId')?.setValue(filteredFamilyConstruct[0].familyConstructID);
  
      premiumObj = this.bbPremiumData.filter((ele: any) => {
        return ((ele.ageRange == ageRange && ele.familyConstructId == this.familyConstruct) || (ele.familyConstructId == (this.familyConstruct == "6" || this.familyConstruct == "5" || this.familyConstruct == "1" ? "1" : "2") && ele.combinationName == 'GPA')) || (ele.familyConstructId == (this.familyConstruct == "6" || this.familyConstruct == "5" || this.familyConstruct == "1" ? "1" : "2") && ele.ageRange == ageRange && ele.combinationName == 'GCI') || (ele.familyConstructId == this.familyConstruct && ele.combinationName == 'GP')
      })
      let orderOfPremium = ['GHI', 'GPA', 'GCI', 'GHI-5L', 'GHI-10L', 'GP']
      for(let i = 0; i <= orderOfPremium.length; i++){
  
        premiumObj.forEach((ele: any) => {
          if(ele.combinationName == orderOfPremium[i]){
            this.premiumArray.push(ele)
          }
        })
      }
      console.log(premiumObj);
      if(this.productId == 30){
        this.d2cDetails.gpaPremium = premiumObj[0].premium.toString();
        this.d2cDetails.gciPremium = premiumObj[1].premium.toString();
        this.d2cDetails.productPlanName = "GPA,GCI";
        this.d2cDetails.totalPremium = (premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
        this.dynamicFormGroup.get('ghiPremium')?.setValue(null);
        this.dynamicFormGroup.get('gpaPremium')?.setValue(premiumObj[0].premium.toString());
        this.dynamicFormGroup.get('gciPremium')?.setValue(premiumObj[1].premium.toString());
        this.dynamicFormGroup.value.totalPremium = (premiumObj[0].premium + premiumObj[1].premium).toFixed(2);
        this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
        this.dynamicFormGroup.get('productPlanCode')?.setValue(premiumObj[0].planSID);
        this.dynamicFormGroup.get('productPlanName')?.setValue("GPA,GCI");
        let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
        if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
          return ele;
        }
        });
        this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
      }else{
        if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI"){
          const filteredData = premiumObj.filter(
            (item: any) => item.combinationName === "GHI"
          );
          console.log(filteredData);
          this.d2cDetails.ghiPremium = filteredData[0].premium.toString();
          this.d2cDetails.productPlanName = "GHI";
          this.d2cDetails.totalPremium = (filteredData[0].premium).toFixed(2);
          this.d2cDetails.ghiPremium = filteredData[0].premium.toString();
        this.d2cDetails.productPlanName = "GHI";
        this.d2cDetails.totalPremium = (filteredData[0].premium).toFixed(2);
        this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
          // this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[1].premium.toString());
          this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium).toFixed(2);
          this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
          this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);      
          this.dynamicFormGroup.get('productPlanName')?.setValue("GHI");
          let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
            if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
              return ele;
            }
            });
            this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
            this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);
        }
        if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA"){
          const filteredData = premiumObj.filter(
            (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA"
          );
          console.log(filteredData);
          this.d2cDetails.ghiPremium = filteredData[0].premium.toString();
          this.d2cDetails.gpaPremium = filteredData[1].premium.toString();
          this.d2cDetails.productPlanName = "GHI,GPA";
          this.d2cDetails.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);      this.d2cDetails.ghiPremium = filteredData[0].premium.toString();
        this.d2cDetails.gpaPremium = filteredData[1].premium.toString();
        this.d2cDetails.productPlanName = "GHI,GPA";
        this.d2cDetails.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
          this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
          this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[1].premium.toString());
          this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium).toFixed(2);
          this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
          this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
          this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA");
          let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
          if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
            return ele;
          }
          });
          this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
          this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);
        }
        if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI+GPA+GCI"){
          const filteredData = premiumObj.filter(
            (item: any) => item.combinationName === "GHI" || item.combinationName === "GPA" || item.combinationName === "GCI"
          );
          console.log(filteredData);
          this.d2cDetails.ghiPremium = filteredData[0].premium.toString();
          this.d2cDetails.gciPremium = filteredData[1].premium.toString();
          this.d2cDetails.gpaPremium = filteredData[2].premium.toString();
          this.d2cDetails.productPlanName = "GHI,GPA,GCI";
          this.d2cDetails.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
          this.d2cDetails.ghiPremium = filteredData[0].premium.toString();
        this.d2cDetails.gpaPremium = filteredData[1].premium.toString();
        this.d2cDetails.gciPremium = filteredData[2].premium.toString();
        this.d2cDetails.productPlanName = "GHI,GPA,GCI";
        this.d2cDetails.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
        this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
          this.dynamicFormGroup.get('gciPremium')?.setValue(filteredData[1].premium.toString());
          this.dynamicFormGroup.get('gpaPremium')?.setValue(filteredData[2].premium.toString());
          this.dynamicFormGroup.value.totalPremium = (filteredData[0].premium + filteredData[1].premium + filteredData[2].premium).toFixed(2);
          this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
          this.dynamicFormGroup.get('productPlanCode')?.setValue(filteredData[0].planSID);
          this.dynamicFormGroup.get('productPlanName')?.setValue("GHI,GPA,GCI");
          let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
            if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.D2CproductCode){
              return ele;
            }
            });
            this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
            this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);
        }
        if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI-5L"){
          const filteredData = premiumObj.filter(
            (item: any) => item.combinationName === "GHI" || item.combinationName === "GHI-5L"
          );
          console.log(filteredData);
          this.d2cDetails.deductibleAmount = filteredData[1].premium.toString();
          this.d2cDetails.productPlanName = "GHI-5L";
          this.d2cDetails.totalPremium = (filteredData[1].premium).toFixed(2);
          this.d2cDetails.deductibleAmount = filteredData[1].premium.toString();
          this.d2cDetails.productPlanName = "GHI-5L";
          this.d2cDetails.totalPremium = (filteredData[1].premium).toFixed(2);
          this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
          this.dynamicFormGroup.get('deductibleAmount')?.setValue(filteredData[1].premium.toString());
          this.dynamicFormGroup.value.totalPremium = (filteredData[1].premium).toFixed(2);
          this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
          this.dynamicFormGroup.get('productPlanName')?.setValue("GHI-5L");
          let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
            if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
              return ele;
            }
            });
            this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
          this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);
    
    
        }else if(this.dynamicFormGroup.get('planAvailable')?.value == "GHI-10L"){
          const filteredData = premiumObj.filter(
            (item: any) => item.combinationName === "GHI" || item.combinationName === "GHI-10L"
          );
          console.log(filteredData);
          console.log(this.dynamicFormGroup.get('sumInsured')?.value);
          if(this.dynamicFormGroup.get('sumInsured')?.value == '10000000'){
            this.d2cDetails.deductibleAmount = filteredData[1].premium.toString();
            this.d2cDetails.productPlanName = "GHI-10L";
            this.d2cDetails.totalPremium = (filteredData[1].premium).toFixed(2);
            this.d2cDetails.deductibleAmount = filteredData[1].premium.toString();
            this.d2cDetails.productPlanName = "GHI-10L";
            this.d2cDetails.totalPremium = (filteredData[1].premium).toFixed(2);
            this.dynamicFormGroup.get('ghiPremium')?.setValue(filteredData[0].premium.toString());
            this.dynamicFormGroup.get('gpaPremium')?.setValue(null);
      
            this.dynamicFormGroup.get('deductibleAmount')?.setValue(filteredData[1].premium.toString());
            this.dynamicFormGroup.value.totalPremium = (filteredData[1].premium).toFixed(2);
            this.dynamicFormGroup.get('totalPremium')?.setValue(this.dynamicFormGroup.value.totalPremium);
            this.dynamicFormGroup.get('productPlanName')?.setValue("GHI-10L");
            let selectedCombiID = this.productCombinationData?.filter((ele: any) => {
              if((ele.productCombination).replace(/\+/g, ",") == this.dynamicFormGroup.get('productPlanName')?.value && ele.productCode == this.bbdetails.productCode){
                return ele;
              }
              });
              this.dynamicFormGroup.get('combiId')?.setValue(selectedCombiID[0]?.combiId?.toString())
          }else{
            this.dynamicFormGroup.get('planAvailable')?.setValue('GHI');
            this.toast.warning({ detail: "Warning", summary: "Please select Sum Insured as 1CR", duration: 3000 });
            this.calculateD2CPremium();
          }
          this.updateValidators(this.dynamicFormGroup.get('planAvailable')?.value);
    
        }
      }
     
      }

  }


  changeBBNomineeRelation(control: any){
    console.log(this.bbdetails.insuredMemberDetails);
    console.log(this.dynamicFormGroup.get('relationWithProposer')?.value);
    const relationWithProposer = this.dynamicFormGroup.get('relationWithProposer')?.value?.toLowerCase();

    if (relationWithProposer) {
      const selectedDetails = this.bbdetails.insuredMemberDetails.find((member: any) => {
        // Normalize member.relation
        let standardizedRelation = member.relation.toLowerCase();
    
        // Remove numeric suffixes like "1" from Son1, Daughter1, etc.
        standardizedRelation = standardizedRelation.replace(/\d+/g, '');
    
        // Compare normalized relation with the input value
        return standardizedRelation === relationWithProposer;
      });
    
      if (selectedDetails) {
        // Patch values to the form group if a match is found
        this.dynamicFormGroup.patchValue({
          nomineeFirstName: selectedDetails.firstName || '',
          nomineeLastName: selectedDetails.lastName || '',
          nomineeDob: selectedDetails.dob || '',
          nomineeGender: selectedDetails.gender || '',
          nomineeMobileNumber: selectedDetails.mobileNumber || ''
        });
      } else {
        // Clear the form group fields if no match is found
        this.dynamicFormGroup.patchValue({
          nomineeFirstName: '',
          nomineeLastName: '',
          nomineeDob: '',
          nomineeGender: '',
          nomineeMobileNumber: ''
        });
        console.log("No matching member details found.");
      }
    } else {
      console.log("Relation with proposer is not defined.");
      // Optionally, clear the form group fields if relationWithProposer is empty
      this.dynamicFormGroup.patchValue({
        nomineeFirstName: '',
        nomineeLastName: '',
        nomineeDob: '',
        nomineeGender: '',
        nomineeMobileNumber: ''
      });
    }
    if(this.partnerId == "45"){
      let selectedGender=this.getGender(relationWithProposer)
      this.dynamicFormGroup.patchValue({
        preFix: this.mapSalutation(relationWithProposer),
        nomineeGender: selectedGender,
      })
    }
  }
  getGender(relation: string): string {
    switch (relation.toLowerCase()) {
      case 'spouse':
        return this.tsDetails.proposerGender=='F'?'M':'F';
      case 'son':
      case 'grandson':
      case 'nephew':
      case 'brother':
      case 'father':
      case 'son-in-law':
      case 'brother-in-law':
      case 'father-in-law':
      case 'grandfather':
      case 'uncle':
        return 'M';
      case 'daughter':
      case 'granddaughter':
      case 'niece':
      case 'sister':
      case 'mother':
      case 'daughter-in-law':
      case 'sister-in-law':
      case 'mother-in-law':
      case 'grandmother':
      case 'aunt':
        return 'F';
      default:
        return '';
    }
  }
  mapSalutation(relation: string): string {
    switch (relation.toLowerCase()) {
      case 'spouse':
        return  this.tsDetails.proposerGender=='M'?'Mrs':'Mr';
      case 'son':
      case 'grandson':
      case 'nephew':
      case 'brother':
      case 'father':
      case 'son-in-law':
      case 'brother-in-law':
      case 'father-in-law':
      case 'grandfather':
      case 'uncle':
        return 'Mr';
      case 'daughter':
      case 'granddaughter':
      case 'niece':
      case 'sister':
      case 'mother':
      case 'daughter-in-law':
      case 'sister-in-law':
      case 'mother-in-law':
      case 'grandmother':
      case 'aunt':
        return 'Ms';
      default:
        return '';
        
    }
  }
  changeD2CNomineeRelation(control: any){
    console.log(this.d2cDetails.insuredMemberDetails);
    console.log(this.dynamicFormGroup.get('nomineeRelation')?.value);
    const relationWithProposer = this.dynamicFormGroup.get('nomineeRelation')?.value?.toLowerCase();

    if (relationWithProposer) {
      const selectedDetails = this.d2cDetails.insuredMemberDetails.find((member: any) => {
        // Normalize member.relation
        let standardizedRelation = member.relation.toLowerCase();
    
        // Remove numeric suffixes like "1" from Son1, Daughter1, etc.
        standardizedRelation = standardizedRelation.replace(/\d+/g, '');
    
        // Compare normalized relation with the input value
        return standardizedRelation === relationWithProposer;
      });
    
      if (selectedDetails) {
        // Patch values to the form group if a match is found
        this.dynamicFormGroup.patchValue({
          firstName: selectedDetails.firstName  + selectedDetails.lastName || '',
          nomineeDob: selectedDetails.dob || '',
          nomineeGender: selectedDetails.gender || '',
          mobileNumber: selectedDetails.mobileNumber || ''
        });
      } else {
        // Clear the form group fields if no match is found
        this.dynamicFormGroup.patchValue({
          firstName: '',
          nomineeDob: '',
          nomineeGender: '',
          mobileNumber: ''
        });
        console.log("No matching member details found.");
      }
    } else {
      console.log("Relation with proposer is not defined.");
      // Optionally, clear the form group fields if relationWithProposer is empty
      this.dynamicFormGroup.patchValue({
        firstName: '',
        nomineeDob: '',
        nomineeGender: '',
        mobileNumber: ''
      });
    }
    
  }

  changeBbNomineeDob(){
    
  }
  backToleads() {
    this.router.navigate(['/leads/leadsList'], {
    });
  }
  onTSCreateLeadSubmit(control: any){
    console.log(this.dynamicFormGroup.value);
    console.log(this.productCode)
    console.log(this.productName)
    if(this.dynamicFormGroup.valid){
      let leadObj = {
          axisProcess: this.dynamicFormGroup.get('axisProcess')?.value,
          customerId: this.dynamicFormGroup.get('customerId')?.value,
          salutation: this.dynamicFormGroup.get('salutation')?.value,
          firstName: this.dynamicFormGroup.get('firstName')?.value,
          lastName: this.dynamicFormGroup.get('lastName')?.value,
          gender: this.dynamicFormGroup.get('gender')?.value,
          mobileNumber: this.dynamicFormGroup.get('mobileNumber')?.value,
          emailId: this.dynamicFormGroup.get('emailId')?.value,
          dob: this.dynamicFormGroup.get('dob')?.value,
          productCode: this.productCode,
          productName: this.productName,
          createdBy: this.agentCode
      }
      this.rugService.createLeadTS(leadObj).subscribe({
        next: (res: any) => {
          console.log(res)
          res = JSON.parse(res.data);
          console.log(res)

          this.leadId = res.data.leadId;
          if (res.isSuccess == true && res.statusCode == 200) {
            if (this.getFormIndexValue() < this.formSequence.length - 1) {
              this.incrementIndex();
              this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
            }
          }else{
            this.toast.warning({ detail: "Warning", summary: res.message, duration: 3000 });
          }

          // res = JSON.parse(res.data).data
        },
        error: (err) => {
          console.error(err);
        }
      });
  }    
  else {
    console.log('Form is invalid', this.dynamicFormGroup);
    let firstInvalidTabIndex: number | null = null;
    if (this.dynamicFormGroup.get('insuredMemberDetails')) {
      this.form.formSections.forEach(section => {
        section.formControls.forEach(control => {
          if (control.dynamicControls) {
            control.dynamicControls.forEach((tabControls: any, tabIndex: number) => {
              const formGroup = (this.dynamicFormGroup.get('insuredMemberDetails') as FormArray).controls.at(tabIndex); // Assuming tabIndex maps to form group
              console.log(formGroup);
              if (formGroup && formGroup.invalid && firstInvalidTabIndex === null) {
                firstInvalidTabIndex = tabIndex; // Capture the first invalid tab
              }
            })
          }
        })
      })
    }
    Object.keys(this.dynamicFormGroup.controls).forEach(field => {
      const control = this.dynamicFormGroup.get(field);
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(nestedField => {
              const nestedControl = arrayControl.get(nestedField);
              nestedControl?.markAsTouched({ onlySelf: true });
            });
          } else {
            arrayControl?.markAsTouched({ onlySelf: true });
          }
        });
      }
      else if (control instanceof FormGroup) {
        control?.markAsDirty({ onlySelf: true });
      }
      else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
    if (this.dynamicFormGroup.invalid) {
      this.toast.warning({ detail: "Warning", summary: "Please fill the mandatory fields", duration: 3000 });
      if (firstInvalidTabIndex !== null) {
        // Navigate to the first invalid tab
        this.activeMemberTabIndex = firstInvalidTabIndex;
        // this.changeDetectorRef.detectChanges(); // Ensure change detection syncs the tab
      }
    }
    else if (this.dynamicFormGroup.get('nationality') && this.dynamicFormGroup.get('nationality')?.value !== 'Indian')
      this.toast.warning({ detail: "Warning", summary: "Indian residency is required", duration: 3000 })
  }
  }
  restrictFiledKeyPress(event: KeyboardEvent,control: any){
    const inputField = event.target as HTMLInputElement;
    const currentValue = inputField.value;
    console.log(inputField);
    console.log(currentValue);
    // Check if key is a number or a control key
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    const key = event.key;

    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault(); // Prevent non-numeric input
    }

    // Allow input only if length is less than 10
    if (currentValue.length >= 10 && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }
  restrictKeyPress(event: KeyboardEvent,control:IFormControl | IDynamicControl): void {
    if(control.inputMaxLength!=null && control.inputMaxLength!=undefined && control.inputMaxLength>0){
      const inputField = event.target as HTMLInputElement;
      const currentValue = inputField.value;
      const key = event.key;
      if (inputField.type === 'text') {
          if (currentValue.length > control.inputMaxLength-1) {
              event.preventDefault(); 
          }
      }
      if (inputField.type === 'number') {
          if (!/^[0-9]$/.test(key) || currentValue.length > control.inputMaxLength-1) {
             event.preventDefault();
         }
      }
    }
    if(control.restrictKeyPress!=null && control.restrictKeyPress!=undefined && control.restrictKeyPress){
      const charCode = event.key.charCodeAt(0);
      // Allow only letters (A-Z, a-z)
      if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
          event.preventDefault();
      }
    }
  }
  changeTsDobValidation(control: any, event: any){
    console.log(control.name);
  const dobValue = this.dynamicFormGroup.get(control.name)?.value;
  const dobArray = dobValue.split('-');
    if ((dobArray[0] as number >= 1800) && dobValue) {
      let age = this.calculateAge(dobValue);
      let isKid = /^\d+days$/.test(age.toString());
      if(isKid == true){
        age = 1;
      }
      if(Number(age) < 18 || Number(age) > 55){
        this.updateDobValidator(Number(age), control.name);
      }
    }
  }
  updateDobValidator(age: any, control: any){
    const dobControl = this.dynamicFormGroup.get(control);
    if (age < 18 || age > 55) {
      dobControl?.setValidators([this.ageRangeValidator(18, 55, age)]);
    } else {
      dobControl?.clearValidators();
    }
    dobControl?.updateValueAndValidity();
  }
  ageRangeValidator(minAge: number, maxAge: number, eneterdAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = control.value ? new Date(control.value) : null;
      if (dob) {
        const age = this.calculateTsAge(dob);
        if (Number(age) < minAge || Number(age) > maxAge) {
          return { ageRange: { minAge, maxAge, actualAge: age } };
        }
      }
      return null;
    };
  }
  calculateTsAge(dob: Date): number {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1;
    }
    return age;
  }
  changeTsGenderOnSalutaion(event: any){
    console.log(this.dynamicFormGroup.value.salutation);
    this.dynamicFormGroup.get('gender')?.setValue(this.dynamicFormGroup.value.salutation == 'Mr' ? 'M':'F');
    this.dynamicFormGroup.get('gender')?.disable();
  }
  updatePlansBasedOnSumInsured(sumInsured: number = 500000): void {
    sumInsured = this.dynamicFormGroup.get('sumInsured')?.value
    if (sumInsured == 10000000) {
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.name === 'planAvailable' && controls.radioOptions) {
            controls.radioOptions.forEach((option: any) => {
              if (option.value === 'GHI-10L') {
                option.visible = true; // Show 'GHI-10L' plan if sumInsured is 7500000
              }
            });
          }
        });
      });
    } else {
      // Hide the 'GHI-10L' plan if sumInsured is not 7500000
      this.form.formSections.forEach((section: any) => {
        section.formControls.forEach((controls: any) => {
          if (controls.name === 'planAvailable' && controls.radioOptions) {
            controls.radioOptions.forEach((option: any) => {
              if (option.value === 'GHI-10L') {
                option.visible = false; // Hide 'GHI-10L' plan for other sumInsured values
              }
            });
          }
        });
      });
    }
  }
}