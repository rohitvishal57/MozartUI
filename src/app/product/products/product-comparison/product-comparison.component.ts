import { Component } from '@angular/core';

@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss']
})
export class ProductComparisonComponent {

  comparisonItems: any ;

  ngOnInit(): void {
    const savedItems = sessionStorage.getItem('compareItems');
    if (savedItems) {
      this.comparisonItems = JSON.parse(savedItems);
    }

    console.log('comparisonItems',this.comparisonItems);

    this.comparisonItems = this.comparisonItems.map((product:any) =>{
      product.keyFeatures = JSON.parse(product.keyFeatures); // Convert string to array
      return product;
    });
    console.log('comparisonItems',this.comparisonItems);
  }



}
