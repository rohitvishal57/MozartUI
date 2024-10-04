import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

interface Product {
  productLogo: string;
  productName: string;
  premium: string;
  tenure: string;
  feature1: string;
  feature2: string;
  feature3: string;
}

interface Task {
  profileImage: string;
  profileName: string;
  description: string;
  resendLink: string;
}

interface WellnessItem {
  name: string;
  description: string;
  healthReturns?: string; // Optional property
}

interface WidgetItem {
  id: string; // Add a unique ID for each widget
  title: string;
  dropdownName?: string; // Optional property
  visible: boolean;
  products?: Product[];
  tasks?: Task[];
  wellnessItems?: WellnessItem[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  enableCustomize: boolean = false;
  showModal:boolean=false;

  cards = [
    {
      title: 'Policies Sold',
      value: '1295',
      description: 'You seem to be selling a majority of Activ Fit plans',
      icon: '🔒',
      type: 'text',
    },
    {
      title: 'Premium',
      value: '₹ 369.96 L',
      description: 'Premium values are good',
      icon: '💵',
      type: 'gauge',
      progress: 75,
    },
    {
      title: 'Discount',
      value: '₹ 12,652',
      description: 'Up to 20% discount on all policies',
      icon: '📉',
      type: 'action',
    },
    {
      title: 'Renewal Progress',
      value: '55%',
      description: '55% of renewals achieved',
      icon: '📊',
      type: 'progress',
      progress: 55,
    },
  ];

  items: WidgetItem[] = [
    {
      id: '1',
      title: 'Top Selling Products',
      dropdownName: 'For Senior Citizens',
      visible: true,
      products: [
        {
          productLogo: 'assets/images/customize-icon.png',
          productName: 'Active One Next',
          premium: '₹ 876,545',
          tenure: '5 years',
          feature1: 'Feature 1',
          feature2: 'Feature 2',
          feature3: 'Feature 3',
        },
        {
          productLogo: 'assets/images/customize-icon.png',
          productName: 'Active Assure',
          premium: '₹ 876,545',
          tenure: '5 years',
          feature1: 'Feature 1',
          feature2: 'Feature 2',
          feature3: 'Feature 3',
        },
      ],
    },
    {
      id: '2',
      title: 'All Tasks',
      dropdownName: '5 tasks pending',
      visible: true,
      tasks: [
        {
          profileImage: 'assets/images/customize-icon.png',
          profileName: 'Kanth',
          description: 'Your customer\'s payment had failed! Get them to retry payment.',
          resendLink: 'Resend payment link to Kanth',
        },
        {
          profileImage: 'assets/images/customize-icon.png',
          profileName: 'Rohini Sharma',
          description: 'Your customer\'s payment had failed! Get them to retry payment.',
          resendLink: 'Resend payment link to Rohini',
        },
        {
          profileImage: 'assets/images/customize-icon.png',
          profileName: 'Fathima',
          description: 'Your customer\'s payment had failed! Get them to retry payment.',
          resendLink: 'Resend payment link to Fathima',
        },
      ],
    },
    {
      id: '3',
      title: 'Health & Wellness',
      visible: true,
      wellnessItems: [
        {
          name: 'Digital Health Assessments',
          description: 'Dummy placeholder text',
        },
        {
          name: 'Health Returns',
          healthReturns: '₹ 50,000',
          description: 'Nudge your users to actively participate to save more',
        },
      ],
    },
  ];

  selectedItems: WidgetItem[] = [];
  temporarySelectedItems: any[] = [];
  // isSaved: boolean=false;


  drop(event: CdkDragDrop<WidgetItem[]>) {
    if (this.enableCustomize) {
      moveItemInArray(this.selectedItems, event.previousIndex, event.currentIndex);
      console.log(this.selectedItems, event.previousIndex, event.currentIndex);
    }
  }

  dropCard(event: CdkDragDrop<any[]>) {
    if (this.enableCustomize) {
      moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
    }
  }

  enableCustomization() {
    this.enableCustomize = !this.enableCustomize;
    this.showModal=!this.showModal
  }

  removeWidget(item: WidgetItem) {
    this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    this.temporarySelectedItems = this.temporarySelectedItems.filter(i => i.id !== item.id);
  }
  

  toggleWidget(item: WidgetItem) {
    if (this.isSelected(item)) {
      // Remove from temporary selected items
      this.temporarySelectedItems = this.temporarySelectedItems.filter(i => i.id !== item.id);
    } else {
      if (this.temporarySelectedItems.length >= 3) {
        alert('Already selected items length is 3. If you want to add one more widget, remove one widget from the selected items.');
      } else {
        // Add to temporary selected items
        this.temporarySelectedItems.push(item);
      }
    }
  }

  saveSelectedWidgets(): void {
    this.selectedItems = [...this.temporarySelectedItems];  
    this.showModal=false;

    // this.isSaved=true;  
  }

  isSelected(item: WidgetItem): boolean {
    return this.temporarySelectedItems.some(i => i.title === item.title);
  }

  // getCheckboxClass(item: WidgetItem): string {
  //   if (this.isSelected(item)) {
  //     return this.isSaved ? 'green-checkbox' : 'red-checkbox';
  //   }
  //   return 'empty-checkbox'; // Class for unselected state
  // }
}

