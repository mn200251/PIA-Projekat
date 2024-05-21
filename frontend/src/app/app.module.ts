import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { CommonModule } from '@angular/common';
import { GuestComponent } from './guest/guest.component';
import { WaiterComponent } from './waiter/waiter.component';

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    GuestComponent,
    WaiterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
