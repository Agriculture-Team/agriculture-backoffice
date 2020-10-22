import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConstantService {
    apiUrl = 'http://localhost:4839/api';
    //apiUrl = 'http://service.mustafakartal.web.tr/api';

    constructor() { }
}
