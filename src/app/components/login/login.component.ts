import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantService } from 'src/app/service/helper/constant.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from 'src/app/service/authservice/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = 'AgricultureApp';
  loading: boolean;
  formGroup: FormGroup;
  post: any = '';

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private constantService: ConstantService,
    private authenticationService: AuthenticationService,
    private notificationsService: NotificationsService,
    private router: Router) {

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'Email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'Password': [null, [Validators.required]],
      'AuthType': '1'
    });
  }

  checkPassword(control) {
    let enteredPassword = control.value
    return enteredPassword ? { 'requirements': true } : null;
  }

  getErrorEmail() {
    return this.formGroup.get('Email').hasError('required') ? 'E-posta Adresi gereklidir...' : this.formGroup.get('Email').hasError('pattern') ? 'Geçerli bir E-Posta adresi giriniz...' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('Password').hasError('required') ? 'Şifre gereklidir...' : '';
  }

  onSubmit(post) {
    this.loading = true;
    this.http.post(this.constantService.apiUrl + '/authentication/login', post).subscribe((response: any) => {
      if (response && response.status == true && response.data) {
        this.loading = false;
        this.notificationsService.success(response.message);
        var userData = response.data;
        if (userData) {
          setTimeout(() => {
            localStorage.setItem('AccessToken', userData.accessToken);
            localStorage.setItem('NameSurname', userData.nameSurname);
            localStorage.setItem('Email', userData.email);
            localStorage.setItem('SecureKey', userData.secureKey);
            this.authenticationService.setCookie('SecureKey', userData.secureKey, 7, null);
            window.location.href = '/';
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }, 2000);
        }
      } else {
        this.loading = false;
        this.notificationsService.error(response.message)
      }
    }, error => (exception) => {
      console.error(JSON.stringify(exception));
      this.loading = false;
    });
  }

}
