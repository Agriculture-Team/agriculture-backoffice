import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/moduleservice/user.service';
import { NotificationsService } from 'angular2-notifications';
import { UiHelperService } from 'src/app/service/helper/uihelper.service';
import { ValidationService } from 'src/app/service/helper/validation.service';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

interface User {
  NameSurname: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  RePassword: string;
  IsOnline: boolean;
  Id: number;
};
@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css']
})
export class UpdateuserComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  Title = 'Kullanıcı Güncelle';
  TitleIcon = 'person_add';
  SubmitButton = 'Güncelle';
  formGroup: FormGroup;
  phoneMask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  constructor(private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private uiHelpService: UiHelperService,
    private validationService: ValidationService,
    public activatedRoute: ActivatedRoute) { }

  state$: Observable<object>;
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
      'IsOnline': [true],
      'Id': ['']
    });
    setTimeout(() => {
      this.loadDefaultValues();
    }, 250);
  }


  loadDefaultValues() {
    this.blockUI.start();
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe((data: any) => {
      if (data && data.data) {
        var item = JSON.parse(data.data) as User;
        if (item && !_.isUndefined(item)) {
          this.formGroup.setValue({
            'NameSurname': item.NameSurname,
            'Email': item.Email,
            'PhoneNumber': item.PhoneNumber,
            'Password': '',
            'RePassword': '',
            'IsOnline': item.IsOnline,
            'Id': item.Id
          });
          this.uiHelpService.checkInputLabels();
          this.blockUI.stop();
        }
      }
      else {
        this.blockUI.stop();
        this.notificationService.warn('Dikkat', 'Kullanıcı detayları getirilirken hata meydana geldi. Lütfen tekrar deneyin.');
        setTimeout(() => {
          this.back();
        }, 3500);
      }
    });
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
    if (!_.isEmpty(post.Password) && _.isEmpty(post.RePassword)) {
      this.notificationService.warn('Uyarı', 'Lütfen Şifre Tekrar giriniz!');
      return;
    }
    if (!_.isEmpty(post.Password) && !_.isEmpty(post.RePassword) && post.Password != post.RePassword) {
      this.notificationService.warn('Uyarı', 'Şifre ve Şifre Tekrar aynı olmalıdır!');
      return;
    }
    this.blockUI.start();
    this.userService.update(post).subscribe((response: any) => {
      if (response && response.status == true) {
        this.notificationService.success('İşlem Başarılı', response.message);
      } else {
        this.notificationService.error('İşlem Hatalı', response.message);
      }
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
    })
  }

}
