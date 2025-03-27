import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  pdfUrl = 'assets/productdetails.pdf'; // Adjust the path to your PDF file
  disableBuyJourney: boolean | undefined;

  constructor(private authService: AuthService) {}
  ngOnInit() {
    // this.downloadPdf();
    this.disableBuyJourney = this.authService.getUserInfo().disableBuyJourney;
  }
  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = 'productdetails.pdf';
    link.click();
  }
}
