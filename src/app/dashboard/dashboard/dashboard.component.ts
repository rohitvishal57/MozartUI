import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProfileService } from 'src/app/profile/profile.service';
import { DashboardService } from './dashboard.service';
import Chart, { ChartData } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;
  profileDetails: any;
  searchedData: any;
  customerInfo: any;
  showSearchedResults = false;
  performanceCard: any = [];
  tabsInfo: any = [];
  renewalDetail: any = [];
  quickActionDetails: any = [];
  businessSummary: any;

  public chart: any;
  public Leadchart: any;
  public proposalChart: any;
  public renewChart: any;
  public customerchart: any;
  public servicingchart: any;
  public dhaChart: any;

  @ViewChild('chartCanvas') chartCanvas: ElementRef | undefined;
  @ViewChild('chartPropCanvas') chartPropCanvas: ElementRef | undefined;
  @ViewChild('chartRenewCanvas') chartRenewCanvas: ElementRef | undefined;
  @ViewChild('chartPersistencyCanvas') chartPersistencyCanvas: ElementRef | undefined;
  @ViewChild('chartDHACanvas') chartDHACanvas: ElementRef | undefined;
  @ViewChild('chartCustomerCanvas') chartCustomerCanvas: ElementRef | undefined;
  @ViewChild('chartServicingCanvas') chartServicingCanvas: ElementRef | undefined;
  searchedValue: any;
  serviceInfo: any;
  wellnessInfo: any;
  dhaCard: any = [];

  otherSection: any = [];
  dhaSection: any = [];

  ProductList: any;
 isDesktopView: boolean = false;

  newSectionList: any;
  newCustomerList: any;
  newRenewalList: any;
  newBusinessList: any;
  newQuickActionList: any;
  newPerformanceList: any;

  performanceFilter = 'Quarterly';
  performanceFilterList = ['Monthly', 'Quarterly', 'Yearly']
  businessFilter = 'Last7Days';
  busninessFilterList = ['Last7Days', 'LastMonth', 'QuarterWise', 'FinancialYear'];
  widgetArr = [
    {
      name: 'QuickAction', isFilter: false
    },
    {
      name: 'Performance', isFilter: true, filterType: this.performanceFilter
    },
    {
      name: 'Business', isFilter: true, filterType: this.businessFilter
    },
    {
      name: 'Customer', isFilter: false
    },
    {
      name: 'Servicing', isFilter: false
    },
    {
      name: 'Wellness', isFilter: false
    }
  ];

  newOrderList: any = [
    {
      "widgetName": "QuickAction",
      "order": 1,
      "category": [
        {
          "categoryName": "birthdayDetails",
          "subOrder": 1
        },
        {
          "categoryName": "eventDetails",
          "subOrder": 2
        },
        {
          "categoryName": "notifications",
          "subOrder": 3
        }
      ]
    },
    {
      "widgetName": "ABHI",
      "order": 2,
      "category": [
        {
          "categoryName": "birthdayDetails",
          "subOrder": 1
        },
        {
          "categoryName": "eventDetails",
          "subOrder": 2
        },
        {
          "categoryName": "notifications",
          "subOrder": 3
        }
      ]
    },
    {
      "widgetName": "Performance",
      "order": 3,
      "category": [
        {
          "categoryName": "My Goals",
          "subOrder": 1
        },
        {
          "categoryName": "Policies Sold",
          "subOrder": 2
        },
        {
          "categoryName": "Premium",
          "subOrder": 3
        },
        {
          "categoryName": "Commission Earned",
          "subOrder": 4
        }
      ]
    },
    {
      "widgetName": "Business",
      "order": 4,
      "category": [
        {
          "categoryName": "Leads",
          "subOrder": 1
        },
        {
          "categoryName": "Proposals",
          "subOrder": 2
        }
      ]
    },
    {
      "widgetName": "Renewal",
      "order": 5,
      "category": [
        {
          "categoryName": "Renewal",
          "subOrder": 1
        },
        {
          "categoryName": "Persistency",
          "subOrder": 2
        }
      ]
    },
    {
      "widgetName": "Servicing",
      "order": 6,
      "category": [
        {
          "categoryName": "Claims",
          "subOrder": 1
        },
        {
          "categoryName": "Customer",
          "subOrder": 2
        }
      ]
    },
    {
      "widgetName": "Wellness",
      "order": 7,
      "category": [
        {
          "categoryName": "DHA",
          "subOrder": 1
        },
        {
          "categoryName": "TopSellingProducts",
          "subOrder": 2
        }
      ]
    }
  ];
  newWellnessList: any;

  constructor(private route: Router, private languageService: LanguageService, private profileService: ProfileService,
    private translateService: TranslateService, private dashboardService: DashboardService, private el: ElementRef) {
  }

  ngOnInit() {
    this.performanceCard = [];
    this.tabsInfo = [];
    this.otherSection = [];
    this.quickActionDetails = [];
    this.renewalDetail = [];
    this.otherSection = [];
    this.dhaSection = [];
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    this.profileService.getProfileDetails(reqData).subscribe((res: any) => {
      if (res.isSuccess) {
        this.profileDetails = res.data;
      }
    });
    this.dashboardService.getPreferences(localStorage.getItem('agentCode')).subscribe((res: any) => {
      if (res.isSuccess) {
        console.log('get preferences', res.data[0].preferences)
        let arr = res.data && res.data[0].preferences.length ? res.data[0].preferences : this.newOrderList
        this.newOrderList = arr
          .sort((a: any, b: any) => a.order - b.order)
          .map((item: any) => {
            item.category = item.category.sort((c: any, d: any) => c.subOrder - d.subOrder);
            return item;
          });

      }
    });
    this.fetchWidgets();
    this.createRenewChart();
    this.getPoductList();
    this.checkScreenSize();
  }

  getTimeOfDay() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Evening";
    } else {
      return "Night";
    }
  }

  dropPerformance(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.performanceCard, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.performanceCard, 'Performance')
  }

  dropQuickAct(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.quickActionDetails, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.quickActionDetails, 'QuickAction')
  }

  dropTabs(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabsInfo, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.tabsInfo, 'Business')
  }

  dropRenewal(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.renewalDetail, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.renewalDetail, 'Renewal')
  }

  dropCharts(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.otherSection, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.otherSection, 'Customer')
  }

  dropSections(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.newOrderList, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.newOrderList, 'section')
  }

  dropWellness(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dhaSection, event.previousIndex, event.currentIndex);
    this.getOrderBy(this.dhaSection, 'Wellness')
  }

  getOrderBy(widget: any, key: any) {
    switch (key) {
      case 'section':
        this.newSectionList = widget.map((item: any, index: any) => {
          return { name: item, order: index + 1 };
        });
        console.log(this.newSectionList)
        break;
      case 'Customer':
        this.newCustomerList = widget.map((item: any, index: any) => {
          return { main: 'Customer', name: item, subOrder: index + 1 };
        });
        console.log(this.newCustomerList)
        break;
      case 'Renewal':
        this.newRenewalList = widget.map((item: any, index: any) => {
          return { main: 'Renewal', name: item, subOrder: index + 1 };
        });
        console.log(this.newRenewalList)
        break;
      case 'Business':
        this.newBusinessList = widget.map((item: any, index: any) => {
          return { main: 'Business', name: item, subOrder: index + 1 };
        });
        console.log(this.newBusinessList)
        break;
      case 'QuickAction':
        this.newQuickActionList = widget.map((item: any, index: any) => {
          return { main: 'QuickAction', name: item, subOrder: index + 1 };
        });
        console.log(this.newQuickActionList)
        break;

      case 'Performance':
        this.newPerformanceList = widget.map((item: any, index: any) => {
          return { main: 'Performance', name: item, subOrder: index + 1 };
        });
        console.log(this.newPerformanceList)
        break;

      case 'Wellness':
        this.newWellnessList = widget.map((item: any, index: any) => {
          return { main: 'Wellness', name: item, subOrder: index + 1 };
        });
        console.log(this.newWellnessList)
        break;

      default:
        break;
    }

  }

  getQuote() {
    this.showCard = true;
    this.showDropdownsFlag = true;
    console.log('showCard:', this.showCard);
  }

  createLead() {
    this.route.navigate(['/leads/createLead'], {
    });
  }

  onSearch() {
    const obj = {
      "agentCode": localStorage.getItem('agentCode'),
      "searchValue": this.searchedValue
    }
    this.dashboardService.searchByPrefix(obj).subscribe(res => {
      this.searchedData = res?.data;
      this.showSearchedResults = true;
    })
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.el.nativeElement.contains(event.target)) {
      this.showSearchedResults = false;
    }
  }

  onRedirectBasedonSource(data: any) {
    const fullNumber = data?.searchValue;
    const extractedValue = fullNumber.slice(8) == localStorage.getItem('agentCode') ? true : false;

    if (data?.searchValue.includes('UPL')) {
      this.route.navigate(['leads/leadsList'])
    } else if (data?.searchValue.includes('UPP')) {
      this.route.navigate(['proposals/proposalsList'])
    } else if (extractedValue) {
      this.route.navigate(['claims/claimsList'])
    } else {
      this.route.navigate(['customers/customersList'])
    }
  }



  fetchWidgets() {
    this.widgetArr.forEach(element => {
      const obj = {
        "WidgetName": element.name,
        "FilterType": element.isFilter ? element.filterType : '',
        "AgentCode": localStorage.getItem('agentCode')
      }

      switch (element.name) {
        case 'Performance':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            console.log('performance', res.data);
            res.data.length && Object.keys(res.data[0]).forEach(el => {
              switch (el) {
                case 'nops':
                  const nops = {
                    title: 'Policies Sold',
                    value: res.data[0][el],
                    description: `Policies sold as per selected range ${res.data[0][el]}`,
                    icon: 'assets/Img/icon_dashboard_policysold.svg',
                    subIcon: 'assets/Img/icon_price_tag.svg',
                    type: 'text',
                    class: ''
                  }
                  this.performanceCard.push(nops)
                  break;

                case 'premiumEarned':
                  const premiumEarned = {
                    title: 'Premium',
                    value: res.data[0][el],
                    description: `${res.data[0][el]} of monthly goal achieved`,
                    icon: 'assets/Img/icon_dashboard_premium.svg',
                    type: 'progress',
                    progress: res.data[0][el],
                    class: 'premium'
                  }
                  this.performanceCard.push(premiumEarned)
                  break;

                case 'commissionEarned':
                  const commissionEarned = {
                    title: 'Commission Earned',
                    value: res.data[0][el],
                    description: `You can potentially earned ${res.data[0][el]}`,
                    icon: 'assets/Img/icon_dashboard_healthreturn.svg',
                    type: 'action',
                    class: 'commission-earned'
                  }
                  this.performanceCard.push(commissionEarned)
                  break;

                case 'achievementsPercentage':
                  const achievementsPercentage = {
                    title: 'My Goals',
                    value: res.data[0][el],
                    description: 'Achievement',
                    icon: 'assets/Img/icon_dashboard_myperformance.svg',
                    type: 'gauge',
                    progress: res.data[0][el],
                    class: 'my-goals'
                  }
                  this.performanceCard.push(achievementsPercentage)
                  break;

                default:
                  break;
              }
            })
          })
          break;

        case 'Customer':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            console.log('customer', res.data)
            this.customerInfo = res.data;
            this.otherSection.push({
              widgetName: 'Customer',
              chart: 'Customer',
              isShow: true,
              totalCount: Object.entries(res.data).map(([name, count]) => ({ name, count })).reduce((sum: any, item: any) => item.count, 0),
              category: Object.entries(res.data).map(([name, count]) => ({
                name: name.replace("Count", "").replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase()), // Capitalize heading
                count: count
              }))
            })
          })
          break;

        case 'Servicing':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            console.log('Servicing', res.data)
            this.serviceInfo = res.data;
            this.otherSection.push({
              widgetName: 'Claims',
              chart: 'Claims',
              isShow: true,
              totalCount: Object.entries(res.data).map(([name, count]) => ({ name, count })).reduce((sum: any, item: any) => sum + item.count, 0),
              category: Object.entries(res.data).map(([name, count]) => ({
                name: name.replace("Count", "").replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase()), // Capitalize heading
                count: count
              }))
            })
          })
          break;

        case 'Wellness':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            this.dhaCard = Object.entries(res.data[0]).map(([name, count]) => ({
              name: name.replace("Count", "").replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase()), // Capitalize heading
              count: count,
            }))
            console.log(this.dhaCard);
            this.dhaSection.push({ name: 'DHA', value: this.dhaCard })
          })
          break;

        case 'Business':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe((res: any) => {
            console.log('Business', res.data);
            this.businessSummary = res.data;
            this.tabsInfo = [
              {
                widgetName: 'Leads',
                chart: 'Leads',
                totalCount: res.data.filter((item: any) => item.dataType === "Lead").reduce((sum: any, item: any) => sum + item.count, 0),
                category: res.data.filter((item: any) => item.dataType === "Lead").map((item: any) => ({
                  name: item.status,
                  count: item.count
                }))
              },
              {
                widgetName: 'Proposals',
                chart: 'Proposals',
                totalCount: res.data.filter((item: any) => item.dataType === "Proposal").reduce((sum: any, item: any) => sum + item.count, 0),
                category: res.data.filter((item: any) => item.dataType === "Proposal").map((item: any) => ({
                  name: item.status,
                  count: item.count
                }))
              }
            ];
            return this.tabsInfo;
          })
          break;

        default:
          this.dashboardService.fetchPerformanceDetails(obj).subscribe((res: any) => {
            Object.keys(res.data).forEach((el: any) => {
              this.quickActionDetails.push({
                name: el,
                value: res.data[el].slice(0, 4)
              })
            });

            console.log('Quick action', this.quickActionDetails);

          })
          break;
      }


    });
  }

  ngAfterViewInit(): void {
    // Ensure that the canvas is available before rendering the chart
    setTimeout(() => {
      this.fetchCharts();
    }, this.calculateDelay()); // Use setTimeout to ensure DOM is fully rendered before accessing the canvas
  }

  fetchCharts() {
    this.renderChart();
    this.renderPropChart();
    this.renderEXPropChart();
    // this.renderPersistencyChart();
    this.renderCustomerChart();
    this.renderServiceChart();
  }

  createChartData(): ChartData<'pie' | 'doughnut'> {
    const categories = this.businessSummary.filter((item: any) => item.dataType === 'Lead');
    const labels = categories.map((item: any) => item.status);
    const data = categories.map((item: any) => item.count);

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#58d68d',
          '#5dade2',
          '#dc7633',
          '#48c9b0',
          '#f5b041',
          '#af7ac5',
          '#ec7063'
        ], // Dynamic colors
        //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
      }]
    };
  }

  createPropChartData(): ChartData<'pie' | 'doughnut'> {
    const categories = this.businessSummary.filter((item: any) => item.dataType === 'Proposal');
    const labels = categories.map((item: any) => item.status);
    const data = categories.map((item: any) => item.count);

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#e74c3c',
          '#9b59b6',
          '#3498db',
          '#f39c12',
          '#1abc9c',
          '#27ae60',
          '#e67e22',
          '#f1c40f',
          '#95a5a6'
        ],
        // Dynamic colors
        //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
      }]
    };
  }

  renderChart(): void {
    if (this.chartCanvas && this.chartCanvas.nativeElement) {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get context from canvas.');
        return;
      }

      // Create the chart using Chart.js
      this.Leadchart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createChartData(), // Dynamic chart data
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 11,  // Reduce the font size of the legend labels
                  weight: 'normal',  // Adjust the weight of the legend text
                  family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
                },
                boxWidth: 10,  // Set the width of the colored box (legend symbol)
                boxHeight: 10,  // Set the height of the colored box (legend symbol)
                padding: 5  // Adjust the padding around each legend item
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
                },
              },
            },
          },
          onClick: (event, activeElements) => {
            if (activeElements.length > 0) {
              // Using the correct context (chart instance) within the onClick handler
              const datasetIndex = activeElements[0].datasetIndex;
              const index = activeElements[0].index;
              const value = this.Leadchart.data.datasets[datasetIndex].data[index];  // Access data via `this.chart`
              const label = this.Leadchart.data.labels[index];  // Access labels via `this.chart`

              console.log(`Clicked on: ${label} with value ${value}`);
              //this.route.navigate(['/leads/leadsList/' + `${label}?=${value}`])

              this.route.navigate(['/leads/leadsList/'], {
                queryParams: { status: label, filter: this.businessFilter },
              });
            }
          }
        }
      });
    } else {
      console.error('Chart canvas element is not found.');
    }
  }

  renderPropChart(): void {
    if (this.chartPropCanvas && this.chartPropCanvas.nativeElement) {
      const canvas = this.chartPropCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get context from canvas.');
        return;
      }

      // Create the chart using Chart.js
      this.proposalChart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createPropChartData(), // Dynamic chart data
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 11,  // Reduce the font size of the legend labels
                  weight: 'normal',  // Adjust the weight of the legend text
                  family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
                },
                boxWidth: 10,  // Set the width of the colored box (legend symbol)
                boxHeight: 10,  // Set the height of the colored box (legend symbol)
                padding: 5  // Adjust the padding around each legend item
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
                },
              },
            },
          },
          onClick: (event, activeElements) => {
            if (activeElements.length > 0) {
              // Using the correct context (chart instance) within the onClick handler
              const datasetIndex = activeElements[0].datasetIndex;
              const index = activeElements[0].index;
              const value = this.proposalChart.data.datasets[datasetIndex].data[index];  // Access data via `this.chart`
              const label = this.proposalChart.data.labels[index];  // Access labels via `this.chart`

              console.log(`Clicked on: ${label} with value ${value}`);
              //this.route.navigate(['/leads/leadsList/' + `${label}?=${value}`])

              this.route.navigate(['/proposals/proposalsList/'], {
                queryParams: { status: label, filter: this.businessFilter },
              });
            }
          }
        }
      });
    } else {
      console.error('Chart canvas element is not found.');
    }
  }

  createEXChartData(): ChartData<'pie' | 'doughnut'> {
    const categories = this.renewalDetail.filter((k: any) => k.widgetName == 'Renewal')
    const labels = categories[0].category.map((item: any) => item.name);
    const data = categories[0].category.map((item: any) => item.count);
    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#e74c3c',
          '#9b59b6',
          '#3498db',
          '#f39c12',
          '#1abc9c'], // Dynamic colors
        //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
      }]
    };
  }

  renderEXPropChart(): void {
    if (this.chartRenewCanvas && this.chartRenewCanvas.nativeElement) {
      const canvas = this.chartRenewCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get context from canvas.');
        return;
      }

      // Create the chart using Chart.js
      this.renewChart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createEXChartData(), // Dynamic chart data
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',  // Move legend to the side (right or left)
              labels: {
                font: {
                  size: 11,  // Reduce the font size of the legend labels
                  weight: 'normal',  // Adjust the weight of the legend text
                  family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
                },
                boxWidth: 10,  // Set the width of the colored box (legend symbol)
                boxHeight: 10,  // Set the height of the colored box (legend symbol)
                padding: 5  // Adjust the padding around each legend item
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
                },
              },
            },
          },
          onClick: (event, activeElements) => {
            if (activeElements.length > 0) {
              // Using the correct context (chart instance) within the onClick handler
              const datasetIndex = activeElements[0].datasetIndex;
              const index = activeElements[0].index;
              const value = this.renewChart.data.datasets[datasetIndex].data[index];  // Access data via `this.chart`
              const label = this.renewChart.data.labels[index];  // Access labels via `this.chart`

              console.log(`Clicked on: ${label} with value ${value}`);
              //this.route.navigate(['/leads/leadsList/' + `${label}?=${value}`])

              this.route.navigate(['/renewal/renewalList/'], {
                queryParams: { filter: label },
              });
            }
          }
        }
      });
    } else {
      console.error('Chart canvas element is not found.');
    }
  }

  // createPersistencyChartData(): ChartData<'pie' | 'doughnut'> {
  //   const categories = this.renewalDetail.filter((k: any) => k.widgetName == 'Persistency')
  //   const labels = categories[0].category.map((item: any) => item.name);
  //   const data = categories[0].category.map((item: any) => item.count);
  //   return {
  //     labels: labels,
  //     datasets: [{
  //       data: data,
  //       backgroundColor: ['#e74c3c',
  //         '#9b59b6',
  //         '#3498db',
  //         '#f39c12',
  //         '#1abc9c'], // Dynamic colors
  //       //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
  //     }]
  //   };
  // }

  // renderPersistencyChart(): void {
  //   if (this.chartPersistencyCanvas && this.chartPersistencyCanvas.nativeElement) {
  //     const canvas = this.chartPersistencyCanvas.nativeElement;
  //     const ctx = canvas.getContext('2d');

  //     if (!ctx) {
  //       console.error('Failed to get context from canvas.');
  //       return;
  //     }

  //     // Create the chart using Chart.js
  //     this.renewChart = new Chart(ctx, {
  //       type: 'pie', // 'pie' or 'doughnut'
  //       data: this.createPersistencyChartData(), // Dynamic chart data
  //       options: {
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             position: 'bottom',  // Move legend to the side (right or left)
  //             labels: {
  //               font: {
  //                 size: 11,  // Reduce the font size of the legend labels
  //                 weight: 'normal',  // Adjust the weight of the legend text
  //                 family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
  //               },
  //               boxWidth: 10,  // Set the width of the colored box (legend symbol)
  //               boxHeight: 10,  // Set the height of the colored box (legend symbol)
  //               padding: 5  // Adjust the padding around each legend item
  //             }
  //           },
  //           tooltip: {
  //             callbacks: {
  //               label: (tooltipItem) => {
  //                 return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
  //               },
  //             },
  //           },
  //         },
  //       }
  //     });
  //   } else {
  //     console.error('Chart canvas element is not found.');
  //   }
  // }

  createRenewChart() {
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }

    this.dashboardService.fetchDueRenewals(reqData).subscribe(res => {
      this.renewalDetail.push(
        {
          widgetName: 'Renewal',
          chart: 'Renewal',
          totalCount: res.data.reduce((sum: any, item: any) => sum + item.customerCount, 0),
          category: res.data.map((item: any) => ({
            name: item.dueStatus,
            count: item.customerCount
          }))
        }
      );
    });
    this.dashboardService.fetchPersistencyPercentage(reqData).subscribe(res => {
      this.renewalDetail.push(
        {
          widgetName: 'Persistency',
          chart: 'Persistency',
          totalCount: res.data[0].persistencyPercentage,
          category: res.data.map((item: any) => ({
            name: 'Persistency',
            count: res.data[0].persistencyPercentage
          }))
        }
      );
    });
  }

  // createDHAChartData(): ChartData<'pie' | 'doughnut'> {
  //   const categories = this.dhaCard;
  //   const labels = categories.map((item: any) => item.wellnessType);
  //   const data = categories.map((item: any) => item.count);

  //   return {
  //     labels: labels,
  //     datasets: [{
  //       data: data,
  //       backgroundColor: ['#e74c3c',
  //         '#9b59b6',
  //         '#3498db',
  //         '#f39c12',
  //         '#1abc9c',
  //         '#27ae60',
  //         '#e67e22',
  //         '#f1c40f',
  //         '#95a5a6'
  //       ],
  //       // Dynamic colors
  //       //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
  //     }]
  //   };
  // }

  // renderDHAChart(): void {
  //   if (this.chartDHACanvas && this.chartDHACanvas.nativeElement) {
  //     const canvas = this.chartDHACanvas.nativeElement;
  //     const ctx = canvas.getContext('2d');

  //     if (!ctx) {
  //       console.error('Failed to get context from canvas.');
  //       return;
  //     }

  //     // Create the chart using Chart.js
  //     this.dhaChart = new Chart(ctx, {
  //       type: 'doughnut', // 'pie' or 'doughnut'
  //       data: this.createDHAChartData(), // Dynamic chart data
  //       options: {
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             position: 'bottom',
  //             labels: {
  //               font: {
  //                 size: 12,  // Reduce the font size of the legend labels
  //                 weight: 'normal',  // Adjust the weight of the legend text
  //                 family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
  //               },
  //               boxWidth: 10,  // Set the width of the colored box (legend symbol)
  //               boxHeight: 10,  // Set the height of the colored box (legend symbol)
  //               padding: 5  // Adjust the padding around each legend item
  //             }
  //           },
  //           tooltip: {
  //             callbacks: {
  //               label: (tooltipItem) => {
  //                 return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
  //               },
  //             },
  //           },
  //         },
  //       }
  //     });
  //   } else {
  //     console.error('Chart canvas element is not found.');
  //   }
  // }

  createCustomerChartData(): ChartData<'pie' | 'doughnut'> {
    return {
      labels: ['Total Customers', 'Active Customers', 'InAcive Customers'],
      datasets: [{
        data: [this.customerInfo?.totalCustomerCount, this.customerInfo?.activeCustomerCount, (this.customerInfo?.totalCustomerCount - this.customerInfo?.activeCustomerCount)],
        backgroundColor: ['#e74c3c',
          '#9b59b6',
          '#3498db',
          '#f39c12',
          '#1abc9c',
          '#27ae60',
          '#e67e22',
          '#f1c40f',
          '#95a5a6'
        ],
        // Dynamic colors
        //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
      }]
    };
  }

  renderCustomerChart(): void {
    if (this.chartCustomerCanvas && this.chartCustomerCanvas.nativeElement) {
      const canvas = this.chartCustomerCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get context from canvas.');
        return;
      }

      // Create the chart using Chart.js
      this.customerchart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createCustomerChartData(), // Dynamic chart data
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 12,  // Reduce the font size of the legend labels
                  weight: 'normal',  // Adjust the weight of the legend text
                  family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
                },
                boxWidth: 10,  // Set the width of the colored box (legend symbol)
                boxHeight: 10,  // Set the height of the colored box (legend symbol)
                padding: 5  // Adjust the padding around each legend item
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
                },
              },
            },
          },
          onClick: (event, activeElements) => {
            if (activeElements.length > 0) {
              // Using the correct context (chart instance) within the onClick handler
              const datasetIndex = activeElements[0].datasetIndex;
              const index = activeElements[0].index;
              const value = this.customerchart.data.datasets[datasetIndex].data[index];  // Access data via `this.chart`
              const label = this.customerchart.data.labels[index];  // Access labels via `this.chart`

              console.log(`Clicked on: ${label} with value ${value}`);
              //this.route.navigate(['/leads/leadsList/' + `${label}?=${value}`])

              this.route.navigate(['/customers/customersList/'], {
                queryParams: { status: label },
              });
            }
          }
        }
      });
    } else {
      console.error('Chart canvas element is not found.');
    }
  }

  createServiceChartData(): ChartData<'pie' | 'doughnut'> {
    return {
      labels: [
        'Claim Rejecteded', 'Claim Settled', 'Open Claims', 'Open Endorsements'
      ],
      datasets: [{
        data: [this.serviceInfo?.rejectedClaimsCount, this.serviceInfo?.settledLessAmountClaimsCount, this.serviceInfo?.openClaimsCount, this.serviceInfo?.openEndorsementsCount],
        backgroundColor: ['#e74c3c',
          '#9b59b6',
          '#3498db',
          '#f39c12',
          '#1abc9c',
          '#27ae60',
          '#e67e22',
          '#f1c40f',
          '#95a5a6'
        ],
        // Dynamic colors
        //hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
      }]
    };
  }

  renderServiceChart(): void {
    if (this.chartServicingCanvas && this.chartServicingCanvas.nativeElement) {
      const canvas = this.chartServicingCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get context from canvas.');
        return;
      }

      // Create the chart using Chart.js
      this.servicingchart = new Chart(ctx, {
        type: 'pie', // 'pie' or 'doughnut'
        data: this.createServiceChartData(), // Dynamic chart data
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 12,  // Reduce the font size of the legend labels
                  weight: 'normal',  // Adjust the weight of the legend text
                  family: "'Anek Latin', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
                },
                boxWidth: 10,  // Set the width of the colored box (legend symbol)
                boxHeight: 10,  // Set the height of the colored box (legend symbol)
                padding: 5  // Adjust the padding around each legend item
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip label
                },
              },
            },
          },
          onClick: (event, activeElements) => {
            if (activeElements.length > 0) {
              // Using the correct context (chart instance) within the onClick handler
              const datasetIndex = activeElements[0].datasetIndex;
              const index = activeElements[0].index;
              const value = this.servicingchart.data.datasets[datasetIndex].data[index];  // Access data via `this.chart`
              const label = this.servicingchart.data.labels[index];  // Access labels via `this.chart`

              console.log(`Clicked on: ${label} with value ${value}`);
              //this.route.navigate(['/leads/leadsList/' + `${label}?=${value}`])

              this.route.navigate(['/claims/claimsList/'], {
                queryParams: { status: label },
              });
            }
          }
        }
      });
    } else {
      console.error('Chart canvas element is not found.');
    }
  }

  onClickEvents(event: any) {
    if (event == 'events') {
      this.route.navigate(['events/eventsList'])
    } else if (event == 'birthday') {
      this.route.navigate(['events/birthdaysList'])
    } else if (event == 'products') {
      this.route.navigate(['products'])
    } else {
      const url = 'notifications' + '?agentCode=' + localStorage.getItem('agentCode');
      this.route.navigateByUrl(url)
    }
  }

  onSelectFilter(section: any, filter: any) {
    this.performanceCard = [];
    this.tabsInfo = [];
    this.otherSection = [];
    this.quickActionDetails = [];
    this.renewalDetail = [];
    this.otherSection = [];
    this.dhaSection = [];
    this.widgetArr.forEach((action: any) => {
      if (action.name === section && action.isFilter) {
        action.filterType = filter;
      }
      return action;
    });

    this.fetchWidgets();
    this.ngAfterViewInit();
  }

  getPoductList() {
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    this.dashboardService.Getproductlist().subscribe({
      next: (res: any) => {
        this.ProductList = res.data.slice(0, 2).map((item: any) => ({
          productName: item.productName,
          desc: item.productDescription,
          keyFeatures: item.keyFeatures && JSON.parse(item.keyFeatures).slice(0, 3),
          sumInsured: item.sumInsured && item.sumInsured.split(",")[0]
        }));
        this.dhaSection.push({ name: 'TopSellingProducts', value: this.ProductList })
      },
      error: (err) => {
        console.error(err);
        if (err.status === 404) {
        }
      }
    })

  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  // Determine if the screen is desktop or mobile based on width
  private checkScreenSize(): void {
    this.isDesktopView = window.innerWidth > 768; // Adjust breakpoint as needed (e.g., 768px)
  }
  calculateDelay(): number {
    const totalSectionsLength = this.otherSection.length;
    const totalTabsLength = this.tabsInfo.length;
    const totalCardsLength = this.dhaCard.length;
    const totalActionsLength = this.quickActionDetails.length;

    const delay = (totalSectionsLength * 500) + (totalTabsLength * 300) + (totalCardsLength * 200) + (totalActionsLength * 100);
    const minDelay = 5000;
    const maxDelay = 30000;

    return Math.max(minDelay, Math.min(delay, maxDelay));
  }

  onSubmit() {
    this.newOrderList.map((tab: any, index: any) => {
      switch (tab.widgetName) {
        case "QuickAction":
          this.newQuickActionList && this.newQuickActionList.length && this.newQuickActionList.map((category: any, index: any) => {
            tab.category.map((k: any) => {
              if (k.categoryName == category.name.name) {
                k.subOrder = index
              }
            })
          });
          this.newQuickActionList == undefined && tab.category.map((k: any, j = index) => {
            k.subOrder = j
          })
          tab.order = index

          break;

        case "ABHI":
          tab.order = index
          break;

        case 'Servicing':
        case 'Customer':
          this.newCustomerList && this.newCustomerList.length && this.newCustomerList.map((category: any, index: any) => {
            tab.category.map((k: any) => {
              if (k.categoryName == category?.name?.widgetName) {
                k.subOrder = index
              }
            })
          });
          this.newCustomerList == undefined && tab.category.map((k: any, j = index) => {
            k.subOrder = j
          })
          tab.order = index

          break;
        case 'Renewal':
          this.newRenewalList && this.newRenewalList.length && this.newRenewalList.map((category: any, index: any) => {
            tab.category.map((k: any) => {
              if (k.categoryName == category?.name?.widgetName) {
                k.subOrder = index
              }
            })
          });
          this.newRenewalList == undefined && tab.category.map((k: any, j = index) => {
            k.subOrder = j
          })
          tab.order = index

          break;
        case 'Business':
          this.newBusinessList && this.newBusinessList.length && this.newBusinessList.map((category: any, index: any) => {
            tab.category.map((k: any) => {
              if (k.categoryName == category?.name?.widgetName) {
                k.subOrder = index
              }
            })
          });
          this.newBusinessList == undefined && tab.category.map((k: any, j = index) => {
            k.subOrder = j
          })
          tab.order = index

          break;
        case 'Performance':
          this.newPerformanceList && this.newPerformanceList.length && this.newPerformanceList.map((category: any, index: any) => {
            tab.category.map((k: any) => {
              if (k.categoryName == category?.name?.title) {
                k.subOrder = index
              }
            })
          });
          this.newPerformanceList == undefined && tab.category.map((k: any, j = index) => {
            k.subOrder = j
          })
          tab.order = index

          break;
        case 'Wellness':
          this.newWellnessList && this.newWellnessList.length && this.newWellnessList.map((category: any, index: any) => {
            tab.category.map((k: any) => {
              if (k.categoryName == category?.name?.name) {
                k.subOrder = index
              }
            })
          });
          this.newWellnessList == undefined && tab.category.map((k: any, j = index) => {
            k.subOrder = j
          })
          tab.order = index
          break;
      }
    });

    const obj = {
      agentCode: localStorage.getItem('agentCode'),
      preferences: this.newOrderList
    }

    console.log('final', obj)

    this.dashboardService.submitPreferenceData(obj).subscribe((response: any) => {
      console.log('Data submitted successfully', response);
      // this.ngOnInit();
    });
  }

}
