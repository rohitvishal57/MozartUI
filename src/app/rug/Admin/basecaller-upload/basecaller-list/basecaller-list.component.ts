import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { AdminService } from '../../admin.service';
import { error } from 'jquery';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-basecaller-list',
  templateUrl: './basecaller-list.component.html',
  styleUrls: ['./basecaller-list.component.scss']
})
export class BasecallerListComponent {
  allBaseCaller:any[]=[];
  page: number = 1;
  pageNo:number=1;
  noOfRows:number=100;
  totalRecords:number=0;
  first: number = 0;
  rows: number = 10;
  searchTerm: string = '';
  displayedAVs: any[] = [];

  constructor(private languageService: LanguageService,private translateService: TranslateService,
    private adminService: AdminService, private matdialogue: MatDialog
  ){}

  ngOnInit(){
    this.languageService.language$.subscribe(lang=>{
      this.translateService.use(lang).subscribe({
        error:()=>{
          this.translateService.use('en')
        }
      })
    })
    this.getAllBaseCaller();
  }
  getAllBaseCaller(){
    this.adminService.getAllBaseCaller(this.pageNo, this.noOfRows).subscribe(
      (res: any) => {
        this.allBaseCaller =JSON.parse(res.data).data.allBaseCaller;
        this.totalRecords=this.allBaseCaller.length;  
        this.updateDisplayedData();
      },
      (error: any) => {
        console.log("Error fetching data", error);
      }
    );
  }

  updateDisplayedData(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.displayedAVs = this.allBaseCaller.slice(startIndex, endIndex);
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getAllBaseCaller();
  }
  createBaseCaller(){

  }
  bulkUploadBaseCaller(){

  }

  onInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.displayedAVs = this.allBaseCaller.filter((option: any) =>
      option?.baseCallerEmpId?.toLowerCase().includes(this.searchTerm) ||
      option?.baseCallerName?.toLowerCase().includes(this.searchTerm) ||
      option?.tlName?.toLowerCase().includes(this.searchTerm) ||
      option?.amName?.toLowerCase().includes(this.searchTerm) ||
      option?.omName?.toLowerCase().includes(this.searchTerm) ||
      option?.status?.toLowerCase().includes(this.searchTerm) 
    );
  }

  deleteUser(index: number) {
      const id = this.allBaseCaller[index].baseCallerEmpId;
      const reqData: any = {
        baseCallerEmpId: id,
        deletedBy: "teleadmin2"
      };
      this.adminService.deleteBaseCaller(reqData).subscribe((el: any) => {
        this.allBaseCaller.splice(index, 1);
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
}
