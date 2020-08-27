import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ConstantService } from '../helper/constant.service';
import { AuthenticationService } from '../authservice/authentication.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {

    constructor(private http: HttpClient,
        private constantService: ConstantService,
        private authService: AuthenticationService) { }

        list() {
            return this.http.get(this.constantService.apiUrl + '/category/getbolist').pipe(map((response) => {
                return response;
            }), catchError((error, caught) => {
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
                if (error == 'Unauthorized') {
                    this.authService.refreshLogin();
                } else {
                    return '';
                }
            }));
        }
    
        save(model: any) {
            return this.http.post(this.constantService.apiUrl + '/category/save', model).pipe(map((response) => {
                return response;
            }), catchError((error, caught) => {
                if (error == 'Unauthorized') {
                    this.authService.refreshLogin();
                } else {
                    return '';
                }
            }));
        }
    
        update(model: any) {
            return this.http.post(this.constantService.apiUrl + '/category/update', model).pipe(map((response) => {
                return response;
            }), catchError((error, caught) => {
                if (error == 'Unauthorized') {
                    this.authService.refreshLogin();
                } else {
                    return '';
                }
            }));
        }
    
        change(model: any) {
            return this.http.post(this.constantService.apiUrl + '/category/change', model).pipe(map((response) => {
                return response;
            }), catchError((error, caught) => {
                if (error == 'Unauthorized') {
                    this.authService.refreshLogin();
                } else {
                    return '';
                }
            }));
        }
    
        delete(model: any) {
            return this.http.post(this.constantService.apiUrl + '/category/delete', model).pipe(map((response) => {
                return response;
            }), catchError((error, caught) => {
                if (error == 'Unauthorized') {
                    this.authService.refreshLogin();
                } else {
                    return '';
                }
            }));
        }

}