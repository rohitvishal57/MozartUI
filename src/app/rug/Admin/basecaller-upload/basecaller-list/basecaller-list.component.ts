import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { AdminService } from '../../admin.service';
import { error } from 'jquery';

@Component({
  selector: 'app-basecaller-list',
  templateUrl: './basecaller-list.component.html',
  styleUrls: ['./basecaller-list.component.scss']
})
export class BasecallerListComponent {
  allBaseCaller:any[]=[];
  pageNo:number=1;
  noOfRows:number=10;
  totalRecords:number=0;
  first: number = 0;
  rows: number = 10;
  constructor(private languageService: LanguageService,private translateService: TranslateService,
    private adminService: AdminService
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
      },
      (error: any) => {
        console.log("Error fetching data", error);
      }
    );
  }
  createBaseCaller(){

  }
  bulkUploadBaseCaller(){

  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // this. = Math.floor(this.first / this.rows) + 1;
    // this.getAllAVs();
  }
}
