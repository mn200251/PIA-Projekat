import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { GuestComponent } from './guest/guest.component';
import { WaiterComponent } from './waiter/waiter.component';

const routes: Routes = [
    {path: "", component: PocetnaComponent},
    {path: "guest", component: GuestComponent},
    {path: "waiter", component: WaiterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
