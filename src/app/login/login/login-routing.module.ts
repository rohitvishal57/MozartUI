import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { StatusValidationComponent } from '../status-validation/status-validation.component';

const routes: Routes = [
  { path:'', component:LoginComponent },
  { path:":status/loginstatus", component: StatusValidationComponent },
  { path:'',redirectTo:'',pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
