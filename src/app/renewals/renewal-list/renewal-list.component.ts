import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { firstValueFrom, Subject } from "rxjs";
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
  documents:any[]=[];
  selectedDocument: any = null;

  constructor(
    private renewalService: RenewalsService, private router: Router, private datePipe: DatePipe,
    private commonService: CommonService, private toast: NgToastService, private encryptionService: EncryptionService, private languageService: LanguageService,
    private translateService: TranslateService, private customerService:CustomersService
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
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = file.fileName;
            link.click(); 
            this.toast.success({ detail: "", summary: response.message || "Document downloaded successfully.", duration: 3000 });
 
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
              console.log("search Response",searchResponse);
              if (!searchResponse || searchResponse.length === 0) {
                this.toast.error({ detail: "", summary: response.message || "No document found.", duration: 3000 });
              }
              else{
                this.documents = searchResponse;
                this.selectedDocument=this.documents[0]  
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
          emailId: "sona@gmail.com",
          mobile: item.proposerMobileNumber || "",
          eventName: "sending payment link to email",
          policyHolderFullName: item.proposerFirstName,
          renewedPolicyNumber: item.policyNumber,
          dateOfRenewed: item.policyEndDate,
          dateOfRenewal: item.policyEndDate,
          grossRenewalPayable: item.renewalPremiumAmount.toString(),
          renewalPaymentLink: "this is payment link",
          attachment: {
            flag: "string",
            details: {
              document: [
                {
                  key: "string",
                  value: "string"
                }
              ]
            }
          }
        };
        this.renewalService.sendRenewalEmailApi(emailRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "", summary: response.message || "Renewal notice shared successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "", summary: response.message || "Failed to send renewal notice.", duration: 1500 });
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
          agentMobileNo: "9177035634",
          eventName: "sending payment link to sms",
          dueDate: "",
          dateOfRenewal: item.policyEndDate,
          renewedPolicyNo: "",
          proposalNumber: "",
          policyNumber: item.policyNumber,
          grossRenewalAmount: item.renewalPremiumAmount.toString(),
          isAutoSMS: true,
          sessionId: ""
        };
        this.renewalService.sendRenewalsmsApi(smsRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "", summary: response.message || "SMS sent successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "", summary: response.message || "Failed to send SMS.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "", summary: "Error while sending SMS.", duration: 1500 });
          }
        );
        break;
      case 'whatsapp':
        const whatsAppRequestBody = {
          templateCode: "DUE-CSTMR",
          policyNumbers: [item.policyNumber]
        };
        this.renewalService.sendRenewalWhatsappApi(whatsAppRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "", summary: response.message || "WhatsApp message sent successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "", summary: response.message || "Failed to send Whasapp message.", duration: 1500 });
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
  renewalJourney(proposerDetail : RenewalList, action:string) {
    sessionStorage.setItem("policyNumberRen", this.encryptionService.encrypt(proposerDetail.policyNumber));
    const renewalInfoRequestBody = {
      policy_Number: proposerDetail.policyNumber,
    };
    this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
      (res: any) => {
        if (res.isSuccess) {          
          sessionStorage.setItem("renewalData", this.encryptionService.encrypt(res));
          sessionStorage.setItem("policyActionRen", this.encryptionService.encrypt(action));
          this.router.navigate(['renewal/payment']);
        }
         else {
          this.toast.error({ detail: "", summary: res.message || "Failed to get Renewal Information", duration: 3000 });
        }
      },
      (err) => {
        console.error("Error from getRenewalInfo API:", err);
        this.toast.error({ detail: "", summary: "Error while getiiong renwal Information.", duration: 3000 });
      }
    );
  }

  // async renewalJourney(proposerDetail: RenewalList, action: string | null = null) {

  //   console.log(proposerDetail);

  //   this.getProposalNum();
    
  //   const tempFormData = {
  //     "productName": "Activ One Max Plus",
  //     "memberDobProposer": "1999-07-22",
  //     "panNo": "FVYPM1429K",
  //     "productVariant": "Max Plus",
  //     "ckycNo": "30081765657842",
  //     "typeOfBusiness": "NB",
  //     "memberPlan": "Max Plus",
  //     "memberRoomCategory": "UPTOSI",
  //     "productType": "AO",
  //     "planCode": "MASSMARKET_PLUS",
  //     "productId": "7200",
  //     "preFix": "Mr",
  //     "firstName": "SOUVIK",
  //     "middleName": "",
  //     "lastName": "MITRA",
  //     "memberAgeProposer": 25,
  //     "proposerGender": "M",
  //     "emailId": "souvik@gmail.com",
  //     "proposerAddress1": "C O MALAY KANTI MITRA WIRELESS COLONY BADARPUR",
  //     "proposerAddress2": "KARIMGANJ ASSAM",
  //     "proposerAddress3": ".",
  //     "city": "Karimganj",
  //     "country": "IN",
  //     "state": "AS",
  //     "mobileNumber": "6000473196",
  //     "idProof": "{\"id\":\"2\",\"value\":\"Aadhar Card\",\"name\":\"Aadhar Card\"}",
  //     "idNo": "7689",
  //     "annualIncome": "500000",
  //     "occupation": "{\"id\":\"10\",\"value\":\"O557\",\"name\":\"CA\"}",
  //     "maritalStatus": "{\"id\":\"M\",\"value\":\"Married\",\"name\":\"Married\"}",
  //     "gstDetails": "Consumers",
  //     "educationDetails": "{\"id\":\"6\",\"value\":\"Post Graduate\",\"name\":\"Post Graduate\"}",
  //     "nationality": "{\"id\":\"1\",\"value\":\"Indian\",\"name\":\"Indian\",\"selected\":true}",
  //     "sumInsured": "1500000",
  //     "proposerPincode": "788806",
  //     "zone": "Zone III",
  //     "zoneValue": "Z003",
  //     "numberOfInsuredMembers": 2,
  //     "plandetails": "",
  //     "totalPremium": 56504,
  //     "memberPolicyType": "Multi Individual",
  //     "insuredMembers": {
  //       "Self": true,
  //       "Spouse": true,
  //       "Son1": false,
  //       "Daughter1": false,
  //       "Mother": false,
  //       "Father": false,
  //       "Mother-In-Law": false,
  //       "Father-In-Law": false,
  //       "Brother1": false,
  //       "Sister1": false,
  //       "Grand-Father": false,
  //       "Grand-Mother": false,
  //       "Grand-Son1": false,
  //       "Grand-Daughter1": false,
  //       "Son-In-Law1": false,
  //       "Daughter-In-Law1": false,
  //       "Brother-In-Law": false,
  //       "Sister-In-Law": false,
  //       "Nephew1": false,
  //       "Niece1": false
  //     },
  //     "insuredMemberDetails": [
  //       {
  //         "relation": "Self",
  //         "firstName": "SOUVIK",
  //         "lastName": "MITRA",
  //         "height": "5",
  //         "weight": "70",
  //         "memberdob": "1999-07-22",
  //         "emailId": "souvik@gmail.com",
  //         "mobileNumber": "6000473196",
  //         "relationshipType": "{\"id\":\"R001\",\"productId\":\"2\",\"value\":\"Self\",\"name\":\"Self\",\"memberRelationCode\":\"24\",\"isIncrement\":false,\"imagePath\":\"assets/Self.png\"}",
  //         "memberAge": 25,
  //         "memberGender": "M",
  //         "pincode": "788806",
  //         "sumInsured": "1500000",
  //         "preExistingDisease": "no",
  //         "memberIndex": 0,
  //         "zone": "Zone III",
  //         "state": "",
  //         "city": "",
  //         "memberType": "",
  //         "middleName": "",
  //         "planType": "Multi Individual",
  //         "zoneValue": "Z003",
  //         "memberRoomCategory": "UPTOSI",
  //         "covers": [
  //           {
  //             "coverId": "CIL",
  //             "value": "1500000"
  //           }
  //         ],
  //         "preFix": "Mr",
  //         "isChronic": "No",
  //         "chronicDiseases": null,
  //         "roomCategory": "",
  //         "memberRelationCode": 24
  //       },
  //       {
  //         "relation": "Spouse",
  //         "firstName": "Emily",
  //         "lastName": "Mitra",
  //         "height": "5",
  //         "weight": "52",
  //         "memberdob": "2001-12-12",
  //         "emailId": "emily@gmail.com",
  //         "mobileNumber": "6000473196",
  //         "relationshipType": "{\"id\":\"R002\",\"productId\":\"2\",\"value\":\"Spouse\",\"name\":\"Spouse\",\"memberRelationCode\":\"13\",\"isIncrement\":false,\"imagePath\":\"assets/Spouse.png\"}",
  //         "memberAge": 22,
  //         "memberGender": "F",
  //         "pincode": "500013",
  //         "sumInsured": "1500000",
  //         "preExistingDisease": "no",
  //         "memberIndex": 2,
  //         "zone": "Zone II",
  //         "state": "",
  //         "city": "",
  //         "memberType": "",
  //         "middleName": "",
  //         "heightInches": "",
  //         "planType": "Multi Individual",
  //         "zoneValue": "Z002",
  //         "memberRoomCategory": "UPTOSI",
  //         "covers": [
  //           {
  //             "coverId": "CIL",
  //             "value": "1500000"
  //           },
  //           {
  //             "coverId": "RVCV",
  //             "value": "750"
  //           }
  //         ],
  //         "preFix": "",
  //         "isChronic": "No",
  //         "chronicDiseases": null,
  //         "roomCategory": "",
  //         "memberRelationCode": 22
  //       }
  //     ],
  //     "noOfChildrens": 0,
  //     "familySize": "2A",
  //     "proposerName": "SOUVIKMITRA",
  //     "tenure": 2,
  //     "personalDetails": "",
  //     "nomineeFirstName": "Anekant",
  //     "nomineeMiddleName": "",
  //     "nomineeLastName": "Madrap",
  //     "nomineeDob": "2001-11-07",
  //     "nomineeRelationWithProposer": "{\"id\":\"9\",\"value\":\"R009\",\"name\":\"Brother\"}",
  //     "Gender": "{\"id\":1,\"name\":\"Male\",\"value\":\"M\"}",
  //     "nomineeAddress": "dgfhjlkjlhg",
  //     "nomineeContactNo": "9876543210",
  //     "policyNumber": null
  //   }

  //   const renewalInfoRequestBody = {
  //     policy_Number: proposerDetail.policyNumber,
  //   };
  //   this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
  //     (res: any) => {
  //       if (res.isSuccess) {
  //         console.log(res);
  //         const convertedData = this.encryptionService.encrypt(tempFormData);

  //         console.log(convertedData,this.proposalNum);
  //         debugger;
  //         this.router.navigate(['renewal/renewalJourney'], {
  //           queryParams: {
  //             formData: convertedData,
  //             proposalNum: this.encryptionService.encrypt(this.proposalNum),
  //             policyNumber: this.encryptionService.encrypt(proposerDetail.policyNumber)
  //           }
  //         });
  //       }
  //       else {
  //         this.toast.error({ detail: "", summary: res.message || "Failed to get Renewal Information", duration: 3000 });
  //       }
  //     },
  //     (err) => {
  //       console.error("Error from getRenewalInfo API:", err);
  //       this.toast.error({ detail: "", summary: "Error while getiiong renwal Information.", duration: 3000 });
  //     }
  //   );
  // }

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
    }else {
      this.selectedView = 'list'; // Use 'grid' view for desktop
    }
  }
}