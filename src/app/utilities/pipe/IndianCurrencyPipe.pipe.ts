import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined) return '';

    // Convert the value to a number if it's a string
    const amount = typeof value === 'string' ? parseFloat(value) : value;

    // Format the number using Intl.NumberFormat for Indian currency
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }
}
