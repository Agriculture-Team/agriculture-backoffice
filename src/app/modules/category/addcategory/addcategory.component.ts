import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/service/moduleservice/category.service';
import { NotificationsService } from 'angular2-notifications';
import * as _ from 'lodash';
import { UiHelperService } from 'src/app/service/helper/uihelper.service';
import { ConstantService } from 'src/app/service/helper/constant.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  Title = 'Yeni Kategori';
  TitleIcon = 'addchart';
  SubmitButton = 'Kaydet';
  formGroup: FormGroup;
  CategoryList: any[] = [
    { value: '', viewValue: 'Seçiniz' },
  ];
  selected = '';
  constructor(private router: Router,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private uiHelpService: UiHelperService) {
    this.getCategoryList();
  }

  ngOnInit(): void {
    this.loadForm();
  }

  back() {
    this.router.navigate(['/kategoriler'])
  }

  getCategoryList() {
    this.blockUI.start();
    this.CategoryList = [];
    this.CategoryList.push({ value: '', viewValue: 'Seçiniz' });
    this.categoryService.list().subscribe((response: any) => {
      var list = response.data;
      if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var current = list[i];
          if (current && current.id && current.name) {
            this.CategoryList.push({ value: current.id, viewValue: current.name })
          }
        }
      }
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
    })
  }

  loadForm() {
    this.formGroup = this.formBuilder.group({
      'ParentId': [this.selected],
      'Name': ['', [Validators.required]],
      'Title': [''],
      'Keyword': [''],
      'Description': [''],
      'IsOnline': [''],
    });
    setTimeout(() => {
      this.loadDefaultValues();
    }, 250);
  }

  checkNameValidator() {
    return this.formGroup.get('Name').hasError('required') ? 'Kategori Adı gereklidir...' : '';
  }

  loadDefaultValues() {
    this.formGroup.setValue({
      'Name': '',
      'ParentId': '',
      'Title': '',
      'Keyword': '',
      'Description': '',
      'IsOnline': true,
    });
    this.uiHelpService.checkInputLabels();
  }

  onSubmit(post) {
    var isValid = this.formGroup.status == "INVALID" ? false : true;
    if (!isValid) {
      this.notificationService.warn('Uyarı!', 'Lütfen kategori adını giriniz!');
    } else {
      if (!_.isNumber(post.ParentId)) {
        post.ParentId = 0;
      }
      this.blockUI.start();
      this.categoryService.save(post).subscribe((response: any) => {
        if (response && response.isSuccess == true) {
          this.notificationService.success('İşlem Başarılı', response.serviceMessage);
          this.loadDefaultValues();
          if (post.ParentId == 0) {
            this.getCategoryList();
          }
        } else {
          this.notificationService.error('İşlem Hatalı', response.serviceMessage);
        }
        this.blockUI.stop();
      }, error => {
        this.blockUI.stop();
      })
    }
  }
}
