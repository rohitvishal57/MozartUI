import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { endorsementDetails } from '../../interface/endorsement.interface';
import { EndorsementsRequestsService } from './endorsements-requests.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-endorsements-requests',
  templateUrl: './endorsements-requests.component.html',
  styleUrls: ['./endorsements-requests.component.scss']
})

export class EndorsementsRequestsComponent implements OnInit {

  tableData = {
    title: 'All requests',
    actionbtnList: [
      {
        name: 'New Requests', class: 'btn_newRequest', icon: 'assets/Img/icon_plus_red.svg'
      }
    ],
    filterList: [
      {
        name: 'All', description: 'All', class: 'All', icon: ''
      },
      {
        name: 'Active', description: 'All', class: 'Active', icon: ''
      },
      {
        name: 'Resolved', description: 'All', class: 'Resolved', icon: ''
      },
      {
        name: 'Cancelled', description: 'All', class: 'Cancelled', icon: ''
      }
    ],
    filterOptionsList: [
      'Request ID', 'Policy Number', 'Member Name'
    ],
    selectedView: "list",
    tableRes: {
      headerList: [
        { name: 'Request' },
        { name: 'Policy No.' },
        { name: 'Product Name' },
        { name: 'Member Name' },
        { name: 'Request Type' },
        { name: 'Status' },
        { name: 'Raised Date' },
        { name: 'Action' }
      ],
      resourceList: [] = []
    }
  };

  endorsementDetails: endorsementDetails[] = [];
  productsList: any;
  requestTypes: any;
  isDesktopView: any;

  constructor(private router: Router,
    private endorsementService: EndorsementsRequestsService,
    private datePipe: DatePipe,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getRequestList();
    this.getProducts();
  }
  getProducts() {
    const reqData = {
      "agentCode": localStorage.getItem("agentCode")
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res: any) => {
        this.productsList = res.data;
        const uniqueRequestTypes = Array.from(new Set(this.productsList
          .map((product: any) => product.familyPlan)))
          .map((requestType) => ({ name: requestType, selected: false }));
        this.requestTypes = uniqueRequestTypes;
      },
      error: (err: any) => {
        console.log("error coming form getproduct list API");
      }
    })
  }

  downloadRequest(data: any) {
    alert(data.status);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
    }
  }

  requestsListRequestBody: any = {
    "agentCode": localStorage.getItem('agentCode'),
    "fromDate": "",
    "toDate": "",
    "start": 0,
    "length": 10,
    "sortColumn": "RaisedOn",
    "searchColumn": "",
    "sortDirection": "DESC",
    "searchString": "",
    "products": [],
    "uiStatus": ""
  }

  getRequestList() {
    this.endorsementDetails = [];
    this.endorsementService.getEndorsementDetailsApi(this.requestsListRequestBody).subscribe(
      (response: any) => {
        if (response.data && response.statusCode == "200" && response.isSuccess) {
          this.endorsementDetails = response.data.endorsementDetails.map((obj: any) => {
            const date = new Date(obj.raisedOn);
            const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
            return {
              ...obj, raisedOn: formattedDate
            }
          });
          this.tableData.tableRes.resourceList = JSON.parse(JSON.stringify(this.endorsementDetails));
        } else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        console.error("Error from API:", error);
      }
    );
  }

  quotesViews(view: string) {
    this.tableData.selectedView = view;
  }

  redirect(value: any) {
    this.router.navigate([value]);
  }

  onEmitBtn(ev: any) { }
  onSelectedFilter(ev: any) { }

}