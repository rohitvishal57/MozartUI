import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  pdfUrl = 'assets/productdetails.pdf'; // Adjust the path to your PDF file


  constructor() {}
  ngOnInit() {
    // this.downloadPdf();
  }
  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = 'productdetails.pdf';
    link.click();
  }
}
