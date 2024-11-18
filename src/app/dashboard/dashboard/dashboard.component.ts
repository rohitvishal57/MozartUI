import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProfileService } from 'src/app/profile/profile.service';
import { forkJoin } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { AgGauge } from "ag-charts-angular";
import { AgRadialGaugeOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;
  profileDetails: any;

  public options: AgRadialGaugeOptions;

  taskDetailsList = [
    {
      title: 'Rohini Pandey',
      desc: 'Your customers payment had failed! get them to retry payment.',
      redirectLink: 'Resend payment link to rohini',
    },
    {
      title: 'Alok Shah',
      desc: 'Document requested from Mr. Alos is yet to be received. ',
      redirectLink: 'Send a reminder to Alok',
    },
    {
      title: 'Rohini Pandey',
      desc: 'Your customers payment had failed! get them to retry payment.',
      redirectLink: 'Resend payment link to rohini',
    },
    {
      title: 'Alok Shah',
      desc: 'Document requested from Mr. Alos is yet to be received. ',
      redirectLink: 'Send a reminder to Alok',
    }
  ]

  taskList = [
    {
      taskHeader: 'Task 1',
      subtaskHeaderDesc: 'Sub Task 1',
      taskStatus: 'Do this to achieve 75% of your target'
    },
    {
      taskHeader: 'Task 2',
      subtaskHeaderDesc: 'Sub Task 2',
      taskStatus: 'Do this to achieve 75% of your target'
    },
    {
      taskHeader: 'Task 3',
      subtaskHeaderDesc: 'Sub Task 3',
      taskStatus: 'Do this to achieve 75% of your target'
    }
  ]

  performanceCard = [
    {
      title: 'Policies Sold',
      value: '1295',
      description: 'You seem to be selling a majority of Activ Fit plans',
      icon: 'assets/Img/icon_police_sold.svg',
      subIcon: 'assets/Img/icon_price_tag.svg',
      type: 'text',
      class: ''
    },
    {
      title: 'Premium',
      value: '₹ 369.96 L',
      description: '78% of monthly goal achieved',
      icon: 'assets/Img/icon_police_premium.svg',
      type: 'progress',
      progress: 78,
      class: 'premium'

    },
    {
      title: 'Commission Earned',
      value: '₹ 50,000',
      description: 'You can potentially earn 10,000 more with just 2 more policies',
      icon: 'assets/Img/icon_commission_earned.svg',
      type: 'action',
      class: 'commission-earned'

    },
    {
      title: 'My Goals',
      value: '',
      description: 'Achievement',
      icon: 'assets/Img/icon_my_goals.svg',
      type: 'gauge',
      progress: '25%',
      class: 'my-goals'

    }
  ];

  baseQuotes = [
    {
      quoteName: 'Base Quote 1',
      subQuoteName: 'Sub Quote 1',
      actionButtons: [
        'edit-pen', 'renew', 'detail'
      ],
      renewInfo: {
        product: 'Active User',
        policyNo: 'Active User',
        proposer: 'sukhadev',
        renewalPremium: 'Active User',
        mobileNo: 'Active User',
        dateofRenewal: 'Active User',

        modifiedDetails: {
          members: '1',
          tenure: '1 year'
        }

      }
    },
    {
      quoteName: 'Base Quote 2',
      subQuoteName: 'Sub Quote 2',
      actionButtons: [
        'edit-pen', 'renew', 'detail'
      ],
      renewInfo: {
        product: 'Active User',
        policyNo: 'Active User',
        proposer: 'sukhadev',
        renewalPremium: 'Active User',
        mobileNo: 'Active User',
        dateofRenewal: 'Active User',

        modifiedDetails: {
          members: '1',
          tenure: '1 year'
        }

      }
    },
    {
      quoteName: 'Base Quote 3',
      subQuoteName: 'Sub Quote 3',
      actionButtons: [
        'edit-pen', 'renew', 'detail'
      ],
      renewInfo: {
        product: 'Active User',
        policyNo: 'Active User',
        proposer: 'sukhadev',
        renewalPremium: 'Active User',
        mobileNo: 'Active User',
        dateofRenewal: 'Active User',

        modifiedDetails: {
          members: '1',
          tenure: '1 year'
        }

      }
    }
  ]

  tabsInfo = [
    {
      tabName: 'Leads',
      category: [
        {
          name: 'open',
          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'Inprogress',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentredirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'won',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'lost',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        }
      ]
    },

    {
      tabName: 'Proposal',
      category: [
        {
          name: 'open',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'open',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'open',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        }
      ]
    },

    {
      tabName: 'Renewals',
      category: [
        {
          name: 'open',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'open',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        },
        {
          name: 'open',

          catInfoList: [
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            },
            {
              name: 'Amit Kumar',
              status: 'Member Detailing Pending',
              desc: 'Lead Created',
              noteInfo: 'Your customers payment had failed! get them to retry payment.',
              redirentlink: 'Resend payment link to Rohini'
            }
          ]
        }
      ]
    }

  ];


  constructor(private route: Router, private languageService: LanguageService, private profileService: ProfileService,
    private translateService: TranslateService, private dashboardService : DashboardService) {
      this.options = {
        type: "radial-gauge",
        value: 80,
        scale: {
          min: 0,
          max: 100,
        },
    };
  }
  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    // this.combineCalls()
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    this.profileService.getProfileDetails(reqData).subscribe((res: any) => {
      if (res.isSuccess) {
        this.profileDetails = res.data;
      }
    })
  }

  combineCalls(){
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    const payload = {
      "filterType": "Last7Days"
    }
    forkJoin({
        profileDetails : this.profileService.getProfileDetails(reqData),
        leadDetails : this.dashboardService.fetchLeadStatusCount(payload),
        renewalDetails : this.dashboardService.fetchRenewalStatusCount(payload),
        proposalDetails : this.dashboardService.fetchProposalStatusCount(payload),

    }).subscribe((data : any) =>{
        console.log(data)
    })
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
    moveItemInArray(this.taskList, event.previousIndex, event.currentIndex);
  }

  dropPerformance(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.performanceCard, event.previousIndex, event.currentIndex);
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
}

