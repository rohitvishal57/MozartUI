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
  renewalDetail: any;
  quickActionDetails: any = [];
  businessSummary: any
  public chart: any;
  @ViewChild('chartCanvas') chartCanvas: ElementRef | undefined;
  @ViewChild('chartPropCanvas') chartPropCanvas: ElementRef | undefined;
  @ViewChild('chartRenewCanvas') chartRenewCanvas: ElementRef | undefined;
  @ViewChild('chartDHACanvas') chartDHACanvas: ElementRef | undefined;
  searchedValue: any;
  serviceInfo: any;
  wellnessInfo: any;
  dhaCard: any = [];

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

  dropQuickAct(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.quickActionDetails, event.previousIndex, event.currentIndex);
  }

  dropTabs(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabsInfo, event.previousIndex, event.currentIndex);
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
            this.dhaCard = res.data;
            // res.data.length && Object.values(res.data).forEach((el: any) => {
            //   switch (el.wellnessType) {
            //     case 'DHA - Vaccination':
            //     case 'DHA - Prevention Services':
            //       const nops = {
            //         title: 'Policies Sold',
            //         value: res.data[el],
            //         description: `Policies sold as per selected range ${res.data[el]}`,
            //         icon: 'assets/Img/icon_dashboard_policysold.svg',
            //         subIcon: 'assets/Img/icon_price_tag.svg',
            //         type: 'text',
            //         class: ''
            //       }
            //       this.dhaCard.push(nops)
            //       break;

            //     default:
            //       break;
            //   }
            // })
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
             Object.keys(res.data).forEach((el :any) => {
              this.quickActionDetails.push({
                name : el,
                value : res.data[el].slice(0, 4)
              })
            });
           
            console.log('Quick action', this.quickActionDetails);

          })
          break;
      }
    });
  }

  createChart(): void {
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: [
          'Total Customers', 'Active Customers', 'InAcive Customers'
        ],
        datasets: [{
          data: [this.customerInfo?.totalCustomerCount, this.customerInfo?.activeCustomerCount, (this.customerInfo?.totalCustomerCount - this.customerInfo?.activeCustomerCount)],
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
  }

  createServiceChart(): void {
    this.chart = new Chart("MyServiceChart", {
      type: 'doughnut',
      data: {
        labels: [
          'Claim Rejecteded', 'Claim Settled', 'Open Endoresements', 'Open Claims', 'Open Complaints', 'Cancellation Request'
        ],
        datasets: [{
          data: [this.serviceInfo.claimRejectedCount,this.serviceInfo.claimSettledLessAmountCount,this.serviceInfo.claimsOpenCount,this.serviceInfo.complaintsOpenCount,this.serviceInfo.endorsementsOpenCount,this.serviceInfo.policyCancellationRequestsCount],
          backgroundColor: [
            '#ff5722',
            '#4caf50',
            '#673ab7',
            '#9c27b0',
            '#2196f3',
            '#f44336'
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
  }

  ngAfterViewInit(): void {
    // Ensure that the canvas is available before rendering the chart
    setTimeout(() => {
      if (this.chartCanvas && this.chartCanvas.nativeElement) {
        this.renderChart();
        this.renderPropChart();
        this.renderEXPropChart();
        this.renderDHAChart();
      } else {
        console.error('Canvas element not found.');
      }
    }, 5000); // Use setTimeout to ensure DOM is fully rendered before accessing the canvas
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

  createEXChartData(): ChartData<'pie' | 'doughnut'> {
    const categories = this.renewalDetail;
    const labels = categories.map((item: any) => item.name);
    const data = categories.map((item: any) => item.count);

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'], // Dynamic colors
        hoverBackgroundColor: ['#FF4D4D', '#4D4DFF', '#66FF66', '#FFCC00'], // Hover effect colors
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
      this.chart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createEXChartData(), // Dynamic chart data
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

    this.dashboardService.fetchDueRenewals(reqData).subscribe(res => {
      this.renewalDetail = res.data.map((item: any) => ({
        totalCount: res.data.reduce((sum: any, item: any) => sum + item.customerCount, 0),
        name: item.dueStatus,
        count: item.customerCount
      }))
    });

    this.dashboardService.fetchPersistencyPercentage(reqData).subscribe(data => {
      this.renewalDetail.push({
        name: 'Persistency %',
        count: data.data[0].persistencyPercentage
      })
    });


  }

  createDHAChartData(): ChartData<'pie' | 'doughnut'> {
    const categories = this.dhaCard;
    const labels = categories.map((item: any) => item.wellnessType);
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

  renderDHAChart(): void {
    if (this.chartDHACanvas && this.chartDHACanvas.nativeElement) {
      const canvas = this.chartDHACanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get context from canvas.');
        return;
      }

      // Create the chart using Chart.js
      this.chart = new Chart(ctx, {
        type: 'doughnut', // 'pie' or 'doughnut'
        data: this.createDHAChartData(), // Dynamic chart data
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
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

  onClickEvents(event: any) {

  }
}
