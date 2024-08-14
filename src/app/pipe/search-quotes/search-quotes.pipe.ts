import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchQuotes'
})
export class SearchQuotesPipe implements PipeTransform {

  transform(items: any[], searchString: string): any[] {
    if (!items) return [];
    if (!searchString) return items;
    searchString = searchString.toLowerCase();
    return items.filter(item => {
      const nameMatch =item.Name.toLowerCase().includes(searchString);
      const mobileMatch =item.MobileNo.includes(searchString);
      return nameMatch || mobileMatch;
    });
  }

}
