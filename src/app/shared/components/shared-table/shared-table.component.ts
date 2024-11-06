import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {

  @Input() tableData: any;
  @Output() actionBtnEmit = new EventEmitter();
  @Output() statusFilterEmit = new EventEmitter();
  @Output() selectedFilterEmit = new EventEmitter();

  selectedFilterOption : any;

  redirectActionBtn(btnType: any) {
    this.actionBtnEmit.emit(btnType);
  }

  statusFilter(filterName: any) {
    this.statusFilterEmit.emit(filterName)
  }

  onSelectChanges(filterName: any) {
    this.selectedFilterEmit.emit(filterName)
  }

  getClass(filterName: any) {
    switch (filterName) {
      case 'All':
        return 'All'
        break;
      case 'Active':
        return 'All'
        break;
      case 'Resolved':
        return 'All'
        break;

      default:
        return 'All'
        break;
    }
  }

}
