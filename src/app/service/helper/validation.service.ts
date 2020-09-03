import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    constructor() { }

    IsValidEmail(email: string) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
}
