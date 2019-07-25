import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { SupplierRegistrationComponent } from './supplier-registration/supplier-registration.component';
import { PriceManagementComponent } from './price-management/price-management.component';
import { ChoiceOfSuppliersComponent } from './choice-of-suppliers/choice-of-suppliers.component';
import { DemandRegistrationComponent } from './demand-registration/demand-registration.component';
import { AuthService } from './auth.service';
import { AuthComponent } from './auth/auth.component';
import { UserService } from './user.service';
import { UserListComponent } from './user-list/user-list.component';
import { OffersService } from './offers.service';
import { LoadingComponent } from './loading/loading.component';
import { AuthGuardService } from './auth-guard.service';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

@NgModule({
  imports:      [ 
    BrowserModule, 
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'supplier-registration', component: SupplierRegistrationComponent },
      { path: 'price-management', canActivate: [AuthGuardService],component: PriceManagementComponent },
      { path: 'choice-of-suppliers', component: ChoiceOfSuppliersComponent },
      { path: 'demand-registration', component: DemandRegistrationComponent },
      { path: 'order-status', component: OrderStatusComponent },
      { path: 'auth', component: AuthComponent },
      { path: 'users', component: UserListComponent },
      { path: 'user-stats', canActivate: [AuthGuardService], component: UserStatisticsComponent },
      { path: 'loading', component: LoadingComponent },
      { path: 'index', component: HomepageComponent },
      { path: 'order-confirmation', component: OrderConfirmationComponent },
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
    ]) 
  ],
  declarations: [ AppComponent, HelloComponent, SupplierRegistrationComponent, PriceManagementComponent, ChoiceOfSuppliersComponent, DemandRegistrationComponent, AuthComponent, UserListComponent, LoadingComponent, UserStatisticsComponent, HomepageComponent, PageNotFoundComponent, OrderStatusComponent, OrderConfirmationComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ AuthService, UserService, OffersService, AuthGuardService]
})
export class AppModule { }
