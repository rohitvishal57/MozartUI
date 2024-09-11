import {Component,ElementRef,HostListener,OnInit,} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "src/app/services/common.service";
import { LoginService } from "src/app/services/login.service";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalServiceService } from "src/app/services/renewal/renewal-service.service";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { AdminService } from "src/app/services/admin.service";

@Component({
  selector: "app-quotes",
  templateUrl: "./quotes.component.html",
  styleUrls: ["./quotes.component.scss"],
})
export class QuotesComponent implements OnInit {
  renewalsList: RenewalList[] = [];
  countsList: any = [];
  renewedDate: any;
  activeFilter: string = "all";
  page: number = 1;
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 0;
  selectedView: string = "list";
  selectedQuotesView: string = "quotesGrid";
  showEllipsisDropdown: number | null = null;
  productsList: any[] = [];
  policyTypes: any[] = [];
  startDate: any;
  endDate: any;
  appliedFiltersCount: number = 0;
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  showSubQuotes: boolean = false;
  showComparison: boolean = false;
  selected: string = "";
  searchInputControl = new FormControl("");
  isDesktopView:boolean=false

  members = [
    {
      quote: "Base Quote",
      proposer: "Kridhnan",
      product: "Active User",
      policyNo: "23-22-0175217-00",
      renewalPremium: {
        amount: "₹25558",
        benefits: "HR benefits of ₹786 added",
      },
      mobileNo: "7123456789",
      dateOfRenewal: "2023-03-15",
      modification: "Member added tenure 1 year",
    },
    {
      quote: "Sub Quote",
      proposer: "John Doe",
      product: "Premium User",
      policyNo: "45-67-0123456-00",
      renewalPremium: {
        amount: "₹35000",
        benefits: "HR benefits of ₹900 added",
      },
      mobileNo: "7890123456",
      dateOfRenewal: "2023-04-20",
      modification: "Coverage increased tenure 2 years",
    },
    {
      quote: "Base Quote1",
      proposer: "krishnavamsi bhavani",
      product: "Active User",
      policyNo: "23-22-0175217-00",
      renewalPremium: {
        amount: "₹25558",
        benefits: "HR benefits of ₹786 added",
      },
      mobileNo: "7123456789",
      dateOfRenewal: "2023-03-15",
      modification: "Member added tenure 1 year",
    },
  ];

  constructor(
    private http: HttpClient,
    private renewalService: RenewalServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private adminService:AdminService,private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getRenewalsList();
    this.getProducts();
    this.route.queryParams.subscribe((params) => {
      this.showSubQuotes = params["showSubQuotes"] === "true";
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows; 
    this.page = Math.floor(this.first / this.rows) + 1;
    // console.log('First index:', this.first, 'Rows:', this.rows, 'Page:', this.page);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      // this.isSidenavOpen = false;
    }
  }

  renewalLisRequestBody={
    "agentCode": "5100003",
    "proposer": "",
    "productName": "",
    "policyNumber": "",
    "policyType": "",
    "startDate": null as string | null,
    "endDate": null as string | null,
    "pageNumber": 1,
    "pageSize": 10,
    "mobileNumber": "",
    "filterType": ""
  }

  getRenewalsList() {
    this.renewalService.getRenewalListApi(this.renewalLisRequestBody).subscribe(
      (response) => {        
        if (response.success) {
          this.renewalsList = response.data.renewalsList.map((item: any) => ({
            ...item,renewedDate: this.formatRenewedDate(item.renewedDate)}));
          this.countsList = response.data;
          this.totalRecords=this.renewalsList.length;
        } else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        console.error("Error from API:", error);
      }
    );
  }

  formatRenewedDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "yyyy-MM-dd") || "";
  }

  filterQuotes(filter: string) {
    this.renewalLisRequestBody.filterType = filter;
    this.getRenewalsList();
    this.activeFilter = filter;
  }

  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }
  
  getStarClass(rating: number): string {
    if (rating >= 8) {
      return "green-star";
    } else if (rating >= 4 && rating <= 7) {
      return "yellow-star";
    } else if (rating >= 1 && rating <= 3) {
      return "red-star";
    } else {
      return "";
    }
  }

  getProducts() {
    this.adminService.getAllProductList().subscribe({
      next: (res) => {
        this.productsList = res;        
        const uniquePolicyTypes = Array.from(new Set(this.productsList
        .map((product) => product.familyPlan)))
        .map((policyType) => ({ name: policyType, selected: false }));
        this.policyTypes = uniquePolicyTypes;
      },
      error: (err) => {
        console.log("error", err);
      },
    });
  }

  toggleFilterDropdown() {
    if(this.toggeleSearchdropdown==true)
    {
       this.toggeleSearchdropdown=false;
    }
    this.toggeledropdown = !this.toggeledropdown;
  }

  calculateAppliedFiltersCount(): number {
    const selectedProductsCount = this.productsList.filter(
      (product) => product.selected
    ).length;
    const selectedPolicyTypesCount = this.policyTypes.filter(
      (policyType) => policyType.selected
    ).length;
    let count = selectedProductsCount + selectedPolicyTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }

    this.appliedFiltersCount = count;
    return this.appliedFiltersCount;
  }

  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
    console.log("startDate",this.startDate,"endDate",this.endDate);
    
    this.renewalLisRequestBody.startDate=this.startDate;
    console.log("start date taken by request body",this.renewalLisRequestBody.startDate);
    this.renewalLisRequestBody.endDate=this.endDate;
    console.log("end date taken by request body",this.renewalLisRequestBody.endDate);
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
      console.log("selectedProducts",selectedProducts);
      
    this.renewalLisRequestBody.productName = selectedProducts.join(", ");
     console.log("product names which are taking by request body",this.renewalLisRequestBody.productName);
     
    const selectedPolicyTypes = this.policyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
      console.log("selecteed policy types",selectedPolicyTypes);
      
    this.renewalLisRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body",this.renewalLisRequestBody.policyType);
    
    this.getRenewalsList();
    this.toggeledropdown = false;
  }

  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.renewalLisRequestBody.productName = "";
    this.renewalLisRequestBody.policyType = "";
    this.renewalLisRequestBody.startDate = null;
    this.renewalLisRequestBody.endDate = null;
    this.toggeledropdown = false;
    this.getRenewalsList();
  }
  
  
  getApplyButtonClass(): string {
    return this.calculateAppliedFiltersCount() > 0 ? "apply-btn-red" : "";
  }

  toggleSearchDropdown() {
    if(this.toggeledropdown==true)
    {
      this.toggeledropdown=false;
    }
    this.toggeleSearchdropdown = !this.toggeleSearchdropdown;
  }

  onSelectChanges(event: any): void {
    event.stopPropagation(); // Prevents the menu from closing
    this.selected !== "none";
    console.log("selected value", this.selected);
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();
  
    if (this.selected === "mobileNo") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[6-9][0-9]{9}$"),
      ]);
    } 
    else if (this.selected === "name") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    } 
    // Uncomment if you need policyNumber
    // else if (this.selected === "policyNumber") {
    //   this.searchInputControl.setValidators([
    //     Validators.required,
    //     Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
    //   ]);
    // }
    
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched(); 
  }
  menuClosed(): void {
    // Add logic here if you need to handle anything when the menu closes
  }
  
  

  getPlaceholder(): string {
    if (this.selected === "mobileNo") {
      return "Enter Mobile Number";
    } else if (this.selected === "name") {
      return "Enter Proposer Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } 
    else {
      return "";
    }
  }
  getErrorMessage(): string {
    if (this.searchInputControl.hasError("required")) {
      return "This field is required";
    } 
    else if (this.searchInputControl.hasError("pattern")) {
      if (this.selected === "mobileNo") {
        return "Invalid Mobile Number";
      } else if (this.selected === "name") {
        return "Invalid Proposer Name";
      }
    }
    return "";
  }
  cancelSearch() {
    this.toggeleSearchdropdown = false;
    this.selected = "";
    this.renewalLisRequestBody.mobileNumber=""
    this.renewalLisRequestBody.proposer=""
    this.renewalLisRequestBody.policyNumber=""
    this.getRenewalsList()
  }

  applySearch() {
    if (this.searchInputControl.valid) {
      if (this.selected === "mobileNo") {
        this.renewalLisRequestBody.mobileNumber =this.searchInputControl.value!;
        console.log(this.renewalLisRequestBody.mobileNumber);
      } 
      else if (this.selected === "name") {
        this.renewalLisRequestBody.proposer = this.searchInputControl.value!;
      }
      else if (this.selected === "policyNumber") {
        this.renewalLisRequestBody.policyNumber = this.searchInputControl.value!;
      }
      this.getRenewalsList();
      this.toggeleSearchdropdown = false;
    } 
    else {
      this.toggeleSearchdropdown = true;
    }
  }

  
  quotesViews(view: string) {
    this.selectedView = view;
  }
  subQuotesViews(view: string) {
    this.selectedQuotesView = view;
  }

  handleAction(item: RenewalList, event: string) {
    switch (event) {
      case 'renew':
        break;
      case 'modify':
        this.renewalJourney(item);
        break;
      case 'download':
        break;
      case 'copyPayLink':
        break;
      case 'registerNow':
        break;
      case 'delete':
        break;
      default:
        console.warn('Unknown action:', event);
    }
  }
  
  renewalJourney(proposerDetail : RenewalList) {
    this.router.navigate(["/portal/agent/renewalDynamicForm"]);
  }

  compareSelectedQuotes() {
    this.showSubQuotes = false;
    this.showComparison = true;
  }
  
}
