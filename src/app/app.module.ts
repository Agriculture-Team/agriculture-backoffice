import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ErrorInterceptor } from './service/helper/error.interceptor';
import { JwtInterceptor } from './service/helper/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { BlockUIModule } from 'ng-block-ui';
import { TextMaskModule } from 'angular2-text-mask';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/partial/header/header.component';
import { SidebarComponent } from './components/partial/sidebar/sidebar.component';
import { FooterComponent } from './components/partial/footer/footer.component';
import { ConfirmdialogComponent } from './components/confirmdialog/confirmdialog.component';

import { AddcategoryComponent } from './modules/category/addcategory/addcategory.component';
import { UpdatecategoryComponent } from './modules/category/updatecategory/updatecategory.component';
import { ListcategoryComponent } from './modules/category/listcategory/listcategory.component';
import { AdduserComponent } from './modules/user/adduser/adduser.component';
import { UpdateuserComponent } from './modules/user/updateuser/updateuser.component';
import { ListuserComponent } from './modules/user/listuser/listuser.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ConfirmdialogComponent,
    AddcategoryComponent,
    UpdatecategoryComponent,
    ListcategoryComponent,
    AdduserComponent,
    UpdateuserComponent,
    ListuserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SimpleNotificationsModule.forRoot(),
    BlockUIModule.forRoot(),
    TextMaskModule
  ],
  entryComponents: [ConfirmdialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    NotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
