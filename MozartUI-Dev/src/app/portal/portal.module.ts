import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoute } from './portal-routing.module';
import { FooterComponent } from './footer/footer.component';
import { PortalComponent } from './portal.component';

@NgModule({
  imports: [
    CommonModule,
    PortalRoute,
  ],
  declarations: [
    PortalComponent,
  ],
  exports:[
    PortalComponent
  ]
})
export class PortalModule { 
}
