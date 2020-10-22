import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ConstantService } from '../helper/constant.service';
import { AuthenticationService } from '../authservice/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    @BlockUI() blockUI: NgBlockUI;
    constructor(private http: HttpClient,
        private constantService: ConstantService,
        private authService: AuthenticationService,
        private notificationService: NotificationsService) { }

    getMenuList(model: any) {
        return this.http.post(this.constantService.apiUrl + '/dashboard/getmenulist', model).pipe(map((response) => {
            return response;
        }), catchError((error, caught) => {
            this.notificationService.warn('Dikkat!', error);
            this.blockUI.stop();
            if (error == 'Unauthorized') {
                this.authService.refreshLogin();
            } else {
                return '';
            }
        }));
    }

    getLogList() {
        return this.http.get(this.constantService.apiUrl + '/dashboard/getlastloglist').pipe(map((response) => {
            return response;
        }), catchError((error, caught) => {
            this.notificationService.warn('Dikkat!', error);
            this.blockUI.stop();
            if (error == 'Unauthorized') {
                this.authService.refreshLogin();
            } else {
                return '';
            }
        }));
    }

    getUserList() {
        return this.http.get(this.constantService.apiUrl + '/dashboard/getlastuserlist').pipe(map((response) => {
            return response;
        }), catchError((error, caught) => {
            this.notificationService.warn('Dikkat!', error);
            this.blockUI.stop();
            if (error == 'Unauthorized') {
                this.authService.refreshLogin();
            } else {
                return '';
            }
        }));
    }


}