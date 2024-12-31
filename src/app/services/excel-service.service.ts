import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {
  
  constructor() { }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const link = document.createElement('a');
    const url = URL.createObjectURL(data);
    link.href = url;
    link.download = fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';