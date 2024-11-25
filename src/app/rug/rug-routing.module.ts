import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";

const routes: Routes = [
    { path:'', component: RugDynamicFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RugRoutingModule{}
