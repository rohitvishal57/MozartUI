import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute,Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent {  
    data: any[] = [];
    tableData:any={}
    filteredData: any[] = [];
    filterCounts = {
      all: 0,
      '30days': 0,
      '30-60days': 0,
      '60-90days': 0,
      expired: 0
    };
    activeFilter: string = 'all'; 
  
    p: number = 1;
    selectedView: string = 'list';
    showSearch: boolean = false;
    showEllipsisDropdown: number | null = null;
    
    subscription!: Subscription;
    searchString: string = '';
  
    productsList:any[]=[];
    policyTypes:any[]=[];
    fromDate: string = '';
    toDate: string = '';
    appliedFiltersCount: number = 0;
  
    toggeledropdown:boolean=false;
  
    showSubQuotes: boolean = false;
    showComparison: boolean = false;
  
    
    members = [
      {
        quote:'Base Quote',
        proposer: 'Kridhnan',
        product: 'Active User',
        policyNo: '23-22-0175217-00',
        renewalPremium: {
          amount: '₹25558',
          benefits: 'HR benefits of ₹786 added'
        },
        mobileNo: '7123456789',
        dateOfRenewal: '2023-03-15',
        modification: 'Member added tenure 1 year'
      },
      {
        quote:'Sub Quote',
        proposer: 'John Doe',
        product: 'Premium User',
        policyNo: '45-67-0123456-00',
        renewalPremium: {
          amount: '₹35000',
          benefits: 'HR benefits of ₹900 added'
        },
        mobileNo: '7890123456',
        dateOfRenewal: '2023-04-20',
        modification: 'Coverage increased tenure 2 years'
      },
      {
        quote:'Base Quote1',
        proposer: 'krishnavamsi bhavani',
        product: 'Active User',
        policyNo: '23-22-0175217-00',
        renewalPremium: {
          amount: '₹25558',
          benefits: 'HR benefits of ₹786 added'
        },
        mobileNo: '7123456789',
        dateOfRenewal: '2023-03-15',
        modification: 'Member added tenure 1 year'
      },
      // Add 3 more members with their details
    ];
  
    @ViewChild('filterSection', { static: false }) filterSection!: ElementRef;
  
    constructor(private http: HttpClient, private renderer: Renderer2, private eRef: ElementRef, private commonService: CommonService,private loginService:LoginService,private router:Router,private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.fetchData();
      this.getProducts();
  
      this.route.queryParams.subscribe(params => {
        this.showSubQuotes = params['showSubQuotes'] === 'true';
      });
    }
  
    fetchData(): void {
      this.http.get<any[]>('/assets/jsonValue/renewalList.json').subscribe(data => {
        this.data = data;
        console.log("data",this.data);
        this.filterQuotes(this.activeFilter); 
      });
      // this.http.get<any[]>('/assets/json/quotes.json').subscribe(data => {
      //   // this.data = data;
      //   console.log("data",data.renewa);
      //   this.filterQuotes(this.activeFilter); 
      // });
      this.subscription = this.commonService.currSearchString.subscribe(res => this.searchString = res);
    }
  
  
    filterQuotes(filter: string) {
      this.activeFilter = filter;
    
      const currentDate = new Date();
      const fromDate = this.fromDate ? new Date(this.fromDate) : null;
      const toDate = this.toDate ? new Date(this.toDate) : null;
    
      const selectedProducts = this.productsList
        .filter(product => product.selected)
        .map(product => product.productname);
      
      const selectedPolicyTypes = this.policyTypes
        .filter(policyType => policyType.selected)
        .map(policyType => policyType.name);
    
      // Reset counts
      this.filterCounts = {
        all: 0,
        '30days': 0,
        '30-60days': 0,
        '60-90days': 0,
        expired: 0
      };
    
      // Filter data and update counts
      this.filteredData = this.data.filter((item) => {
        const renewalDate = new Date(item.DateOfRenewal);
        const dateDiff = Math.ceil((renewalDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
        // Check if renewalDate is within the selected date range
        const dateInRange = (!fromDate || renewalDate >= fromDate) && (!toDate || renewalDate <= toDate);
    
        // Apply the selected product and policy type filters
        const productFilter = selectedProducts.length > 0 ? selectedProducts.includes(item.Plan) : true;
        const policyTypeFilter = selectedPolicyTypes.length > 0 ? selectedPolicyTypes.includes(item.PolicyType) : true;
    
        const passesAllFilters = productFilter && policyTypeFilter && dateInRange;
    
        // Increment counts based on the renewal date and if the item passes all filters
        if (passesAllFilters) {
          this.filterCounts['all']++;
    
          if (dateDiff >= 0 && dateDiff <= 30) {
            this.filterCounts['30days']++;
          } else if (dateDiff > 30 && dateDiff <= 60) {
            this.filterCounts['30-60days']++;
          } else if (dateDiff > 60 && dateDiff <= 90) {
            this.filterCounts['60-90days']++;
          } else if (dateDiff < 0) {
            this.filterCounts['expired']++;
          }
        }
    
        // Apply the final filter to return the appropriate items for the active filter
        switch (filter) {
          case 'all':
            return passesAllFilters;
          case '30days':
            return dateDiff >= 0 && dateDiff <= 30 && passesAllFilters;
          case '30-60days':
            return dateDiff > 30 && dateDiff <= 60 && passesAllFilters;
          case '60-90days':
            return dateDiff > 60 && dateDiff <= 90 && passesAllFilters;
          case 'expired':
            return dateDiff < 0 && passesAllFilters;
          default:
            return passesAllFilters;
        }
      });
    }
    
    getProducts() {
      this.loginService.getAllProductList(13, 2001, 101).subscribe({
        next: (res) => {
          this.productsList = res;
    
          // Extract unique familyplan values and transform them into objects with a 'selected' property
          const uniquePolicyTypes = Array.from(new Set(this.productsList.map(product => product.familyplan)))
            .map(policyType => ({ name: policyType, selected: false }));
    
          this.policyTypes = uniquePolicyTypes;
        },
        error: (err) => { console.log("error", err); }
      });
    }
    
     // Method to calculate the number of applied filters
     calculateAppliedFiltersCount():number {
      const selectedProductsCount = this.productsList.filter(product => product.selected).length;
      const selectedPolicyTypesCount = this.policyTypes.filter(policyType => policyType.selected).length;
    
      // Initialize count with the selected products and policy types
      let count = selectedProductsCount + selectedPolicyTypesCount;
    
      // Check if date range filters are applied (either fromDate or toDate)
      if (this.fromDate  && this.toDate) {
        count++;
      }
    
      this.appliedFiltersCount = count;
      return  this.appliedFiltersCount
    }
    
  
    toggleFilterDropdown()
    {
      this.toggeledropdown=!this.toggeledropdown;
    }
  
    applyFilter() {
      this.calculateAppliedFiltersCount();
      this.filterQuotes(this.activeFilter);
      this.toggeledropdown=false;
      this.fromDate = ''; 
      this.toDate = '';   
    }
    
    getApplyButtonClass(): string {
      return this.calculateAppliedFiltersCount() > 0 ? 'apply-btn-red' : '';
    }
    // Call this method whenever a filter is canceled
    cancel() {
      this.productsList.forEach(product => product.selected = false);
      this.policyTypes.forEach(policyType => policyType.selected = false);
      this.calculateAppliedFiltersCount();
      this.filterQuotes(this.activeFilter);
      this.toggeledropdown=false;
      this.fromDate = ''; 
      this.toDate = '';   
    }
  
    toggleSearch(): void {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.renderer.addClass(this.filterSection.nativeElement, 'blur');
      } else {
        this.renderer.removeClass(this.filterSection.nativeElement, 'blur');
      }
    }
  
    getStarClass(rating: number): string {
      console.log("star class method is working")
      if (rating >= 8) {
        return 'green-star';
      } else if (rating >= 4 && rating <= 7) {
        return 'yellow-star';
      } else if (rating >= 1 && rating <= 3) {
        return 'red-star';
      } else {
        return ''; // Default class or no class
      }
    }
    
    quotesViews(view: string) {
      this.selectedView = view; 
    }
  
    toggleEllipsisDropdown(index: number): void {
      this.showEllipsisDropdown = this.showEllipsisDropdown === index ? null : index;
    }
  
    download(item: any): void {
      this.toggleEllipsisDropdown(null as unknown as number);
    }
  
    delete(item: any): void {
      this.toggleEllipsisDropdown(null as unknown as number);
    }
  
    shareViaEmail(item: any): void {
      this.toggleEllipsisDropdown(null as unknown as number);
    }
  
    sendRenewalNotice(item: any): void {
      this.toggleEllipsisDropdown(null as unknown as number);
    }
  
    createAutoDebitLink(item: any): void {
      this.toggleEllipsisDropdown(null as unknown as number);
    }
  
    handleEnter(): void {
      this.toggleSearch();
    }
  
    handleBlur(event: FocusEvent): void {
      this.toggleSearch();
    }
  
    handleSearchString() {
      this.commonService.updateSearchString(this.searchString);
    }
   
    renewalJoureney()
    {
        this.router.navigate(['portal/agent/renewalDynamicForm']);
            }
    
    compareSelectedQuotes() {
      this.showSubQuotes = false;
      this.showComparison = true;
    }

}