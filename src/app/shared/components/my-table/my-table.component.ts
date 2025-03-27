import { CommonModule } from '@angular/common';
import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.css']
})
export class MyTableComponent implements OnInit {

  @Input() HeadArray :any[] | undefined = [];
  @Input() tableContent :any[]|undefined = []; 
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  edit(item: any) {
    debugger;
    this.onEdit.emit(item);
  }
  delete(item: any) {
    debugger;
    this.onDelete.emit(item);
  }
}
