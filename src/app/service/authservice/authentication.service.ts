import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ConstantService } from '../helper/constant.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(private http: HttpClient,
    private constantService: ConstantService,
    private notificationsService: NotificationsService,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('AccessToken'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    let isAuth = false;
    if (this.currentUserSubject && this.currentUserSubject.value) {
      isAuth = true;
    }
    return isAuth;
  }

  logOut() {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    localStorage.removeItem('Id');
    localStorage.removeItem('LanguageId');
    localStorage.removeItem('NameSurname');
    localStorage.removeItem('Email');
    localStorage.removeItem('SecureKey');
    this.deleteCookie('SecureKey');
    this.currentUserSubject.next(null);
    window.location.reload();
  }

  public getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  public getLocalStorage(name: string) {
    return localStorage.getItem(name);
  }

  public deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  public setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  refreshLogin() {
    this.notificationsService.info('Bilgilendirme', 'Oturum süreniz dolduğu için tekrar oturum açılıyor.');
    var email = localStorage.getItem('Email');
    var password = localStorage.getItem('RefreshToken');
    this.logOut();
    var request = "userName=" + email + "&password=" + password + "&grant_type=password";
    this.http.post(this.constantService.apiUrl + '/login', request).pipe(map((response: any) => {
      return response;
    }), catchError((err, caught) => {
      window.location.reload();
      return '';
    })).subscribe((response: any) => {
      if (response && response.Status == 'true') {
        localStorage.setItem('AccessToken', response.access_token);
        var userData = JSON.parse(response.UserDetail);
        if (userData) {
          localStorage.setItem('RefreshToken', userData.RefreshToken);
          localStorage.setItem('NameSurname', userData.NameSurname);
          localStorage.setItem('Email', userData.EmailAddress);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        this.notificationsService.error('Hata', 'Sistem Taraflı Hata Meydana Geldi!');
      }
    });
  }
}
