import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/moduleservice/user.service';
import { NotificationsService } from 'angular2-notifications';
import { UiHelperService } from 'src/app/service/helper/uihelper.service';
import { ValidationService } from 'src/app/service/helper/validation.service';
import * as _ from 'lodash';

interface User {
  NameSurname: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  RePassword: string;
};
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  Title = 'Yeni Kullanıcı';
  TitleIcon = 'person_add';
  SubmitButton = 'Kaydet';
  formGroup: FormGroup;
  phoneMask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  constructor(private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private uiHelpService: UiHelperService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.loadForm();
  }

  back() {
    this.router.navigate(['/kullanicilar'])
  }

  loadForm() {
    this.formGroup = this.formBuilder.group({
      'NameSurname': ['', [Validators.required]],
      'Email': ['', Validators.required],
      'PhoneNumber': [''],
      'Password': ['', Validators.required],
      'RePassword': ['', Validators.required],
      'IsOnline': [true]
    });
    setTimeout(() => {
      this.loadDefaultValues();
    }, 250);
  }

  loadDefaultValues() {
    this.formGroup.setValue({
      'NameSurname': '',
      'Email': '',
      'PhoneNumber': '',
      'Password': '',
      'RePassword': '',
      'IsOnline': true
    });
    this.uiHelpService.checkInputLabels();
  }

  onSubmit(post: User) {
    if (_.isEmpty(post.NameSurname)) {
      this.notificationService.warn('Uyarı', 'Lütfen Adı Soyadını giriniz!');
      return;
    }
    if (_.isEmpty(post.Email)) {
      this.notificationService.warn('Uyarı', 'Lütfen E-Posta Adresi giriniz!');
      return;
    }
    if (!_.isEmpty(post.Email) && !this.validationService.IsValidEmail(post.Email)) {
      this.notificationService.warn('Uyarı', 'Lütfen geçerli bir E-Posta Adresi giriniz!');
      return;
    }
    if (_.isEmpty(post.Password)) {
      this.notificationService.warn('Uyarı', 'Lütfen Şifre giriniz!');
      return;
    }
    if (_.isEmpty(post.RePassword)) {
      this.notificationService.warn('Uyarı', 'Lütfen Şifre Tekrar giriniz!');
      return;
    }
    if (!_.isEmpty(post.Password) && !_.isEmpty(post.RePassword) && post.Password != post.RePassword) {
      this.notificationService.warn('Uyarı', 'Şifre ve Şifre Tekrar aynı olmalıdır!');
      return;
    }
    this.blockUI.start();
    this.userService.save(post).subscribe((response: any) => {
      if (response && response.status == true) {
        this.notificationService.success('İşlem Başarılı', response.message);
        this.loadDefaultValues();
      } else {
        this.notificationService.error('İşlem Hatalı', response.message);
      }
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
    })
  }

}
