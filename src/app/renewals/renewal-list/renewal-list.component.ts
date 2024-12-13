import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { empty, firstValueFrom, Subject } from "rxjs";
import { CommonService } from 'src/app/services/common.service';
import { RenewalsService } from '../renewals.service';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { searchValidationConfig } from 'src/app/interface/common-validation.interface';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { CustomersService } from 'src/app/customers/customers.service';

@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: ['./renewal-list.component.scss']
})
export class RenewalListComponent {
  renewalsList: RenewalList[] = [];
  countsList: any = [];
  renewedDate: any;
  activeFilter: string = "all";
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  selectedView: string = "list";
  productsList: any[] = [];
  policyTypes: any[] = [];
  startDate: any;
  endDate: any;
  appliedFiltersCount: number = 0;
  toggeledropdown: boolean = false;
  selected: string = '';
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false
  agentCode = localStorage.getItem('agentCode');
  filterType: string = "totalRecords";
  activeSection: string = "primary"
  StaticPolicyTypes = [
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  currentDate = new Date().toISOString().split('T')[0];
  proposalNum: string = '';
  documents: any[] = [];
  selectedDocument: any = null;
  searchApplied: boolean = false;

  constructor(
    private renewalService: RenewalsService, private router: Router, private datePipe: DatePipe,
    private commonService: CommonService, private toast: NgToastService, private encryptionService: EncryptionService, private languageService: LanguageService,
    private customerService: CustomersService,
    private translateService: TranslateService, private activatedRoute: ActivatedRoute
  ) { }

  renewalListRequestBody = {
    "agentCode": this.agentCode,
    "proposer": "",
    "productName": "",
    "policyNumber": "",
    "policyType": "",
    "startDate": null as string | null,
    "endDate": null as string | null,
    "pageNumber": this.page,
    "pageSize": this.rows,
    "mobileNumber": "",
    "filterType": ""
  }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    // this.activatedRoute.queryParams.subscribe((params: any) => {
    //   const filter = params['filter'];
    //   if (filter) {
    //     console.log("route filter", filter);
    //     const currentDate = new Date();

    //     switch (filter) {
    //       case 'Due Today':
    //         // Start and end date should be the current date
    //         this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //         this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //         break;

    //       case 'End of Grace Period Today':
    //         // Assuming grace period is 15 days before today
    //         const gracePeriodDate = new Date(currentDate.setDate(currentDate.getDate() - 15));
    //         this.startDate = this.datePipe.transform(gracePeriodDate, 'yyyy-MM-dd');
    //         this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //         break;

    //         case 'Due in 30 Days':
    //           // Start date: 30 days ago, end date: today
    //           this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //           const startDate30DaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
    //           this.startDate = this.datePipe.transform(startDate30DaysAgo, 'yyyy-MM-dd');
    //           break;

    //         case 'Due in 60 Days':
    //           // Start date: 60 days ago, end date: today
    //           this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //           const startDate60DaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 60));
    //           this.startDate = this.datePipe.transform(startDate60DaysAgo, 'yyyy-MM-dd');
    //           break;

    //       default:
    //         console.log("Unknown filter:", filter);
    //         break;
    //     }

    //     console.log("Start Date:", this.startDate);
    //     console.log("End Date:", this.endDate);

    //     // Call applyFilter() after setting the dates
    //     this.applyFilter();
    //   }
    // });


    this.getRenewalsList();
    this.getProducts();
    this.checkView(); //Screen View check
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getRenewalsList();
  }
  getRenewalsList() {
    this.renewalListRequestBody.pageNumber = this.page;
    this.renewalListRequestBody.pageSize = this.rows;
    this.renewalService.getRenewalListApi(this.renewalListRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.renewalsList = response.data.renewalsList.map((item: any) => ({
            ...item, policyEndDate: this.formatRenewedDate(item.policyEndDate)
          }));
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType];
        } else {
          this.toast.error({ detail: "", summary: response.message || "Failed to get Renewals List.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "", summary: "Error while generating Renewal List.", duration: 3000 });
      }
    );
  }
  formatRenewedDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "dd-MM-yyyy") || "";
  }
  filterQuotes(filter: string, filterRange: string) {
    this.renewalListRequestBody.filterType = filter;
    this.first = 0;
    this.page = 1;
    this.getRenewalsList();
    this.activeFilter = filter;
    this.filterType = filterRange;
  }
  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }
  getProducts() {
    const productsRequestBody = {
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(productsRequestBody).subscribe({
      next: (res) => {
        this.productsList = res.data;
      },
      error: (err) => {
        this.toast.error({ detail: "", summary: "Failed to get products list.", duration: 2000 });
      }
    })
  }
  toggleFilterDropdown(event: Event) {
    event.stopPropagation();
    this.toggeledropdown = !this.toggeledropdown;
  }
  calculateAppliedFiltersCount() {
    const selectedProductsCount = this.productsList.filter(
      (product) => product.selected).length;
    const selectedPolicyTypesCount = this.StaticPolicyTypes.filter(
      (policyType) => policyType.selected).length;
    let count = selectedProductsCount + selectedPolicyTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count;
  }
  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
    this.renewalListRequestBody.startDate = this.startDate;
    this.renewalListRequestBody.endDate = this.endDate;
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
    this.renewalListRequestBody.productName = selectedProducts.join(", ");
    const selectedPolicyTypes = this.StaticPolicyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
    this.renewalListRequestBody.policyType = selectedPolicyTypes.join(", ");
    this.first = 0;
    this.page = 1;
    this.getRenewalsList();
    this.toggeledropdown = false;
  }
  cancel() {
    this.toggeledropdown = false;
  }
  clear() {
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.renewalListRequestBody.productName = "";
    this.renewalListRequestBody.policyType = "";
    this.renewalListRequestBody.startDate = null;
    this.renewalListRequestBody.endDate = null;
    this.getRenewalsList();
  }
  onSelectChanges(event: any): void {
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
  }
  cancelSearch() {
    this.selected = "";
    this.renewalListRequestBody.mobileNumber = "";
    this.renewalListRequestBody.proposer = "";
    this.renewalListRequestBody.policyNumber = "";
    this.searchInputControl.reset();
    this.searchApplied=false;
    this.getRenewalsList();
  }
  getPlaceholder(): string {
    if (this.selected === "mobileNumber") {
      return "Enter Mobile Number";
    } else if (this.selected === "proposerName") {
      return "Enter Proposer Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } else {
      return "Search...";
    }
  }
  restrictInput(event: KeyboardEvent): void {
    if (this.selected === 'mobileNumber' && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  applySearch() {
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim();
      if (this.selected === "mobileNumber") {
        this.renewalListRequestBody.mobileNumber = trimmedValue || "";
        this.renewalListRequestBody.proposer = "";
        this.renewalListRequestBody.policyNumber = "";
      } else if (this.selected === "proposerName") {
        this.renewalListRequestBody.proposer = trimmedValue || "";
        this.renewalListRequestBody.mobileNumber = "";
        this.renewalListRequestBody.policyNumber = "";
      } else if (this.selected === "policyNumber") {
        this.renewalListRequestBody.policyNumber = trimmedValue || "";
        this.renewalListRequestBody.mobileNumber = "";
        this.renewalListRequestBody.proposer = "";
      }
      this.first = 0;
      this.page = 1;
      this.getRenewalsList();
    }
  }
  triggerSearch(): void {
    if (!this.selected) {
      console.log("No dropdown option selected");
      return;
    }  
    if (this.searchInputControl.valid && this.searchInputControl.value?.trim()) {
      console.log("Valid input", this.searchInputControl.value);  
      if (!this.searchApplied) {
        this.applySearch();
        this.searchApplied = true;
      } else {
        this.cancelSearch();
        this.searchApplied = false;
      }
    } else {
      console.log("Invalid input or empty value");
    }
  }
  
  renewalListView(view: string) {
    this.selectedView = view;
  }
  downloadPolicyKit() {
    if (!this.selectedDocument) {
      this.toast.error({ detail: "", summary: "Please select a document to download.", duration: 3000 });
      return;
    }
    const downloadPolicyKitRequestBody = {
      agentCode: this.agentCode,
      referenceId: this.agentCode,
      eventName: "Download policy kit request from customers",
      proposalNumber: "",
      downloadRequest: [
        {
          omniDocImageIndex: this.selectedDocument.omniDocImageIndex,
          fileName: this.selectedDocument.fileName,
        },
      ],
      sourceSystemName: "",
      identifier: "",
    };
    console.log("Download Request Body:", downloadPolicyKitRequestBody);
    this.customerService.downloadDocumentApi(downloadPolicyKitRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess && response.data?.downloadResponse?.length > 0) {
          const file = response.data.downloadResponse[0];
          if (file.byteArray && file.fileName) {
            const byteArray = new Uint8Array(
              atob(file.byteArray).split("").map((char) => char.charCodeAt(0))
            );
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = file.fileName;
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)
            window.open(fileURL, "_blank");
          }
        } else {
          this.toast.error({ detail: "", summary: response.message || "No file found to download.", duration: 3000 });
        }
      },
      (error: any) => {
        console.error("Download Policy Kit Error:", error);
        this.toast.error({ detail: "", summary: "Error while downloading Policy Kit.", duration: 3000 });
      }
    );
  }
  handleAction(item: RenewalList, event?: string) {
    switch (event) {
      case 'download':
        const searchDocumentRequestBody = {
          referenceId: this.agentCode,
          searchRequest: [
            {
              categoryID: "",
              description: "",
              dataClassParam: [
                {
                  docSearchParamId: "2",
                  value: item.policyNumber,
                },
                {
                  DocSearchParamId: "15",
                  Value: "RN_Notice"
                }
              ],
            },
          ],
          agentCode: this.agentCode,
          eventName: "Search policy kit request from customers",
          sourceSystemName: "",
          searchOperator: "AND",
        };
        this.customerService.searchDocumentApi(searchDocumentRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              const searchResponse = response.data.searchResponse;
              console.log("search Response", searchResponse);
              if (!searchResponse || searchResponse.length === 0) {
                this.toast.error({ detail: "", summary: response.message || "No document found.", duration: 3000 });
              }
              else {
                this.documents = searchResponse;
                this.selectedDocument = this.documents[0]
                this.downloadPolicyKit()
              }
            } else {
              this.toast.error({ detail: "", summary: response.message || "Failed to search document.", duration: 2000 });
            }
          },
          (error: any) => {
            console.error("Search document error", error);
            this.toast.error({ detail: "", summary: "Error while searching the document.", duration: 2000 });
          }
        );
        break;
      case 'email':
        const emailRequestBody = {
          agentCode: this.agentCode,
          emailId: item.proposerEmail,
          mobile: item.proposerMobileNumber || "",
          eventName: "sending payment link to email",
          policyHolderFullName: item.proposerFirstName,
          renewedPolicyNumber: item.policyNumber,
          dateOfRenewed: item.policyEndDate,
          dateOfRenewal: item.policyEndDate,
          grossRenewalPayable: item.renewalPremiumAmount.toString(),
          renewalPaymentLink: "",
          attachment: {
            "Flag": "1",
            "Details": {
              "Document": [
                {
                  "Key": "2",
                  "Value": item.policyNumber,
                },
                {
                  "Key": "15",
                  "Value": "RN_Notice"
                }
              ]
            }
          }
        };
        this.renewalService.sendRenewalEmailApi(emailRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "", summary: response.data.message || "Renewal notice shared successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "", summary: response.data.message || "Failed to send renewal notice.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "", summary: "Error while sending renewal notice.", duration: 1500 });
          }
        );
        break;
      case 'copyPayLink':
        // const copyPayLinkRequestBody = {
        //   policy: item.policyNumber,
        //   mobile: item.proposerMobileNumber,
        //   source: "UnifiedPortal"
        // };
        // this.renewalService.generatePaymentlinkApi(copyPayLinkRequestBody).subscribe(
        //   (response: any) => {
        //     if (response.isSuccess) {
        //       this.toast.success({ detail: "Success", summary: "Payment link copied successfully.", duration: 1500 });
        //     } else {
        //       this.toast.error({ detail: "Error", summary: "Failed to copy payment link.", duration: 1500});
        //     }
        //   },
        //   (error: any) => {
        //     this.toast.error({ detail: "Error", summary: "Error while copying payment link.", duration: 1500 });
        //   }
        // );
        break;
      case 'sms':
        const smsRequestBody = {
          agentCode: this.agentCode,
          type: "DUE",
          customerName: item.proposerFirstName,
          customerMobileNo: item.proposerMobileNumber || "",
          agentMobileNo: "",
          eventName: "sending payment link via sms",
          dueDate: "",
          dateOfRenewal: item.policyEndDate,
          renewedPolicyNo: item.policyNumber,
          proposalNumber: "",
          policyNumber: item.policyNumber,
          grossRenewalAmount: item.renewalPremiumAmount.toString(),
          isAutoSMS: true,
          sessionId: ""
        };
        this.renewalService.sendRenewalsmsApi(smsRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "", summary: response.data.message || "SMS sent successfully.", duration: 3000 });
            } else {
              this.toast.error({ detail: "", summary: response.data.message || "Failed to send SMS.", duration: 3000 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "", summary: "Error while sending SMS.", duration: 3000 });
          }
        );
        break;
      case 'whatsapp':
        const whatsAppRequestBody = {
          templateCode: item.renewalStatus === 'LAPSED' ? "DUE-CSTMR" : "GRC-AGNT",
          policyNumbers: [item.policyNumber]
        };
        this.renewalService.sendRenewalWhatsappApi(whatsAppRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "", summary: response.data.message || "WhatsApp message sent successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "", summary: response.data.message || "Failed to send Whasapp message.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "", summary: "Error while sending WhatsApp message.", duration: 1500 });
          }
        );
        break;




      default:
        console.warn('Unknown action:', event);
    }
  }
  // renewalJourney(proposerDetail : RenewalList, action:string) {
  //   sessionStorage.setItem("policyNumberRen", this.encryptionService.encrypt(proposerDetail.policyNumber));
  //   const renewalInfoRequestBody = {
  //     policy_Number: proposerDetail.policyNumber,
  //   };
  //   const tempData={
  //     "error": [
  //       {
  //         "ErrorCode": "00",
  //         "ErrorMessage": "Success"
  //       }
  //     ],
  //     "response": {
  //       "policyData": [
  //         {
  //           "Tenure2": "",
  //           "Tenure3": "",
  //           "V3Indicator": "V4",
  //           "salutation": "Mr.",
  //           "educationalQualification": "C",
  //           "SourceCode": "CUSTPORT",
  //           "uidNo": "",
  //           "occupation": "O002",
  //           "familyMobileNo": "9930519086",
  //           "familyEmailID": "sohel.shaikh@qualitykiosk.com",
  //           "panNo": "",
  //           "passportNumber": "",
  //           "contactPerson": "",
  //           "annualIncome": "1000000",
  //           "remarks": "",
  //           "IdProof": "",
  //           "ageProof": "",
  //           "residenceProof": "",
  //           "others": "",
  //           "Policy_number": "21-24-0002891-00",
  //           "AutoDebitFlag": "N",
  //           "Alternate_Mobile_Number": "",
  //           "Alternate_Email_Id": "",
  //           "Combi_Reference_Number": "",
  //           "RegistrationStatus": "PEN",
  //           "OverwriteAutoDebit": "",
  //           "DebitDate": "",
  //           "healthReturn": ".00",
  //           "HealthReturn": "Y",
  //           "ProductCode": "6212",
  //           "PolicyStatus": "01",
  //           "Policy_Sub_Status": "110",
  //           "UWDependentEntitlement": "",
  //           "ApplicationDate": "31/10/2024",
  //           "ValidFrom": "31/10/2024",
  //           "ValidTo": "30/10/2025",
  //           "Tenure": "1",
  //           "sameAsHomeAddress": "1",
  //           "BusinessType": "REN",
  //           "ApplicationNo": "QE0006758802410",
  //           "NumberofAdults": "0",
  //           "NumberofChildren": "0",
  //           "PolicyOwnerName": "Aniket  Birambole",
  //           "PolicyOwnerFirstName": "Aniket",
  //           "PolicyOwnerMiddleName": "",
  //           "PolicyOwnerLastName": "Birambole",
  //           "CustomerCode": "PT87708188",
  //           "ifAML": "",
  //           "ifFaceMatch": "",
  //           "ifPEP": "N",
  //           "Hyper_verge_OPD_Status": "N",
  //           "Digi_Locker_Verified": "N",
  //           "CKYC_Flag": "Y",
  //           "KYC_Transition_Id": "",
  //           "DateOfBirth": "18/11/1999",
  //           "ProposarAge": "18/11/1999",
  //           "Gender1": "M",
  //           "MaritalStatus": "Single",
  //           "Nationality": "IN",
  //           "NonIndian": "",
  //           "Mobile": "9930519086",
  //           "Email": "sohel.shaikh@qualitykiosk.com",
  //           "internationalcontactno": "",
  //           "WhatsAppNo": "9930519086",
  //           "EmergencyContactNo": "",
  //           "SumInsured": "2000000",
  //           "sumInsuredtype": "IND",
  //           "BasicPremium": "12088.0",
  //           "RiderAmount": "0.0",
  //           "BasePremium": "0.0",
  //           "UWLoading": "0",
  //           "PremiumWaiverFlag": "0",
  //           "Discounts": "0.0",
  //           "NetPremium": "14264.0",
  //           "TAXDetails": "2176.0",
  //           "AnnualPremium": "14264.0",
  //           "agentCode": "",
  //           "agentName": "Direct",
  //           "agentPhoneNo": "5164688713",
  //           "agentEmail": "test_325380@abhi.com",
  //           "channel": "DOT",
  //           "Intermediary_Name": "Direct",
  //           "Intermediary_Code": "5100003",
  //           "smCode": "382800",
  //           "smName": "Namita Singh",
  //           "smPhoneNo": "2855648350",
  //           "Policy_Expired": "Yes",
  //           "Sum_insured_type": "Individual",
  //           "Policy_start_date": "10/31/2023",
  //           "Policy_renewal_date": "10/30/2025",
  //           "Policy_expiry_date": "10/30/2024",
  //           "Policy_lapsed_flag": "No",
  //           "RefCode1": "",
  //           "RefCode2": "",
  //           "Upsell_Flag": "No",
  //           "Renewable_Flag": "Yes",
  //           "enumIsEmployeeDiscount": "N",
  //           "EnumIsMandate": "",
  //           "Renewed_Flag": "No",
  //           "Combi_Flag": "No",
  //           "Combi_Policy_Number": "",
  //           "IsModified": "",
  //           "quoteDate": "04/10/2024",
  //           "NSTP_flag": "No",
  //           "Name_of_the_proposer": "Aniket Birambole",
  //           "Name_of_product": "Activ Health V2",
  //           "Plan_name": "Platinum - Enhanced",
  //           "IsEmployeeDiscount": "0",
  //           "optionalCoverages": [],
  //           "Discount_Amount": "0.0",
  //           "PolicyproductComponents": null,
  //           "premium": {
  //             "PA_Net": "0.0000",
  //             "CI_Net": "0.0000",
  //             "CA_Net": "0.0000",
  //             "HCB_Net": "0.0000",
  //             "Renewal_Net_Premium": 12088,
  //             "Renewal_Gross_Premium": 14264,
  //             "Renewal_Tax_Details": [
  //               {
  //                 "Tax_Type": "CGST",
  //                 "TaxRate": "9.00",
  //                 "Tax_Amount": "1088.0"
  //               },
  //               {
  //                 "Tax_Type": "SGST",
  //                 "TaxRate": "9.00",
  //                 "Tax_Amount": "1088.0"
  //               },
  //               {
  //                 "Tax_Type": "UTGST",
  //                 "TaxRate": "",
  //                 "Tax_Amount": "0.0"
  //               },
  //               {
  //                 "Tax_Type": "IGST",
  //                 "TaxRate": "",
  //                 "Tax_Amount": "0.0"
  //               }
  //             ],
  //             "PA_NetU": "",
  //             "CI_NetU": "",
  //             "CA_NetU": "",
  //             "HCB_NetU": "",
  //             "Upsell_Net_Premium": 0,
  //             "Upsell_Gross_Premium": 0,
  //             "Upsell_Tax_Details": [
  //               {
  //                 "Tax_Type": "",
  //                 "TaxRate": "",
  //                 "Tax_Amount": ""
  //               }
  //             ]
  //           },
  //           "uwRules": [
  //             {
  //               "Member_Name": "",
  //               "PED": ""
  //             }
  //           ],
  //           "Members": [
  //             {
  //               "MemberproductComponents": [
  //                 {
  //                   "PlanCode": "6212100003",
  //                   "CB": "",
  //                   "productComponent": [
  //                     {
  //                       "productComponentName": "RoomCategory",
  //                       "productComponentValue": "Single Private A/c Room"
  //                     },
  //                     {
  //                       "productComponentName": "zone",
  //                       "productComponentValue": "Zone I"
  //                     },
  //                     {
  //                       "productComponentName": "SumInsured",
  //                       "productComponentValue": "2000000"
  //                     }
  //                   ]
  //                 }
  //               ],
  //               "Title": "Mr.",
  //               "PremiumWaiverFlag": "",
  //               "PremiumWaiverBenefit": "",
  //               "PPN_Discount": "",
  //               "Alternate_Mobile_Number": "",
  //               "Alternate_Email_Id": "",
  //               "Name": "Aniket Birambole",
  //               "FirstName": "Aniket",
  //               "MiddleName": "",
  //               "LastName": "Birambole",
  //               "GHDApplicable": "",
  //               "GHDRemarks": "",
  //               "Age": "24",
  //               "salutation": "Mr.",
  //               "marital_status": "",
  //               "AnnualIncome": "1000000",
  //               "IdProofNumber": "",
  //               "IdProof": "",
  //               "exactDiagnosis": "",
  //               "LoanAccountNumber": "",
  //               "EMI": "",
  //               "LoanPrincipalOutstanding": "",
  //               "Designation": "NA",
  //               "PrimaryMember": "Y",
  //               "NatureOfDuty": "",
  //               "height": "165.1",
  //               "weight": "55",
  //               "occupation": "O002",
  //               "Gender": "M",
  //               "DeductibleAmount": "0",
  //               "SumInsuredPerUnit": "2000000",
  //               "MobilePhone": "9930519086",
  //               "WellnessPartyId": "",
  //               "PreExistingDiseasesApplicable": "No",
  //               "ChronicManagementApplicable": "No",
  //               "Policy_Type": "IND",
  //               "HealthReturn": "Y",
  //               "FitnessAssessment": "Y",
  //               "WellnesCoach": "Y",
  //               "DRM": "N",
  //               "HealthAssessment": "Y",
  //               "PanNo": "AWSPD7297N",
  //               "AadharCradNo": "",
  //               "AlternateMobile": "",
  //               "SumInsured": "2000000",
  //               "Upsell_SumInsured": "",
  //               "healthReturn": ".00",
  //               "DoB": "1999-11-18T00:00:00",
  //               "Email": "sohel.shaikh@qualitykiosk.com",
  //               "Mobile_Number": "9930519086",
  //               "Relation": "Self",
  //               "Chronic": "",
  //               "CB": "1000000",
  //               "MemberId": "PT87708188",
  //               "memberquestiondetails": [
  //                 {
  //                   "Qcode": "285362129042021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "285298529042021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q228",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q502",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "142839518042022",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "142839618042022",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "285298729042021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "285299729042021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162015801022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162016501022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162017201022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162020001022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162020701022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "184887110022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "184887810022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162009201022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162010201022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162010901022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162011601022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162012301022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162013001022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162013701022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162014401022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162015101022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "285362529042021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q266",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q249",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q246",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q247",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q248",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q555",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q501",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q526",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q576",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "148055125012021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "148055025012021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "285295429042021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "148055225012021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "148055227012021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q209",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4176439420042020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q208",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q205",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4176441220042020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q212",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q202",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q206",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q211",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q207",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q105",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q241",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4176438520042020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q240",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q213",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q015",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q101",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q014",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q204",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q552",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "466151925072021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q250",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q557",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q556",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q047",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q054",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q044",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q046",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q045",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q222",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q223",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q221",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q220",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q219",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q578",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4252180319082020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4252180919082020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4252180619082020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162015901022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162016601022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162017301022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162020101022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162020801022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "184887210022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "184887910022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162009601022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162010301022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162011001022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162011701022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162012401022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162013101022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162013801022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162014501022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "162015201022021",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "Q553",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4252219319082020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4176449420042020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 },
  //                 {
  //                   "Qcode": "4176443320042020",
  //                   "ans": "0",
  //                   "remarks": ""
  //                 }
  //               ],
  //               "optionalCoverages": [
  //                 {
  //                   "plancode": "1PLATINUMV2",
  //                   "coverCode": "62124110",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "2PLATINUMV2",
  //                   "coverCode": "62124124",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "3PLATINUMV2",
  //                   "coverCode": "62124135",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "4PLATINUMV2",
  //                   "coverCode": "62124105",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "5PLATINUMV2",
  //                   "coverCode": "62124121",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "6PLATINUMV2",
  //                   "coverCode": "62124104",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "7PLATINUMV2",
  //                   "coverCode": "62124115",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "8PLATINUMV2",
  //                   "coverCode": "62124127",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "9PLATINUMV2",
  //                   "coverCode": "62124122",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "10PLATINUMV2",
  //                   "coverCode": "62124125",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "11PLATINUMV2",
  //                   "coverCode": "62124126",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "12PLATINUMV2",
  //                   "coverCode": "62124113",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "13PLATINUMV2",
  //                   "coverCode": "62124116",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "14PLATINUMV2",
  //                   "coverCode": "62124101",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "15PLATINUMV2",
  //                   "coverCode": "62124111",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "16PLATINUMV2",
  //                   "coverCode": "62124114",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "17PLATINUMV2",
  //                   "coverCode": "62124112",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "18PLATINUMV2",
  //                   "coverCode": "62124117",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "19PLATINUMV2",
  //                   "coverCode": "62124107",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "20PLATINUMV2",
  //                   "coverCode": "62124103",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "21PLATINUMV2",
  //                   "coverCode": "62124102",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "22PLATINUMV2",
  //                   "coverCode": "62124119",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "23PLATINUMV2",
  //                   "coverCode": "62124106",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "24PLATINUMV2",
  //                   "coverCode": "62124137",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 },
  //                 {
  //                   "plancode": "25PLATINUMV2",
  //                   "coverCode": "62124123",
  //                   "coverSi": "2000000",
  //                   "coverPartCode": ""
  //                 }
  //               ],
  //               "Zone": "Z001",
  //               "activpolicydetails": {
  //                 "InsurerName": "",
  //                 "policyNo": "",
  //                 "Policy_expiry_Date": "",
  //                 "sum_Insured": "",
  //                 "Claim_in_Policy": "",
  //                 "Policy_status": ""
  //               },
  //               "upsellPropensityDetails": [
  //                 {
  //                   "upsellSumInsured": "",
  //                   "upsellNetPremium": "",
  //                   "upsellGrossPremium": "",
  //                   "zone": "",
  //                   "tenure": "",
  //                   "recommended": "",
  //                   "withRenewalModification": "",
  //                   "upsellBucket": "",
  //                   "upsellSI1": "",
  //                   "upsellSI2": "",
  //                   "upsellSI3": "",
  //                   "upsellSI4": "",
  //                   "upsellSI5": "",
  //                   "maxUpsell": "",
  //                   "processed": "",
  //                   "processedDate": "",
  //                   "upsellCGSTAmount": "",
  //                   "upsellSGSTAmount": "",
  //                   "upsellUTGSTAmount": "",
  //                   "upsellIGSTAmount": "",
  //                   "upsellTAXAmount": ""
  //                 }
  //               ],
  //               "UpsellPropensityDetails": [
  //                 null
  //               ]
  //             }
  //           ],
  //           "Nominee_Details": {
  //             "nominee_first_name": "Shashank",
  //             "nominee_last_name": "Shashank",
  //             "nominee_dob": "29/11/2000",
  //             "nominee_relationship_code": "Brother",
  //             "Nominee_Name": "Shashank",
  //             "Nominee_Address": "oinas",
  //             "Nominee_Contact_No": "8722499266",
  //             "Relationship": "Brother"
  //           },
  //           "Nominee_DetailsList": null,
  //           "HomeAddress": {
  //             "Home_Address_1": "aoisfoinasf",
  //             "Home_Address_2": "oaisfnoiasf",
  //             "Home_Address_3": "null",
  //             "Home_State": "MAHARASHTRA",
  //             "Home_District": "Mumbai",
  //             "Home_City": "Mumbai",
  //             "Home_Pincode": "400002"
  //           },
  //           "MailingAddress": {
  //             "Mailing_Address_1": "aoisfoinasf",
  //             "Mailing_Address_2": "oaisfnoiasf",
  //             "Mailing_Address_3": "",
  //             "Mailing_State": "MAHARASHTRA",
  //             "Mailing_City": "Mumbai",
  //             "mailingArea": "Mumbai",
  //             "mailingContactMobileNo": "9930519086",
  //             "mailingContactMobileNo2": "9930519086",
  //             "Mailing_PinCode": "400002"
  //           },
  //           "CKYC_Number": "20084759923752"
  //         }
  //       ]
  //     },
  //     "Renew_Info": [
  //       {
  //         "Renewed_Policy_Number": "",
  //         "Renewed_Policy_Proposal_Number": "240000664975",
  //         "Renewed_Policy_Start_Date": "",
  //         "Renewed_Policy_Expiry_Date": ""
  //       }
  //     ]
  //   }
  //   this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
  //     (res: any) => {
  //       if (res.isSuccess) {          
  //         sessionStorage.setItem("renewalData", this.encryptionService.encrypt(tempData));
  //         sessionStorage.setItem("policyActionRen", this.encryptionService.encrypt(action));
  //         this.router.navigate(['renewal/payment']);
  //       }
  //        else {
  //         this.toast.error({ detail: "", summary: res.message || "Failed to get Renewal Information", duration: 3000 });
  //       }
  //     },
  //     (err) => {
  //       console.error("Error from getRenewalInfo API:", err);
  //       this.toast.error({ detail: "", summary: "Error while getiiong renwal Information.", duration: 3000 });
  //     }
  //   );
  // }

  // async renewalJourney(proposerDetail: RenewalList, action: string | null = null) {

  //   console.log(proposerDetail);

  //   await this.getProposalNum();

  //   console.log(this.proposalNum, action);

  //   if (action == 'withmodify') {
  //     localStorage.setItem('formIndex', '0');
  //   }
  //   else {
  //     localStorage.setItem('formIndex', '2');
  //   }

  //   if (action === "withmodify") {
  //     const payload = {
  //       policyNumber: proposerDetail.policyNumber,//res.data.policyNumber,
  //       mobileNumber: proposerDetail.proposerMobileNumber,//res.data.mobileNumber, 
  //       dateOfBirth: "",//res.data.memberDobProposer
  //     };
  //     this.renewalService.cpRedirectionApi(payload).subscribe(
  //       (res: any) => {
  //         const encryptedUrl = res.data;
  //         window.open(encryptedUrl, '_blank');
  //       },
  //       (err) => {
  //         console.error("Error from renewal re-direction API:", err);
  //         this.toast.error({ detail: "", summary: "Error from re-direction", duration: 3000 });
  //       }
  //     );
  //   } else if (action == 'withoutmodify') {
  //     const renewalInfoRequestBody = {
  //       policy_Number: proposerDetail.policyNumber,
  //     };
  //     this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
  //       (res: any) => {
  //         // if (res.isSuccess && res.data && Object.keys(res.data).length > 0) {
  //         //   console.log(res.data);
  //           // if(action === "withmodify"){
  //           // const payload = {
  //           //   policyNumber: "31-24-0005455-00",//res.data.policyNumber,
  //           //   mobileNumber: "8097758932",//res.data.mobileNumber, 
  //           //   dateOfBirth: "18/11/1999",//res.data.memberDobProposer
  //           // };
  //           // this.renewalService.cpRedirectionApi(payload).subscribe(
  //           //   (res: any) => {
  //           //     const encryptedUrl = res.data;   
  //           //     window.open(encryptedUrl, '_blank');
  //           //   },
  //           //   (err) => {
  //           //     console.error("Error from renewal re-direction API:", err);
  //           //     this.toast.error({ detail: "", summary: "Error from re-direction", duration: 3000 });
  //           //   }
  //           // );
  //           // } 

  //           // const convertedData = this.encryptionService.encrypt(res.data);
  //           // this.router.navigate(['renewal/renewalJourney'], {
  //           //   queryParams: {
  //           //     formData: convertedData,
  //           //     proposalNum: this.encryptionService.encrypt(this.proposalNum),
  //           //     policyNumber: this.encryptionService.encrypt(proposerDetail.policyNumber),
  //           //     journeyProcess: this.encryptionService.encrypt(0)
  //           //   }
  //           // });
  //         // } else 
  //         if (action == 'withoutmodify' && res.data && Object.keys(res.data).length > 0) {
  //           const convertedData = this.encryptionService.encrypt(res.data);

  //           console.log(convertedData, this.proposalNum);
  //           this.router.navigate(['renewal/renewalJourney'], {
  //             queryParams: {
  //               formData: convertedData,
  //               proposalNum: this.encryptionService.encrypt(this.proposalNum),
  //               policyNumber: this.encryptionService.encrypt(proposerDetail.policyNumber),
  //               journeyProcess: this.encryptionService.encrypt(0)
  //             }
  //           });
  //         } else {
  //           this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
  //         }
  //       },
  //       (err) => {
  //         console.error("Error from getRenewalInfo API:", err);
  //         this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
  //       }
  //     );
  //   }
  // }


  async renewalJourney(proposerDetail: RenewalList, action: string | null = null) {
    console.log(proposerDetail);
  
    // Await the proposal number
    await this.getProposalNum();
    console.log(this.proposalNum, action);
  
    // Set form index based on the action
    const formIndex = action === 'withmodify' ? '0' : '2';
    localStorage.setItem('formIndex', formIndex);
  
    if (action === "withmodify") {
      const payload = {
        policyNumber: proposerDetail.policyNumber, // Policy number
        mobileNumber: proposerDetail.proposerMobileNumber, // Mobile number
        dateOfBirth: "", // Date of birth
      };
  
      // Call cpRedirectionApi
      this.renewalService.cpRedirectionApi(payload).subscribe(
        (res: any) => {
          const encryptedUrl = res.data;
          window.open(encryptedUrl, '_blank');
        },
        (err) => {
          console.error("Error from renewal re-direction API:", err);
          this.toast.error({ detail: "", summary: "Error from re-direction", duration: 3000 });
        }
      );
    } else if (action === 'withoutmodify') {
      const renewalInfoRequestBody = {
        policy_Number: proposerDetail.policyNumber,
      };
  
      // Call getRenewalInfoApi
      this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
        (res: any) => {
          if (res.data && Object.keys(res.data).length > 0) {
            // Prepare data for state
            const formData = this.encryptionService.encrypt(res.data);
            const proposalNum = this.encryptionService.encrypt(this.proposalNum);
            const policyNumber = this.encryptionService.encrypt(proposerDetail.policyNumber);
            const journeyProcess = this.encryptionService.encrypt(0);
  
            console.log(formData, proposalNum);
  
            // Navigate with state
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: formData,
                proposalNum: proposalNum,
                policyNumber: policyNumber,
                journeyProcess: journeyProcess,
                formIndex: formIndex, // Include formIndex in state
              },
            });
          } else {
            this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
          }
        },
        (err) => {
          console.error("Error from getRenewalInfo API:", err);
          this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
        }
      );
    }
  }
  

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.commonService.getProposalNumber());
      this.proposalNum = res.data.proposalNumber;
    } catch (error) {
      console.error(error);
    }
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.filterWraperForm');
    const clickedButton = (event.target as HTMLElement).closest('.jsFilterBtnClick');
    if (!clickedInside && !clickedButton && this.toggeledropdown) {
      this.toggeledropdown = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkView(); //Screen View check
  }
  //Screen View check
  checkView() {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      this.selectedView = 'grid';
    } else {
      this.selectedView = 'list'; // Use 'grid' view for desktop
    }
  }
}