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
import { thankYou, thankYouPending } from 'src/assets/styles/renewals-forms/combined_forms';

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
  policyNumber: any;
  paymentStatus: any = "";

  constructor(
    private renewalService: RenewalsService, private router: Router, private datePipe: DatePipe,
    private commonService: CommonService, private toast: NgToastService, private encryptionService: EncryptionService, private languageService: LanguageService,
    private customerService: CustomersService, private translateService: TranslateService, private activatedRoute: ActivatedRoute
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
          this.translateService.use('en');
        }
      });
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let routeStatus = params['status'];
      const filter = params['filter'];
      if (routeStatus && filter) {
        console.log("route status", routeStatus);
        this.selected = "proposalStatus"
        this.searchInputControl.setValue(routeStatus);
        this.applySearch();
      }
      if (filter) {
        console.log("route filter", filter);
        const currentDate = new Date();
        switch (filter) {
          case 'Last7Days':
            this.startDate = this.datePipe.transform(
              new Date(currentDate.setDate(currentDate.getDate() - 7)),
              'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            break;

          case 'LastMonth':
            const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            this.startDate = this.datePipe.transform(lastMonthStart, 'yyyy-MM-dd');
            this.endDate = this.datePipe.transform(lastMonthEnd, 'yyyy-MM-dd');
            break;

          case 'QuarterWise':
            const currentMonth = currentDate.getMonth();
            const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
            const quarterStartDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
            const quarterEndDate = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0);
            this.startDate = this.datePipe.transform(quarterStartDate, 'yyyy-MM-dd');
            this.endDate = this.datePipe.transform(quarterEndDate, 'yyyy-MM-dd');
            break;

          case 'FinancialYear':
            const year = currentDate.getMonth() >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
            const financialYearStartDate = new Date(year, 3, 1);
            const financialYearEndDate = new Date(year + 1, 2, 31);
            this.startDate = this.datePipe.transform(financialYearStartDate, 'yyyy-MM-dd');
            this.endDate = this.datePipe.transform(financialYearEndDate, 'yyyy-MM-dd');
            break;

          default:
            console.log("Unknown filter:", filter);
            break;
        }
        this.applyFilter();
      }
    });
    this.getRenewalsList();
    this.getProducts();
    this.checkView();
    const stateData = history.state;
    if (stateData && Object.keys(stateData).length > 0) {
      if (stateData.paymentStatus) {
        const paymentStatus = this.encryptionService.decrypt(stateData.paymentStatus);
        if (paymentStatus == "PENDING") {
          this.toast.warning({ detail: "Warning", summary: "payment Pending", duration: 5000 });
        } else if (paymentStatus == "INPROGRESS") {
          this.toast.warning({ detail: "Warning", summary: "payment inprogress", duration: 5000 });
        }
      }
      try {
        if (stateData.policyNumber) {
          this.policyNumber = this.encryptionService.decrypt(stateData.policyNumber);
          console.log(this.policyNumber);
        }
      } catch (error) {
        console.error(error);

      }
    }
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
          this.toast.error({ detail: "Error", summary: response.message || "Failed to get Renewals List.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while generating Renewal List.", duration: 3000 });
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
        this.toast.error({ detail: "Error", summary: "Failed to get products list.", duration: 2000 });
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
    this.searchApplied = false;
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
      return;
    }
    if (this.searchInputControl.valid && this.searchInputControl.value?.trim()) {
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
      this.toast.error({ detail: "Error", summary: "Please select a document to download.", duration: 3000 });
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
          this.toast.error({ detail: "Error", summary: response.message || "No file found to download.", duration: 3000 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "Error", summary: "Error while downloading Policy Kit.", duration: 3000 });
      }
    );
  }

  errorMessages: string = '';

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
              if (searchResponse && searchResponse[0]?.error?.length > 0) {
                const errorMessages = "No documents are available to download."
                this.toast.warning({ detail: "Warning", summary: errorMessages, duration: 3000 });
                return;
              }
              else {
                this.documents = searchResponse;
                this.selectedDocument = this.documents[0]
                this.downloadPolicyKit()
              }
            } else {
              this.toast.error({ detail: "Error", summary: response.message || "Failed to search document.", duration: 2000 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while searching the document.", duration: 2000 });
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
              this.toast.success({ detail: "success", summary: response.data.message || "Renewal notice shared successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: response.data.message || "Failed to send renewal notice.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending renewal notice.", duration: 1500 });
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
              this.toast.success({ detail: "Success", summary: response.data.message || "SMS sent successfully.", duration: 3000 });
            } else {
              this.toast.error({ detail: "Error", summary: response.data.message || "Failed to send SMS.", duration: 3000 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending SMS.", duration: 3000 });
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
              this.toast.success({ detail: "Success", summary: response.data.message || "WhatsApp message sent successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: response.data.message || "Failed to send Whasapp message.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending WhatsApp message.", duration: 1500 });
          }
        );
        break;
      default:
        console.warn('Unknown action:', event);
    }
  }

  // async renewalJourney(proposerDetail: RenewalList, action: string | null = null) {
  //   await this.getProposalNum();
  //   const paymentStatusRequestBody = {
  //     policyNumber: proposerDetail.policyNumber,
  //   };
  //   await this.renewalService.getpaymentdetailsbypolicynoApi(paymentStatusRequestBody).subscribe(
  //     (res: any) => {
  //       const paymentDetail = res.data;
  //       if (!paymentDetail || Object.keys(paymentDetail).length === 0) {
  //         return;
  //       }
  //       this.paymentStatus = paymentDetail?.paymentStatus.toUpperCase();        
  //       const formData = {
  //         proposalNumber: paymentDetail?.fullQuoteResponse?.proposalNumber || '',
  //         policyNumber: paymentDetail?.fullQuoteResponse?.policyNumber || '',
  //         policyStatus: paymentDetail?.policyStatus || '',
  //         policyStartDate: paymentDetail?.fullQuoteResponse?.policyStartDate || '',
  //         policyEndDate: paymentDetail?.fullQuoteResponse?.policyEndDate || '',
  //         receiptID: paymentDetail?.fullQuoteResponse?.receiptID || '',
  //         customerId: paymentDetail?.customerId || '',
  //         applicationNumber: paymentDetail?.applicationNumber || '',
  //         status: paymentDetail?.fullQuoteResponse?.status || '',
  //         productName: paymentDetail?.productName || '',
  //         premiumPaid: paymentDetail?.fullQuoteResponse?.premiumPaid || '',
  //         isFullQuoteSuccess: paymentDetail?.isFullQuoteSuccess || false,
  //         paymentMessage: "",
  //         paymentStatus: paymentDetail?.paymentStatus
  //       };
  //       if (paymentDetail?.paymentStatus.toUpperCase() === 'SUCCESS' || (paymentDetail?.paymentStatus.toUpperCase()).startsWith('IN')) {
  //         if (paymentDetail?.isFullQuoteSuccess) {
  //           if (res.data.fullQuoteResponse.errorMessage) { this.toast.success({ detail: "Success", summary: res.data.fullQuoteResponse.errorMessage, duration: 5000 }); }
  //           this.router.navigate(['renewal/renewalJourney'], {
  //             state: {
  //               formData: this.encryptionService.encrypt(formData),
  //               proposalNum: this.encryptionService.encrypt(""),
  //               policyNumber: this.encryptionService.encrypt(paymentDetail?.oldPolicyNumber),
  //               journeyProcess: this.encryptionService.encrypt(0),
  //               formIndex: "1",
  //             },
  //           });
  //         } else {
  //           if (res.data.errorMessage) { this.toast.warning({ detail: "Warning", summary: res.data.errorMessage, duration: 5000 }); }
  //           formData.paymentMessage = "Payment completed successfully; policy issuance pending";
  //           this.router.navigate(['renewal/renewalJourney'], {
  //             state: {
  //               formData: this.encryptionService.encrypt(formData),
  //               policyNumber: this.encryptionService.encrypt(paymentDetail?.oldPolicyNumber),
  //               formIndex: "1",
  //             },
  //           });
  //         }
  //       }
  //       else if (paymentDetail?.paymentStatus.toUpperCase() == 'INPROGRESS' || paymentDetail?.paymentStatus.toUpperCase() == 'PENDING') {
  //         formData.paymentMessage = "Payment pending; please wait for processing";
  //         this.toast.warning({ detail: "warning", summary:res.data.errorMessage || "payment Pending", duration: 5000 });
  //         this.router.navigate(['renewal/renewalJourney'], {
  //           state: {
  //             formData: this.encryptionService.encrypt(formData),
  //             policyNumber: this.encryptionService.encrypt(paymentDetail?.oldPolicyNumber),
  //             paymentStatus: this.encryptionService.encrypt(paymentDetail?.paymentStatus),
  //             formIndex: "1",
  //           }
  //         });
  //       }
  //     },
  //     (err) => {
  //       console.error("Error from getpaymentstatus API:", err);
  //       this.toast.error({ detail: "Error", summary: "Error while getting renewal payment status.", duration: 3000 });
  //     }
  //   );

  //   // Set form index based on the action
  //   const formIndex = action === 'withmodify' ? '0' : '2';
  //   localStorage.setItem('formIndex', formIndex);
  //   const formatDate = (date: string): string => {
  //     if (!date) return "";
  //     const parsedDate = new Date(date);
  //     const day = String(parsedDate.getDate()).padStart(2, '0');
  //     const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  //     const year = parsedDate.getFullYear();
  //     return `${month}/${day}/${year}`;
  //   };
  //   if (action === "withmodify" && this.paymentStatus == "" && this.paymentStatus != "SUCCESS" && this.paymentStatus != "PENDING") {
  //     const payload = {
  //       policyNumber: proposerDetail.policyNumber,
  //       dateOfBirth: formatDate(proposerDetail.proposerDateOfBirth || ""),
  //       mobileNumber: "",
  //     };
  //     this.renewalService.cpRedirectionApi(payload).subscribe(
  //       (res: any) => {
  //         const encryptedUrl = res.data;
  //         window.open(encryptedUrl, '_blank');
  //       },
  //       (err) => {
  //         this.toast.error({ detail: "Error", summary: "Error from re-direction", duration: 3000 });
  //       }
  //     );
  //   } else if (action === 'withoutmodify' && this.paymentStatus == "" && this.paymentStatus != "SUCCESS" && this.paymentStatus != "PENDING") {
  //     const renewalInfoRequestBody = {
  //       policy_Number: proposerDetail.policyNumber,
  //     };
  //     this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
  //       (res: any) => {
  //         if (res.statusCode == 200 && res.isSuccess == true && Object.keys(res.data).length > 0) {
  //           const formData = this.encryptionService.encrypt(res.data);
  //           const proposalNum = this.encryptionService.encrypt(this.proposalNum);
  //           const policyNumber = this.encryptionService.encrypt(proposerDetail.policyNumber);
  //           const journeyProcess = this.encryptionService.encrypt(0);
  //           this.router.navigate(['renewal/renewalJourney'], {
  //             state: {
  //               formData: formData,
  //               proposalNum: proposalNum,
  //               policyNumber: policyNumber,
  //               journeyProcess: journeyProcess,
  //               formIndex: "0",
  //             },
  //           });
  //         } else if(res.message?.toLowerCase().includes("policy renewed")) {
  //           this.toast.success({ detail: "Success", summary: res.message || "renewal Success", duration: 3000 });
  //         } else {
  //           this.toast.warning({ detail: "Warning", summary: res.message || "Error while getting renewal Information.", duration: 3000 });
  //         }
  //       },
  //       (err) => {
  //         this.toast.error({ detail: "Error", summary: "Error while getting renewal Information.", duration: 3000 });
  //       }
  //     );
  //   }
  // }

  async renewalJourney(proposerDetail: RenewalList, action: string | null = null) {
    try {
      await this.getProposalNum();
      const paymentStatusRequestBody = { policyNumber: proposerDetail.policyNumber };
      const paymentDetailResponse: any = await firstValueFrom(this.renewalService.getpaymentdetailsbypolicynoApi(paymentStatusRequestBody));
      if (paymentDetailResponse.message.toLowerCase().includes("policy renewed")) {
        this.toast.success({ detail: "Success", summary: paymentDetailResponse.message, duration: 3000 });
        return;
      }
      if (!paymentDetailResponse?.isSuccess || !paymentDetailResponse?.data || Object.keys(paymentDetailResponse.data).length === 0) {
        if (action === "withmodify") {
          const formatDate = (date: string): string => {
            if (!date) return "";
            const parsedDate = new Date(date);
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const year = parsedDate.getFullYear();
            return `${month}/${day}/${year}`;
          };
          const payload = {
            policyNumber: proposerDetail.policyNumber,
            dateOfBirth: formatDate(proposerDetail.proposerDateOfBirth || ""),
            mobileNumber: "",
          };
          const redirectionResponse: any = await firstValueFrom(this.renewalService.cpRedirectionApi(payload));
          const encryptedUrl = redirectionResponse.data;
          window.open(encryptedUrl, "_blank");
        } else if (action === "withoutmodify") {
          const renewalInfoRequestBody = { policy_Number: proposerDetail.policyNumber };
          const renewalInfoResponse: any = await firstValueFrom(this.renewalService.getRenewalInfoApi(renewalInfoRequestBody));
          if (renewalInfoResponse.statusCode === 200 && renewalInfoResponse.isSuccess === true && Object.keys(renewalInfoResponse.data).length > 0) {
            this.router.navigate(["renewal/renewalJourney"], {
              state: {
                formData: this.encryptionService.encrypt(renewalInfoResponse.data),
                proposalNum: this.encryptionService.encrypt(this.proposalNum),
                policyNumber: this.encryptionService.encrypt(proposerDetail.policyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formIndex: "0",
              },
            });
          } else if (renewalInfoResponse.message?.toLowerCase().includes("policy renewed")) {
            this.toast.success({ detail: "Success", summary: renewalInfoResponse.message || "Renewal Success", duration: 3000 });
          } else {
            this.toast.warning({ detail: "Warning", summary: renewalInfoResponse.message || "Error while getting renewal Information.", duration: 3000 });
          }
        }
        return;
      }
      const paymentDetail = paymentDetailResponse.data;
      this.paymentStatus = paymentDetail?.paymentStatus.toUpperCase();
      const formData = {
        proposalNumber: paymentDetail?.fullQuoteResponse?.proposalNumber || '',
        policyNumber: paymentDetail?.fullQuoteResponse?.policyNumber || '',
        policyStatus: paymentDetail?.policyStatus || '',
        policyStartDate: paymentDetail?.fullQuoteResponse?.policyStartDate || '',
        policyEndDate: paymentDetail?.fullQuoteResponse?.policyEndDate || '',
        receiptID: paymentDetail?.fullQuoteResponse?.receiptID || '',
        customerId: paymentDetail?.customerId || '',
        applicationNumber: paymentDetail?.applicationNumber || '',
        status: paymentDetail?.fullQuoteResponse?.status || '',
        productName: paymentDetail?.productName || '',
        premiumPaid: paymentDetail?.fullQuoteResponse?.premiumPaid || '',
        isFullQuoteSuccess: paymentDetail?.isFullQuoteSuccess || false,
        paymentMessage: "",
        paymentStatus: paymentDetail?.paymentStatus,
      };
      if (paymentDetail?.paymentStatus.toUpperCase() === "SUCCESS" || paymentDetail?.paymentStatus.toUpperCase().startsWith("IN")) {
        if (paymentDetail?.isFullQuoteSuccess) {
          if (paymentDetail.errorMessage) {
            this.toast.success({ detail: "Success", summary: paymentDetail.errorMessage, duration: 5000 });
          }
          this.router.navigate(["renewal/renewalJourney"], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              proposalNum: this.encryptionService.encrypt(""),
              policyNumber: this.encryptionService.encrypt(paymentDetail?.oldPolicyNumber),
              journeyProcess: this.encryptionService.encrypt(0),
              formIndex: "1",
            },
          });
        } else {
          if (paymentDetail?.errorMessage) {
            this.toast.warning({ detail: "Warning", summary: paymentDetail?.errorMessage, duration: 5000 });
          }
          formData.paymentMessage = "Payment completed successfully; policy issuance pending";
          this.router.navigate(["renewal/renewalJourney"], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              policyNumber: this.encryptionService.encrypt(paymentDetail?.oldPolicyNumber),
              formIndex: "1",
            },
          });
        }
      } else if (paymentDetail?.paymentStatus.toUpperCase() === "INPROGRESS" || paymentDetail?.paymentStatus.toUpperCase() === "PENDING") {
        formData.paymentMessage = "Payment pending; please wait for processing";
        this.toast.warning({ detail: "Warning", summary: paymentDetail.errorMessage || "Payment Pending", duration: 5000 });
        this.router.navigate(["renewal/renewalJourney"], {
          state: {
            formData: this.encryptionService.encrypt(formData),
            policyNumber: this.encryptionService.encrypt(paymentDetail?.oldPolicyNumber),
            paymentStatus: this.encryptionService.encrypt(paymentDetail?.paymentStatus),
            formIndex: "1",
          },
        });
      }
    } catch (err) {
      this.toast.error({ detail: "Error", summary: "Error while processing renewal journey.", duration: 3000 });
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
    this.checkView();
  }

  checkView() {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      this.selectedView = 'grid';
    } else {
      this.selectedView = 'list';
    }
  }
}