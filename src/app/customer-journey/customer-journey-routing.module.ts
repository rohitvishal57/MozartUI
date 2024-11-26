import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerJourneyComponent } from './customer-journey/customer-journey.component';


const routes: Routes = [
    {
        path: '',
        component: CustomerJourneyComponent, // Replace with your actual component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerJourneyRoutingModule { }
