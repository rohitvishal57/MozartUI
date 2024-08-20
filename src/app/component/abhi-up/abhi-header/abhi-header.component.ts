import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-abhi-header',
  templateUrl: './abhi-header.component.html',
  styleUrls: ['./abhi-header.component.scss']
})
export class AbhiHeaderComponent {
  constructor(public common:CommonService,private router:Router){

  }

  redirect(){
    this.router.navigate(["portal/agent/viewproducts"]);
  }

}
