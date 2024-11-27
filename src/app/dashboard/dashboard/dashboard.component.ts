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
  taskDetailsList: any = [];
  customerInfo: any;
  public customerChart: any;
  public renewalChart: any;
  showSearchedResults = false;
  performanceCard: any = [];
  tabsInfo: any = [];
  renewalDetail: any;
  quickActionDetails: any;
  businessSummary: any
  public chart: any;
  @ViewChild('chartCanvas') chartCanvas: ElementRef | undefined;
  @ViewChild('chartPropCanvas') chartPropCanvas: ElementRef | undefined;
  searchedValue: any;
  serviceInfo: any;
  public serviceChart: any;
  wellnessInfo: any;
  dhaCard : any = [];

  constructor(private route: Router, private languageService: LanguageService, private profileService: ProfileService,
    private translateService: TranslateService, private dashboardService: DashboardService, private el: ElementRef) {

  }

  ngOnInit() {
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
    this.fetchWidgets();
    this.createRenewChart();
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

  dropTasks(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.quickActionDetails?.eventDetails, event.previousIndex, event.currentIndex);
  }

  dropPerformance(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.performanceCard, event.previousIndex, event.currentIndex);
  }

  dropTabs(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabsInfo, event.previousIndex, event.currentIndex);
  }

  dropTaskDetail(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.taskDetailsList, event.previousIndex, event.currentIndex);
  }

  getQuote() {
    this.showCard = true;
    this.showDropdownsFlag = true;
    console.log('showCard:', this.showCard);
    // this.saveDataToStorage();
  }

  createLead() {
    this.route.navigate(['/leads/createLead'], {
    });
  }

  onToggle(event: any) {
    const button = event.target;
    const contentBlock = button.nextElementSibling;
    if (contentBlock.style.display === 'none') {
      contentBlock.style.display = 'block';
    } else {
      contentBlock.style.display = 'none';
    }
  }

  getData() {
    return [
      { asset: "Stocks", amount: 60000 },
      { asset: "Bonds", amount: 40000 },
      { asset: "Cash", amount: 7000 },
      { asset: "Real Estate", amount: 5000 },
      { asset: "Commodities", amount: 3000 },
    ];
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

  // combineCalls() {

  //   forkJoin({
  //     quickActionWidget: this.dashboardService.fetchPerformanceDetails({
  //       "WidgetName": 'QuickAction',
  //       "AgentCode": localStorage.getItem('agentCode')
  //     }),
  //     performanceWidget: this.dashboardService.fetchPerformanceDetails({
  //       "WidgetName": 'Performance',
  //       "AgentCode": localStorage.getItem('agentCode')
  //     }),
  //     businessWidget: this.dashboardService.fetchPerformanceDetails({
  //       "WidgetName": 'Business',
  //       "AgentCode": localStorage.getItem('agentCode')
  //     }),
  //     customerwidget: this.dashboardService.fetchPerformanceDetails({
  //       "WidgetName": 'Customer',
  //       "AgentCode": localStorage.getItem('agentCode')
  //     })
  //   }).subscribe(data => {
  //     console.log(data)
  //   })
  // }


  fetchWidgets() {
    const arr = [
      {
        name: 'QuickAction', isFilter: false
      },
      {
        name: 'Performance', isFilter: true, filterType: 'Monthly'
      },
      {
        name: 'Business', isFilter: true, filterType: 'LastMonth'
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

    arr.forEach(element => {

      const obj = {
        "WidgetName": element.name,
        "FilterType": element.isFilter ? element.filterType : '',
        "AgentCode": localStorage.getItem('agentCode')
      }

      switch (element.name) {
        case 'Performance':

          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            console.log('performance', res.data)
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
                    description: `78% of monthly goal achieved`,
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
            this.createChart();
          })
          break;

        case 'Servicing':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            console.log('Servicing', res.data)
            this.serviceInfo = res.data;
            this.createServiceChart();
          })
          break;

        case 'Wellness':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe(res => {
            console.log('Wellness', res.data)
            res.data = [
              {
                "wellnessType": "DHA - Vaccination",
                "count": 10
              },
              {
                "wellnessType": "DHA - Prevention Services",
                "count": 5
              },
              {
                "wellnessType": "DHA - Emergency Services",
                "count": 3
              },
              {
                "wellnessType": "HHS - Home Health Care",
                "count": 5
              },
              {
                "wellnessType": "HHS - Emergency Response",
                "count": 3
              },
              {
                "wellnessType": "HHS - Long-Term Care",
                "count": 2
              },
              {
                "wellnessType": "HRS - Health Risk Assessments",
                "count": 8
              },
              {
                "wellnessType": "HRS - Screening",
                "count": 6
              },
              {
                "wellnessType": "HRS - Preventive Care",
                "count": 4
              }
            ];
            res.data.length && Object.values(res.data).forEach((el: any) => {
              switch (el.wellnessType) {
                case 'DHA - Vaccination':
                case 'DHA - Prevention Services':
                  'DHA - Emergency Services'
                  const nops = {
                    title: 'Policies Sold',
                    value: res.data[el],
                    description: `Policies sold as per selected range ${res.data[el]}`,
                    icon: 'assets/Img/icon_dashboard_policysold.svg',
                    subIcon: 'assets/Img/icon_price_tag.svg',
                    type: 'text',
                    class: ''
                  }
                  this.dhaCard.push(nops)
                  break;

                case 'HHS - Home Health Care':
                  const achievementsPercentage = {
                    title: 'My Goals',
                    value: res.data[el],
                    description: 'Achievement',
                    icon: 'assets/Img/icon_dashboard_myperformance.svg',
                    type: 'gauge',
                    progress: res.data[el],
                    class: 'my-goals'
                  }
                  this.dhaCard.push(achievementsPercentage)
                  break;

                default:
                  break;
              }
            })
          })
          break;

        case 'Business':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe((res: any) => {
            console.log('Business', res.data);
            this.businessSummary = res.data;
            this.tabsInfo = [
              {
                tabName: 'Leads',
                chart: 'Leads',
                totalCount: res.data.filter((item: any) => item.dataType === "Lead").reduce((sum: any, item: any) => sum + item.count, 0),
                category: res.data.filter((item: any) => item.dataType === "Lead").map((item: any) => ({
                  name: item.status,
                  count: item.count
                }))
              },
              {
                tabName: 'Proposals',
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
            console.log('Quick action', res.data);
            this.quickActionDetails = res.data;
          })
          break;
      }
    });
  }

  createChart(): void {
    this.customerChart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: [
          'Total Customers', 'Active Customers', 'InAcive Customers'
        ],
        datasets: [{
          data: [this.customerInfo.totalCustomerCount, this.customerInfo.activeCustomerCount, this.customerInfo.totalCustomerCount - this.customerInfo.activeCustomerCount],
          backgroundColor: [
            '#f44336',
            '#4caf50',
            '#ff9800'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 10,  // Reduce the font size of the legend labels
                weight: 'normal',  // Adjust the weight of the legend text
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
              },
              boxWidth: 10,  // Set the width of the colored box (legend symbol)
              boxHeight: 10,  // Set the height of the colored box (legend symbol)
              padding: 5  // Adjust the padding around each legend item
            }

          }
        }
      }
    });
  }

  createServiceChart(): void {
    this.serviceChart = new Chart("MyServiceChart", {
      type: 'doughnut',
      data: {
        labels: [
          'Claim Rejecteded', 'Claim Settled', 'Open Endoresements', 'Open Claims', 'Open Complaints', 'Cancellation Request'
        ],
        datasets: [{
          data: [2, 0, 1, 4, 6, 7],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 10,  // Reduce the font size of the legend labels
                weight: 'normal',  // Adjust the weight of the legend text
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"  // Adjust the font family if necessary
              },
              boxWidth: 10,  // Set the width of the colored box (legend symbol)
              boxHeight: 10,  // Set the height of the colored box (legend symbol)
              padding: 5  // Adjust the padding around each legend item
            }

          }
        }
      }
    });
  }



  ngAfterViewInit(): void {
    // Ensure that the canvas is available before rendering the chart
    setTimeout(() => {
      if (this.chartCanvas && this.chartCanvas.nativeElement) {
        this.renderChart();
        this.renderPropChart()
      } else {
        console.error('Canvas element not found.');
      }
    }, 20000); // Use setTimeout to ensure DOM is fully rendered before accessing the canvas
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
      this.chart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createChartData(), // Dynamic chart data
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
      this.chart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createPropChartData(), // Dynamic chart data
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
        }
      });
    } else {
      console.error('Chart canvas element is not found.');
    }
  }

  createRenewChart() {
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    this.renewalChart = this.dashboardService.fetchPersistencyPercentage(reqData).subscribe(data => {
      console.log('renew', data)
      this.renewalChart = new Chart("renew", {
        type: 'doughnut',
        data: {
          labels: [
            'Persistency %'
          ],
          datasets: [{
            data: [data.data[0].persistencyPercentage],
            backgroundColor: [
              '#58d68d'
            ],
            hoverOffset: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',  // Move legend to the side (right or left)
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
            }
          }
        }
      });
    });

    this.dashboardService.fetchDueRenewals(reqData).subscribe(res => {
      this.renewalDetail = res.data.map((item: any) => ({
        totalCount: res.data.reduce((sum: any, item: any) => sum + item.customerCount, 0),
        name: item.dueStatus,
        count: item.customerCount
      }))
    });
  }

  // ngOnDestroy(): void {
  //  this.renewalChart.destroy(); //kept comment for temporary fix ,We are getting issue with destroy function please check.
  //  this.customerChart.destroy();
  //  this.chart.destroy();
  // }
}
