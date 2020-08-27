import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
    providedIn: 'root'
})
export class UiHelperService {

    constructor() { }

    closeSideBar() {
        let hasHtmlNavOpen = $('#bigboss').hasClass('nav-open');
        if (hasHtmlNavOpen) {
            $('.close-layer').click();
        }
    }
}
