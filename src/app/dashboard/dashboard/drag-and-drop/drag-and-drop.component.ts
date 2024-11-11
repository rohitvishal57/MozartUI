import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  public allowDragging: boolean = false;
  public showAllItems: boolean = false;
  private previouslyVisibleItems: Set<any> = new Set();
  selectedIndex: any;

  constructor(private dashboardService: DashboardService) { }

  cards = [
    {
      title: 'Policies Sold',
      value: '1295',
      description: 'You seem to be selling a majority of Activ Fit plans',
      icon: '🔒',
      type: 'text'
    },
    {
      title: 'Premium',
      value: '₹ 369.96 L',
      description: '78% of monthly goal achieved',
      icon: '💰',
      type: 'progress',
      progress: 78
    },
    {
      title: 'Commission Earned',
      value: '₹ 50,000',
      description: 'You can potentially earn 10,000 more with just 2 more policies',
      icon: '📈',
      type: 'action'
    },
    {
      title: 'My Goals',
      value: '',
      description: 'Achievement',
      icon: '🎯',
      type: 'gauge',
      progress: 25
    }
  ];


  items = [
    {
      id: '0',
      title: 'Top Selling Products',
      dropdownName: 'For Senior Citizens',
      visible: true,
      products: [
        {
          productLogo: 'assets/images/customize-icon.png',
          productName: 'Active One Next',
          feature1: 'vhdhfgfcjdvgh',
          feature2: 'dfghj',
          feature3: 'dfdghjk',
          premium: 876545,
          tenure: 5,
        },
        {
          productLogo: 'assets/images/customize-icon.png',
          productName: 'Active Assure',
          feature1: 'vhdhfgfcjdvgh',
          feature2: 'dfghj',
          feature3: 'dfdghjk',
          premium: 876545,
          tenure: 5,
        },
        {
          productLogo: 'assets/images/customize-icon.png',
          productName: 'Active Assure',
          feature1: 'vhdhfgfcjdvgh',
          feature2: 'dfghj',
          feature3: 'dfdghjk',
          premium: 876545,
          tenure: 5,
        },
      ],
    },
    {
      id: '1',
      title: 'All Tasks',
      dropdownName: '5 tasks pending',
      visible: true,
      tasks: [
        {
          profileImage: 'assets/images/customize-icon.png',
          profileName: 'Rohini Sharma',
          description: 'Your customers payment had failed! get them to retry payment.',
          resendLink: 'Resend payment link to Rohini',
        },
        {
          profileImage: 'assets/images/customize-icon.png',
          profileName: 'Rohini Sharma',
          description: 'Your customers payment had failed! get them to retry payment.',
          resendLink: 'Resend payment link to Rohini',
        },
        {
          profileImage: 'assets/images/customize-icon.png',
          profileName: 'Rohini Sharma',
          description: 'Your customers payment had failed! get them to retry payment.',
          resendLink: 'Resend payment link to Rohini',
        }
      ],
    },
    {
      id: '2',
      title: 'Knowledge Centre',
      dropdownName: 'View All Courses',
      visible: false,
      knowledgeItems: [{ name: 'E' }, { name: 'F' }],
    },
    {
      id: '3',
      title: 'Health & Wellness',
      visible: false,
      wellnessItems: [
        {
          name: 'Digital Health Assessments',

          description: 'Dummy placeholder text',
        },
        {
          name: 'Health Returns',
          healthReturns: '₹ 50,000',
          description: 'Nudge your users to actively participate to save more',
        }
      ],
    },
    {
      id: '4',
      title: 'My Goals',
      dropdownName: 'Last 3 months',
      visible: false,
      knowledgeItems: [{ name: 'E' }, { name: 'F' }],
    },
    {
      id: '5',
      title: 'Participate in challenge to',
      visible: false,
      wellnessItems: [
        {
          name: 'Digital Health Assessments',

          description: 'Dummy placeholder text',
        },
        {
          name: 'Health Returns',
          healthReturns: '₹ 50,000',
          description: 'Nudge your users to actively participate to save more',
        }
      ],
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

  ngOnInit(): void {
    forkJoin({
      GetLeadStatusCount: this.dashboardService.fetchLeadStatusCount(),
      GetProposalStatusCount: this.dashboardService.fetchProposalStatusCount()
    }).subscribe((data: any) => {
      console.log(data)
    })
  }

  toggleDragAndDrop() {
    if (!this.showAllItems) {
      this.previouslyVisibleItems = new Set(this.items.filter(item => item.visible));
    } else {
      this.previouslyVisibleItems.clear();
    }

    this.allowDragging = !this.allowDragging;
    this.showAllItems = !this.showAllItems;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  dropTab(event: CdkDragDrop<string[]>) {
    const prevActive = this.tabsInfo[this.selectedIndex];
    moveItemInArray(this.tabsInfo, event.previousIndex, event.currentIndex);
    this.selectedIndex = this.tabsInfo.indexOf(prevActive);
  }

  dropCard(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  hideItem(item: any, index: any) {
    item.visible = false;
    this.items.filter(item => item.visible);
  }

  addItem(item: any, index: any) {
    item.visible = true;
    this.items.filter(item => item.visible);
  }

  getItemsToShow() {
    return this.showAllItems ? this.items : this.items.filter(item => item.visible);
  }

  shouldShowAddButton(item: any) {
    return this.showAllItems && !this.previouslyVisibleItems.has(item);
  }

  shouldShowXButton(item: any) {
    return this.showAllItems && this.previouslyVisibleItems.has(item);
  }

  onClickbtn(btnName: any, index: number) {
  }
}
