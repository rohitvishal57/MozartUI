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
import { MatDialog } from '@angular/material/dialog';
import { AuditComponent } from '../audit/audit.component';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';



@Component({
  selector: 'app-av-list',
  templateUrl: './av-list.component.html',
  styleUrls: ['./av-list.component.scss']
})
export class AVListComponent {
  [x: string]: any;

  viewClaims: boolean = false;
  selected: string = '';
  isDesktopView: boolean = false;
  selectedView: string = "list";
  AllAVs: any[] = [];
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedAVs: any[] = [];
  searchTerm: string = '';
  filterAllAvs = [...this.AllAVs];

  constructor(private http: HttpClient,
    private router: Router,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private claimsService: ClaimsViewService,
    private languageService: LanguageService,
    private excelExportService: ExcelExportService,
    private translateService: TranslateService, private adminService: AdminService, private matdialogue: MatDialog) { }

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

  onInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.displayedAVs = this.AllAVs.filter((option: any) =>
      option?.center?.toLowerCase().includes(this.searchTerm) ||
      option?.avId?.toLowerCase().includes(this.searchTerm) ||
      option?.avName?.toLowerCase().includes(this.searchTerm) ||
      option?.lefdate?.toLowerCase().includes(this.searchTerm) ||
      option?.letdate?.toLowerCase().includes(this.searchTerm) ||
      option?.status?.toLowerCase().includes(this.searchTerm) ||
      option?.axisprocess?.toLowerCase().includes(this.searchTerm)
    );
  }

  getAllAVs() {
    this.adminService.getAllAVs().subscribe((response: any) => {
      const rawData = response.data;
      const parsedData = JSON.parse(rawData);

      this.AllAVs = parsedData.data.allAvDetails.map((item: any) => ({
        ...item,
        axisprocess: item.axisProcess || 'Not Specified',
        lefdate: this.formatDate(item.licenseExpiryFromDate),
        letdate: this.formatDate(item.licenseExpiryToDate),
      }));
      console.log('All AV Data (Latest First):', this.AllAVs);
      this.totalRecords = this.AllAVs.length;
      this.updateDisplayedData();
    });
  }

  updateDisplayedData(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.displayedAVs = this.AllAVs.slice(startIndex, endIndex);
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  updateAV(AvId: any) {
    this.router.navigate(['/rug/updateAV'], {
    });
  }

  deleteUser(index: number) {
    const id = this.AllAVs[index].avId;
    const reqData: any = {
      avId: id,
      deletedBy: "teleadmin1"
    };
    this.adminService.deleteav(reqData).subscribe((el: any) => {
      this.AllAVs.splice(index, 1);
      console.log('DeleteData', el);
      const dialogRef = this.matdialogue.open(SuccesspopupComponent, {
        width: "500px",
        autoFocus: false,
        data: "Lead Successfully Deleted."
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result);
        window.location.reload();
      });
    },
      (error: any) => {
        console.error('API Error:', error);
        console.error('Error Details:', error.error);
      }
    );
  }





  navigateToCreateAV() {
    this.router.navigate(['rug/create_AV']);
  }

  navigateToBulkUpload() {
    this.router.navigate(['rug/bulk_upload']);
  }

  audit(index: any) {
    let value = this.AllAVs[index]
    const dialogRef = this.matdialogue.open(AuditComponent, {
      width: "1000px",
      autoFocus: false,
      data: {
        value: value
      }
    })
  }

  toggleAll(event: Event) {
    const input = event.target as HTMLInputElement;

  }
  selectAllAssigneLeadDialog() {

  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getAllAVs();
  }
}
