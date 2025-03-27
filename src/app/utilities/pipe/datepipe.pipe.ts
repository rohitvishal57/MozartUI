import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datepipe'
})
export class DatepipePipe implements PipeTransform {
  constructor(private datePipe: DatePipe){}

  transform(value: string | Date, _format: string = 'dd-mm-yyyy'): string {
    if (!value) return '';

    const date = new Date(value);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return ''; 
    }
    // Format the date to yyyy-MM-dd
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${day}-${month}-${year}`;

  }


  getDateRange(rangeType: string): { startDate: string, endDate: string } {
    const currentDate = new Date();
    let startDate: string | any;
    let endDate: string | any;

    switch(rangeType) {
      case 'Last7Days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        startDate = this.datePipe.transform(sevenDaysAgo, 'yyyy-MM-dd');
        endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        break;

      case 'LastMonth':
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startDate = this.datePipe.transform(monthStart, 'yyyy-MM-dd');
        endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        break;

      case 'QuarterWise':
        const currentMonth = currentDate.getMonth();
        let quarterStartMonth: number;
        
        if (currentMonth >= 3 && currentMonth <= 5) {
          quarterStartMonth = 3;
        } else if (currentMonth >= 6 && currentMonth <= 8) {
          quarterStartMonth = 6;
        } else if (currentMonth >= 9 && currentMonth <= 11) {
          quarterStartMonth = 9;
        } else {
          quarterStartMonth = 0;
        }
        
        const quarterStartDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
        startDate = this.datePipe.transform(quarterStartDate, 'yyyy-MM-dd');
        endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        break;

      case 'FinancialYear':
        const year = currentDate.getMonth() >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
        const financialYearStartDate = new Date(year, 3, 1); 
        
        startDate = this.datePipe.transform(financialYearStartDate, 'yyyy-MM-dd');
        endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        break;
        
      default:
        startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    }

    return { startDate, endDate };
  }

}
