import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-abhi-header',
  templateUrl: './abhi-header.component.html',
  styleUrls: ['./abhi-header.component.scss']
})
export class AbhiHeaderComponent {
  constructor(public common:CommonService){

  }

}
