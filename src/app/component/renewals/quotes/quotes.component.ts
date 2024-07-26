import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent {
  data:any[] = [];
  p: number = 1;
  quotesView: boolean = false
  showSearch: boolean = false;
  showEllipsisDropdown: number | null = null;


  @ViewChild('filterDropdown', { static: false })
  filterDropdown!: ElementRef;
  @ViewChild('filterSection', { static: false }) filterSection!: ElementRef;


  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<any[]>('/assets/jsonValue/quotesValue.json').subscribe(data => {
      this.data = data;
    });
  }

  toggleFilterDropdown(): void {
    if (this.filterDropdown && this.filterDropdown.nativeElement) {
      const filterDropdown = this.filterDropdown.nativeElement;
      filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
    }
  }

  applyFilters(): void {
    // Implement filter logic here
    // alert('Filters applied');
    this.toggleFilterDropdown();
  }

  cancel(): void {
    // Implement reset logic here
    // alert('Filters reset');
    this.toggleFilterDropdown();
  }
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.renderer.addClass(this.filterSection.nativeElement, 'blur');
    } else {
      this.renderer.removeClass(this.filterSection.nativeElement, 'blur');
    }
  }
  quotesViews(): void {
    this.quotesView = !this.quotesView;
  }

  toggleEllipsisDropdown(index: number): void {
    this.showEllipsisDropdown = this.showEllipsisDropdown === index ? null : index;
  }

  download(item: any): void {
    // Implement download logic here
    // alert('Download');
    this.toggleEllipsisDropdown(null as unknown as number);
  }

  delete(item: any): void {
    // Implement delete logic here
    // alert('Delete');
    this.toggleEllipsisDropdown(null as unknown as number);
  }

  shareViaEmail(item: any): void {
    // Implement share via email logic here
    // alert('Share via email');
    this.toggleEllipsisDropdown(null as unknown as number);
  }

  sendRenewalNotice(item: any): void {
    // Implement send renewal notice logic here
    // alert('Send Renewal Notice');
    this.toggleEllipsisDropdown(null as unknown as number);
  }

  createAutoDebitLink(item: any): void {
    // Implement create auto-debit link logic here
    // alert('Create Auto-Debit Registration Link');
    this.toggleEllipsisDropdown(null as unknown as number);
  }

}