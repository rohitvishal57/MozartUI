import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-download',
  templateUrl: './product-download.component.html',
  styleUrls: ['./product-download.component.scss']
})
export class ProductDownloadComponent implements OnInit{
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
