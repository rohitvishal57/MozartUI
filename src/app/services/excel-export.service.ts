import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { File } from '@awesome-cordova-plugins/file/ngx'; // Use for file handling in mobile environments

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  constructor(private file: File) { }

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    if (this.isMobile()) {
      this.saveAsExcelFileForMobile(excelBuffer, fileName);
    } else {
      this.saveAsExcelFileForWeb(excelBuffer, fileName);
    }
  }

  private saveAsExcelFileForWeb(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}.xlsx`);
  }

  private async saveAsExcelFileForMobile(buffer: any, fileName: string): Promise<void> {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const directory = this.file.dataDirectory;

    try {
      const arrayBuffer = await data.arrayBuffer();
      await this.file.writeFile(directory, fileName, new Uint8Array(arrayBuffer), { replace: true });
      console.log('File saved successfully:', directory + fileName);
    } catch (error) {
      console.error('Error saving file on mobile:', error);
    }
  }

  private isMobile(): boolean {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
