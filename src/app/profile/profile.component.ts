import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileDetails: any;
  activeTab = 'tab1';

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    const reqData={
      "agentCode": localStorage.getItem('agentCode')
    }
    this.profileService.getProfileDetails(reqData).subscribe(res =>{
      if(res.success){
        this.profileDetails = res.data;
      }
    })
  }

  tabSelection(filter: string) {
    this.activeTab = filter;
  }

}
