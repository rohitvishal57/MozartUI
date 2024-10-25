import { Component } from '@angular/core';

@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss']
})
export class ProductComparisonComponent {

  comparisonItems: any[] = [];

  ngOnInit(): void {
    const savedItems = sessionStorage.getItem('compareItems');
    if (savedItems) {
      this.comparisonItems = JSON.parse(savedItems);
    }
  }



}
