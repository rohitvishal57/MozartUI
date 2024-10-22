import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {

  public allowDragging: boolean = false; // Initially disable dragging
  public showAllItems: boolean = false;
  private previouslyVisibleItems: Set<any> = new Set();

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
      id: '3',  // New fourth card
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

  toggleDragAndDrop() {
    if (!this.showAllItems) {
      // Save currently visible items before showing all
      this.previouslyVisibleItems = new Set(this.items.filter(item => item.visible));
    } else {
      // Reset previouslyVisibleItems if toggling back
      this.previouslyVisibleItems.clear();
    }

    this.allowDragging = !this.allowDragging;
    this.showAllItems = !this.showAllItems;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  dropCard(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  hideItem(item: any) {
    item.visible = false;
  }

  addItem(item: any) {
    item.visible = true;
  }

  getItemsToShow() {
    return this.showAllItems ? this.items : this.items.filter(item => item.visible); // Show only the first item when not customizing
  }

  shouldShowAddButton(item: any) {
    // Show 'Add' button if item is not in previouslyVisibleItems and customization is active
    return this.showAllItems && !this.previouslyVisibleItems.has(item);
  }

  shouldShowXButton(item: any) {
    // Show 'x' button if item was visible before customization
    return this.showAllItems && this.previouslyVisibleItems.has(item);
  }
}
