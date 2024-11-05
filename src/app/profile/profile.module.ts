import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng.module';
import { ProfileService } from './profile.service';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    ProfileRoutingModule
  ],
  providers : [ProfileService]
})
export class ProfileModule { }
