import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showCard: boolean = false;
  showDropdownsFlag: boolean = false;


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


  constructor(private route: Router, private languageService: LanguageService,
    private translateService: TranslateService) {

  }
  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
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
}

