import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './service/authservice/authguard.service';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AddcategoryComponent } from './modules/category/addcategory/addcategory.component';
import { UpdatecategoryComponent } from './modules/category/updatecategory/updatecategory.component';
import { ListcategoryComponent } from './modules/category/listcategory/listcategory.component';
import { AdduserComponent } from './modules/user/adduser/adduser.component';
import { UpdateuserComponent } from './modules/user/updateuser/updateuser.component';
import { ListuserComponent } from './modules/user/listuser/listuser.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { animation: 'HomeComponent' } },
  { path: 'kategoriler', component: ListcategoryComponent, canActivate: [AuthGuard], data: { animation: 'ListcategoryComponent' } },
  { path: 'kategoriler/ekle', component: AddcategoryComponent, canActivate: [AuthGuard], data: { animation: 'AddcategoryComponent' } },
  { path: 'kategoriler/guncelle', component: UpdatecategoryComponent, canActivate: [AuthGuard], data: { animation: 'UpdatecategoryComponent' } },
  { path: 'kullanicilar', component: ListuserComponent, canActivate: [AuthGuard], data: { animation: 'ListuserComponent' } },
  { path: 'kullanicilar/ekle', component: AdduserComponent, canActivate: [AuthGuard], data: { animation: 'AdduserComponent' } },
  { path: 'kullanicilar/guncelle', component: UpdateuserComponent, canActivate: [AuthGuard], data: { animation: 'UpdateuserComponent' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
