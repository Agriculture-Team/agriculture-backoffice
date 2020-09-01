import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

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

    //Eğer input içine update sayfası gibi yerlerde sonradan value set ediliyorsa input üzerindeki labeli kaldırmak için çağırılır.
    checkInputLabels() {
        $('input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea')
            .each((element, input: any) => {
                if (!_.isUndefined(input) && !_.isEmpty(input.value)) {
                    $(input).parent('div').addClass('is-filled');
                }else{
                    $(input).parent('div').removeClass('is-filled');
                }
            });
    }
}
