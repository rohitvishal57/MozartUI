import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileDetails : any;

  constructor(private profileService : ProfileService){}

  ngOnInit(): void {
    this.profileService.getProfileDetails((data :any) =>{
      this.profileDetails = data;
    })
  }

}
