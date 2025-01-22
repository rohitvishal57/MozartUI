import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ClaimsViewService } from 'src/app/claims/claims-view/claims-view.service';
import { CommonService } from 'src/app/services/common.service';
import { ExcelExportService } from 'src/app/services/excel-export.service';
import { LanguageService } from 'src/app/services/language.service';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateLobComponent } from '../create-lob/create-lob.component';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';

@Component({
  selector: 'app-manage-lob',
  templateUrl: './manage-lob.component.html',
  styleUrls: ['./manage-lob.component.scss']
})
export class ManageLobComponent {
  selected: string = '';
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedAVs: any[] = [];
  searchTerm: string = '';
  filteredArray: any;
  submitted: boolean = false;
  today: string = '';
  AllManageLOB: any[] = [];
  selectedLocationId: any = '';
  selectedLocation: any;
  selectedUserId: any | null = null;
  dataToModify!: any
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private http: HttpClient,
    private router: Router,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private claimsService: ClaimsViewService,
    private languageService: LanguageService,
    private excelExportService: ExcelExportService,
    private translateService: TranslateService, private adminService: AdminService, private matdialogue: MatDialog) {

  }
  ngOnInit(): void {
    this.getAllManageLob();
  }



  getAllManageLob() {
    this.adminService.getAllManageLOB().subscribe(
      (response: any) => {
        const parsedData = JSON.parse(response.data);
        console.log('Full API Response:', parsedData);
        this.AllManageLOB = parsedData?.data?.allManageLobs;
        this.totalRecords = this.AllManageLOB.length;
        this.updateDisplayedData();
      }
      
    
    );
  }

  updateDisplayedData(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.displayedAVs = this.AllManageLOB.slice(startIndex, endIndex);
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getAllManageLob();
  }


  updateStatus(data:any ,isSoloJourney:boolean){
   
    const dialogRef = this.matdialogue.open(SuccesspopupComponent, {
      width: "500px",
      autoFocus: false,
     data: {
      value:data,
      isSoloJourney:isSoloJourney
     }
    })
    dialogRef.afterClosed().subscribe((result:any) => {
      this.getAllManageLob();
     
    })
    
  }

  edit(index:any){
    let value = this.filteredArray[index]
    // this.editMode=true
    const dialogRef = this.matdialogue.open(CreateLobComponent, {
      width: "500px",
      autoFocus: false,
      data: {
        value: value,
        isjourney:false,
      
      }
    })
    dialogRef.afterClosed().subscribe((result:any) => {    
      this.getAllManageLob();
      // this.editMode=false
    
    })
  }

  navigateToCreateLob() {
   
    this.router.navigate(['rug/create_lob']);
  }
}
