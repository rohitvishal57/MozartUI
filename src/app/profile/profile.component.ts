import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileDetails: any;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    this.profileService.getProfileDetails(reqData).subscribe((res: any) => {
      if (res.success) {
        // this.profileDetails = res.data;
        const output = Object.keys(res.data).map(key => ({
          heading: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase()), // Capitalize heading
          icon: this.getIcons(key),
          value: key === 'dateOfBirth' ?  new Date(res.data[key]).toLocaleDateString('en-US') : res.data[key]
        }));
        this.profileDetails = output
      }
    })
  }

  getIcons(key: string) {
    switch (key) {
      case 'agentCode':
      case 'parentCode':
      case 'branchOfficeCode':
      case 'spCode':
      case 'branchOfficeName':
      case 'smCode':
        return 'icon_branch_office';
        break;
      case 'firstName':
      case 'lastName':
      case 'middleName':
      case 'spName':
      case 'smName':
        return 'name';
        break;
      case 'mobileNumber':
      case 'spMobile':
      case 'alternateMobileNumber':
      case 'smMobile':
        return 'phone';
        break;
      case 'smEmail':
      case 'emailId':
      case 'spEmail':
      case 'alternateEmailId':
        return 'email';
        break;
      case 'gender':
        return 'gender';
        break;
      case 'dateOfBirth':
        return 'dob';
        break;
      case 'agentCategory':
        return 'spouse';
        break;
      case 'subChannel':
        return 'icon_sub_channel';
        break;
      case 'parentName':
        return 'icon_parent_name';
        break;

      default:
        return 'spouse'
        break;
    }
  }


}
