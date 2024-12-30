import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-basecaller',
  templateUrl: './create-basecaller.component.html',
  styleUrls: ['./create-basecaller.component.scss']
})
export class CreateBasecallerComponent implements OnInit{
  createBaseCallerForm!:FormGroup;
  isUpdate: boolean = false;
  selectedBaseCallerId:any|null=null;
  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService, 
    private toast: NgToastService,
    private router: Router, 
    private route: ActivatedRoute) 
  {}
  ngOnInit(){
    this.inItForm();
    // this.route.paramMap.subscribe(params => {
    //   this.selectedBaseCallerId = params.get('avId');
    //   if(this.selectedBaseCallerId) {
    //     this.getAllAVs();
    //   }
    // });
  }
  inItForm() {
      this.createBaseCallerForm = this.formBuilder.group({
        domainId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        baseCallerEmpId: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
        baseCallerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        tlId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        tlName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        amId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        amName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        omId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        omName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
        center: ['', [Validators.required]],
        lob: ['', Validators.required],
        vendor: ['', Validators.required],
        abhiSalesManager: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        abhiAreaHead: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
        recruitedMonitoringManager: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
        imdCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
      });
    }
}
