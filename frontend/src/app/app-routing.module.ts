import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { GuestComponent } from './guest/guest.component';
import { WaiterComponent } from './waiter/waiter.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
    {path: "", component: PocetnaComponent},
    {path: "guest", component: GuestComponent},
    {path: "waiter", component: WaiterComponent},
    {path: "adminlogin", component: AdminLoginComponent},
    {path: "admin", component: AdminComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
