import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CustomersService } from '../customers.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-customer-health-test',
  templateUrl: './customer-health-test.component.html',
  styleUrls: ['./customer-health-test.component.scss']
})
export class CustomerHealthTestComponent {
  params: any;
  proposalNum: any;
  agentCode: any;
  proposalData:any;
  memberdata:any;
  isTestComplete :boolean[] = [];
  constructor(private route: ActivatedRoute,private commonService: CommonService,
    private customerService: CustomersService,private toast: NgToastService
  ){

  }

  ngOnInit() {
    if (Object.keys(this.route.snapshot.queryParams).length) {
      this.params = this.route.snapshot.queryParams;
      console.log(this.params);
      if (this.params['token']) {
        localStorage.setItem('token', this.params['token']);
      }
      this.proposalNum = this.params['pNum'];
      this.agentCode = this.params['agentCode'];
      console.log(this.proposalNum,this.agentCode);
    }
    this.memberDetails();
  }
  memberDetails(){
    const reqData = {
      proposalNum: this.proposalNum,
      agentCode: this.agentCode
    };
    this.commonService.getfullquotejsonfromproposalnum(reqData).subscribe({
      next: (res:any) => {
        console.log(res);
        this.proposalData = JSON.parse(res.data.fullQuoteJson);
        this.memberdata = this.proposalData.insuredMemberDetails;
        console.log(this.proposalData,this.memberdata);
        this.memberdata.forEach((member:any,index:any)=>{
          if(member.upfrontGoodHealthDiscount && member.isTestComplete){
            this.isTestComplete[index] = member.isTestComplete;
          }
          else{
            this.isTestComplete[index] = false;
          }
        })
        // if(this.proposalData.upfrontGoodHealthDiscount && this.proposalData.isTestComplete){
        //   this.isTestComplete = this.proposalData.isTestComplete;
        // }
      },
      error: (err) => {
        console.error(err);  
      }
    })
  }

  startTest(data:any){
    console.log(data);
    debugger;
    const reqData= {
      partyId: data.memberId,
      proposalNo: this.proposalNum,
      memberIndex: data.memberIndex.toString(),
      dob: data.memberdob,
      mobileNo: data.mobileNumber,
      gender: data.memberGender == 'M' ? 'Male' : 'Female',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.emailId,
      height:  Math.round(((data.height ? parseInt(data.height) * 12 : 0) + (data.heightInInches ? parseInt(data.heightInInches) : 0)) * 2.54).toString(),
      weight: data.weight
    };
    console.log(reqData);
    
    this.customerService.goodhealthmemberurl(reqData).subscribe({
      next: (res:any) => {
        console.log(res);
        const newUrl = res?.data;
        if (newUrl) {
          window.location.href = newUrl; // Redirect the user to the new URL
        }
      },
      error: (err) => {
        console.error(err); 
      }
    })
  }


  submit(){
      const reqData = {
        proposalNumber: this.proposalNum,
        isSubmit: true
      }
      this.customerService.updateproposaltest(reqData).subscribe({
        next: (res:any) => {
          console.log(res);
          this.toast.success({ detail: "Success", summary: "Test submitted successfully", duration: 3000 });
          if(!this.isTestComplete){
            this.toast.error({ detail: "Error", summary: "Need to complete test ", duration: 3000 });
          }
        },
        error: (err) => {
          console.error(err); 
        }
      })
  }
}
