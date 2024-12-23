import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsViewService } from 'src/app/claims/claims-view/claims-view.service';
import { CommonService } from 'src/app/services/common.service';
import { ExcelExportService } from 'src/app/services/excel-export.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-av-list',
  templateUrl: './av-list.component.html',
  styleUrls: ['./av-list.component.scss']
})
export class AVListComponent {

  viewClaims: boolean = false;
  selected: string = '';
 
  constructor(private http: HttpClient, 
    private router: Router,
    private commonService: CommonService, 
    private datePipe: DatePipe, 
    private claimsService: ClaimsViewService, 
    private languageService: LanguageService, 
    private excelExportService: ExcelExportService,
    private translateService: TranslateService) { }

    ngOnInit() {
   
      this.languageService.language$.subscribe(lang => {
        this.translateService.use(lang).subscribe({
          error: () => {
            this.translateService.use('en');
          }
        });
      });
  
      
    }

     //-------navigate to My-claims-view ----------
     navigateToCreateAV() {
    this.router.navigate(['rug/create_AV']);
  }
  

}
