import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { CommonModule } from '@angular/common';
import { GuestComponent } from './guest/guest.component';
import { WaiterComponent } from './waiter/waiter.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RestaurantInformationComponent } from './restaurant-information/restaurant-information.component';

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    GuestComponent,
    WaiterComponent,
    AdminComponent,
    AdminLoginComponent,
    RestaurantInformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
