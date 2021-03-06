import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ConstantService } from '../helper/constant.service';
import { AuthenticationService } from '../authservice/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    @BlockUI() blockUI: NgBlockUI;
    constructor(private http: HttpClient,
        private constantService: ConstantService,
        private authService: AuthenticationService,
        private notificationService: NotificationsService) { }

    list() {
        return this.http.get(this.constantService.apiUrl + '/category/getbolist').pipe(map((response) => {
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

    detail(model: string) {
        return this.http.get(this.constantService.apiUrl + '/category/detail?model=' + model).pipe(map((response) => {
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

    save(model: any) {
        return this.http.post(this.constantService.apiUrl + '/category', model).pipe(map((response) => {
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

    update(model: any) {
        return this.http.put(this.constantService.apiUrl + '/category/'+model.id, model).pipe(map((response) => {
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

    change(model: any) {
        return this.http.put(this.constantService.apiUrl + '/category/'+model.id, model).pipe(map((response) => {
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

    delete(model: any) {
        return this.http.delete(this.constantService.apiUrl + '/category/'+model).pipe(map((response) => {
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