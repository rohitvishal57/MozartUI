import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KycComponent } from './kyc/kyc.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
    {path: '',component: KycComponent},
    {path: '',component: PaymentComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortalRoutingModule { }
