import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datepipe'
})
export class DatepipePipe implements PipeTransform {

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

}
