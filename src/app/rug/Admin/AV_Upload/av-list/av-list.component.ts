import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsViewService } from 'src/app/claims/claims-view/claims-view.service';
import { CommonService } from 'src/app/services/common.service';
import { ExcelExportService } from 'src/app/services/excel-export.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-av-list',
  templateUrl: './av-list.component.html',
  styleUrls: ['./av-list.component.scss']
})
export class AVListComponent {

  viewClaims: boolean = false;
  selected: string = '';
  isDesktopView: boolean = false;
  selectedView: string = "list";
  AllAVs: any[] = [];
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  

  constructor(private http: HttpClient,
    private router: Router,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private claimsService: ClaimsViewService,
    private languageService: LanguageService,
    private excelExportService: ExcelExportService,
    private translateService: TranslateService, private adminService: AdminService) { }

  ngOnInit() {

    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });
    this.getAllAVs();
  }

  leadsInfoListRequestBody ={
    "avid":"",
    "avname":"",
    "avcenter":"",
    "axisprocess":"",
    "status":"",
    "lefdate":"",
    "letdate":"",
    "tlid":"",
    "tlName":"",
    "imdCode":"",
    "axisVendor":"",
    "axisLob":"",
    'spcode':"",
    "createdBy":"",
    "pageNumber": this.page,
    "pageSize": this.rows,

  }
  getAllAVs() {
    this.leadsInfoListRequestBody.pageNumber = this.page;
    this.leadsInfoListRequestBody.pageSize = this.rows;
    this.adminService.getAllAVs().subscribe((response: any) => {
      const rawData = response.data;
      const parsedData = JSON.parse(rawData);

      this.AllAVs = parsedData.data.allAvDetails.map((item: any) => ({
        ...item,
        axisprocess: item.axisProcess || 'Not Specified',
        lefdate: this.formatDate(item.licenseExpiryFromDate),
        letdate: this.formatDate(item.licenseExpiryToDate),
      })).reverse();
      console.log('All AV Data (Latest First):', this.AllAVs);
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  navigateToCreateAV() {
    this.router.navigate(['rug/create_AV']);
  }

  toggleAll(event: Event) {
    const input = event.target as HTMLInputElement;

  }
  selectAllAssigneLeadDialog() {

  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getAllAVs();
}

}
