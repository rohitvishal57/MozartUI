import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProfileService } from 'src/app/profile/profile.service';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';

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
  businessInfo: any;
  public customerChart: any;
  public renewalChart: any;
  showSearchedResults = false;
  performanceCard: any = [];
  tabsInfo: any = [];
  renewalDetail: any;
  quickActionDetails : any;

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

  onSearch(ev?: any) {
    const obj = {
      "agentCode": localStorage.getItem('agentCode'),
      "searchValue": ev.target.value
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
    if (data?.searchValue.includes('UPL')) {
      alert('redirect to lead')
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
                    description: `Policies sold as per selected range ${res.data[0][el]}` ,
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
                    description: `You can potentially earned ${ res.data[0][el]}`,
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

        case 'Business':
          this.dashboardService.fetchPerformanceDetails(obj).subscribe((res: any) => {
            console.log('Business', res.data);
            this.tabsInfo = [
              {
                tabName: 'Leads',
                category: res.data.filter((item: any) => item.dataType === "Lead").map((item: any) => ({

                  name: item.status,
                  count: item.count
                }))
              },
              {
                tabName: 'Proposals',
                category: res.data.filter((item: any) => item.dataType === "Proposal").map((item: any) => ({

                  name: item.status,
                  count: item.count
                }))
              },
              // {
              //   tabName: 'Renewals',
              //   category: res.data.filter((item: any) => item.dataType === "Renewal").map((item: any) => ({
              //     name: item.status,
              //     count: item.count
              //   }))
              // }
            ];
            return this.tabsInfo
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
          'Total Customers ',
          'Active Customers',
          'InActive Customers'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [this.customerInfo.totalCustomerCount, this.customerInfo.activeCustomerCount, this.customerInfo.totalCustomerCount - this.customerInfo.activeCustomerCount],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    });
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
            'Persistency Percentage'
          ],
          datasets: [{
            // label: 'My First Dataset',
            data: [data.data[0].persistencyPercentage],
            backgroundColor: [
              '#D0F1E5'
            ],
            hoverOffset: 4
          }]
        }
      });
    });

    this.dashboardService.fetchDueRenewals(reqData).subscribe(res => {
      this.renewalDetail = res.data;
    });
  }

  ngAfterViewInit(): void {
    const chartCanvas = document.getElementById('myChart') as HTMLCanvasElement;
    const chartCanvasRenew = document.getElementById('renew') as HTMLCanvasElement;
    chartCanvas.width  = 300;
    chartCanvas.height = 200;
  }

  ngOnDestroy(): void {
    this.renewalChart.destroy();
    this.customerChart.destroy();
  }
}
