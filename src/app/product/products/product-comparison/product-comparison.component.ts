import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss']
})
export class ProductComparisonComponent {

  comparisonItems: any = [];
constructor(    private router: Router){

}

  ngOnInit(): void {
    const savedItems = sessionStorage.getItem('compareItems');
    if (savedItems) {
      this.comparisonItems = JSON.parse(savedItems);
    }

    console.log('comparisonItems',this.comparisonItems);

    this.comparisonItems = this.comparisonItems.map((product:any) =>{
      product.keyFeatures = JSON.parse(product.keyFeatures.split(",")); // Convert string to array
      return product;
    });
    console.log('comparisonItems',this.comparisonItems);
  }




}
