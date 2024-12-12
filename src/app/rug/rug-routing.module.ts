import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";
import { ViewLeadsComponent } from "./components/view-leads/view-leads.component";
import { ProductDownloadComponent } from "./components/product-download/product-download.component";
import { BbTestPageComponent } from "./bb-test-page/bb-test-page.component";
import { D2cTestPageComponent } from "./d2c-test-page/d2c-test-page.component";

const routes: Routes = [
    { path:'', component: RugDynamicFormComponent },
    { path:'web', component: ViewLeadsComponent },
    { path:'verification-script', component: ViewLeadsComponent },
    { path:'view-checker-leads', component: ViewLeadsComponent },
    { path:'productdownload', component: ProductDownloadComponent },
    { path:'base-caller-upload', component: ProductDownloadComponent },
    { path:'av-upload', component: ProductDownloadComponent },
    { path:'view-for-solo-journey', component: ProductDownloadComponent },
    { path:'view-unVerified-leads', component: ProductDownloadComponent },
    { path:'view-for-dual-journey', component: ProductDownloadComponent },
    { path:'extract-base-agent', component: ProductDownloadComponent },
    { path:'manage-LOB', component: ProductDownloadComponent },
    { path:'policy-view-details', component: ProductDownloadComponent },
    { path:'test-page', component: BbTestPageComponent },
    { path:'bb-test-page', component: BbTestPageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RugRoutingModule{}
