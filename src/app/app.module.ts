import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { TaskComponent } from './main-dashboard/task/task.component';
import {GraphComponent} from './main-dashboard/graph/graph.component';

import {GraphService} from './services/graph.service';
import {TaskService} from './services/task.service';
import {AuthService} from './services/auth.service';
import {AuthGuard, AuthGuardForHome} from './services/auth.guard';
import {UserService} from './services/user.service';

import {LeftNavbarComponent} from './left-navbar/left-navbar.component';
import {TopNavbarComponent} from './top-navbar/top-navbar.component';
import { FooterComponent } from './footer/footer.component';
import { TilesComponent } from './main-dashboard/tiles/tiles.component';
import { RecentSalesComponent } from './main-dashboard/recent-sales/recent-sales.component';
import { CarouselComponent } from './main-dashboard/carousel/carousel.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainDashboardComponent,
    TaskComponent,
    GraphComponent,
    LeftNavbarComponent,
    TopNavbarComponent,
    FooterComponent,
    TilesComponent,
    RecentSalesComponent,
    CarouselComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firestore),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [ GraphService, TaskService, AuthService, AuthGuard, AuthGuardForHome, UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
