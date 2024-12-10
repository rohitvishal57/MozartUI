import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Item } from 'src/app/interface/modal-popup.interface';

@Component({
  selector: 'app-bankbranch-modal',
  templateUrl: './bankbranch-modal.component.html',
  styleUrls: ['./bankbranch-modal.component.scss']
})
export class BankbranchModalComponent {
  filteredList: Item[] = [];
  searchQuery: string = '';

  constructor(
    private _router: Router,
    public dialogRef: MatDialogRef<BankbranchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemsList: Item[] }
  ) {}

  ngOnInit() {
    this.filteredList = [...this.data.itemsList]
  }

  filterList() {
    this.filteredList = this.data.itemsList.filter(
      (item) =>
        item.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.agentCode.includes(this.searchQuery)
    );
  }

  selectItem(item: any) {
    localStorage.setItem('agentCode', item.agentCode);
    this.dialogRef.close();
    this._router.navigate(['dashboard']);
  }

  closeDialogAndRedirect(): void {
    this.dialogRef.close();
  }
  
}
