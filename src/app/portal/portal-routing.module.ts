import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KycComponent } from './kyc/kyc.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
    {path: 'yatra/kyc',component: KycComponent},
    {path: 'renewal/kyc',component: KycComponent},
    {path: 'yatra/payment',component: PaymentComponent},
    {path: 'renewal/payment',component: PaymentComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortalRoutingModule { }
