import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-abhi-up',
  templateUrl: './abhi-up.component.html',
  styleUrls: ['./abhi-up.component.scss']
})
export class AbhiupComponent {
  constructor(private translateService: TranslateService){
    const userlang=localStorage.getItem('preferredLanguage') || 'en'; 
    console.log("userlang",userlang);
    // const languagecode = userlang.split('-')[0];
    this.translateService.setDefaultLang(userlang);
    this.translateService.use(userlang).subscribe({
      error: () => {
        this.translateService.use('en'); // Fallback to English if the desired language file is not found
      }
    });
  }

}
