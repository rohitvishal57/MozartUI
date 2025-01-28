import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  constructor(
    private file: File,
    private androidPermissions: AndroidPermissions
  ) {}

  async exportToExcel(data: any[], fileName: string): Promise<void> {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFileForWeb(excelBuffer, fileName);

    /* if (this.isMobile()) {
      await this.requestPermissions();
      await this.saveAsExcelFileForMobile(excelBuffer, fileName);
    } else {
      this.saveAsExcelFileForWeb(excelBuffer, fileName);
    } */
  }

  private saveAsExcelFileForWeb(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}.xlsx`);
  }

  /* private async saveAsExcelFileForMobile(buffer: any, fileName: string): Promise<void> {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const directory = this.file.externalDataDirectory || this.file.dataDirectory;

    try {
      const arrayBuffer = await data.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      console.log('Saving file to:', directory + `${fileName}.xlsx`);

      await this.file.writeFile(directory, `${fileName}.xlsx`, base64Data, { replace: true });
      console.log('File saved successfully!');
    } catch (error) {
      console.error('Error saving file on mobile:', error);
    }
  }

  private async requestPermissions(): Promise<void> {
    const permissions = [
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    ];

    for (const permission of permissions) {
      const hasPermission = await this.androidPermissions.checkPermission(permission);
      if (!hasPermission.hasPermission) {
        await this.androidPermissions.requestPermission(permission);
      }
    }
  }

  private isMobile(): boolean {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  } */
}