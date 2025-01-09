import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-extract-base-and-av-master',
  templateUrl: './extract-base-and-av-master.component.html',
  styleUrls: ['./extract-base-and-av-master.component.scss']
})
export class ExtractBaseAndAvMasterComponent {

  constructor(private adminServise: AdminService) {

  }

  onDownloadAVMasterDataClick() {
    const request = {
      isAvExtract: true,
      isBaseCallerExtract: false
    };
    this.adminServise.ExtractMasterData(environment.baseUrl + 'api/rug/ExtractMasterData',request, this.getFormattedFileName("AVMASTER")).subscribe(() => {
      console.log('File downloaded successfully');
    }, (error: any) => {
      console.error('Error downloading file', error);
    });
  }

  onDownloadBaseCallerMasterDataClick() {
    const request = {
      IsAvExtract: false,
      IsBaseCallerExtract: true
    };
    this.adminServise.ExtractMasterData(environment.baseUrl + 'api/rug/ExtractMasterData',request, this.getFormattedFileName("BASEAGENT")).subscribe(() => {
      console.log('File downloaded successfully');
    }, (error: any) => {
      console.error('Error downloading file', error);
    });
  }

  private getFormattedFileName(prefix: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    return `${prefix}${year}-${month}-${day} ${hours}${minutes}${seconds}`;
  }

}
