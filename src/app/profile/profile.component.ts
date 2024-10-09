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
    this.profileService.getProfileDetails((data: any) => {
      this.profileDetails = data;
    })
  }

  tabSelection(filter: string) {
    this.activeTab = filter;
  }

}
