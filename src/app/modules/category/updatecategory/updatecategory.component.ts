import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/service/moduleservice/category.service';
import { NotificationsService } from 'angular2-notifications';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { UiHelperService } from 'src/app/service/helper/uihelper.service';
import { ConstantService } from 'src/app/service/helper/constant.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';


export interface Category {
  name: string;
  title: string;
  pageSlug: string;
  isOnline: boolean;
  id: number;
  parentId: number;
  description: string;
  keyword: string;
}
@Component({
  selector: 'app-updatecategory',
  templateUrl: './updatecategory.component.html',
  styleUrls: ['./updatecategory.component.css']
})
export class UpdatecategoryComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  Title = 'Kategori Güncelle';
  TitleIcon = 'addchart';
  SubmitButton = 'Güncelle';
  formGroup: FormGroup;
  CategoryList: any[] = [
    { value: '', viewValue: 'Seçiniz' },
  ];
  selected = '';
  constructor(private router: Router,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private uiHelpService: UiHelperService,
    public activatedRoute: ActivatedRoute,
    private constantService: ConstantService) {
    this.loadForm();
    this.getCategoryList();
  }

  state$: Observable<object>;

  ngOnInit() {

  }

  back() {
    this.router.navigate(['/kategoriler'])
  }

  getCategoryList() {
    this.blockUI.start();
    this.CategoryList = [];
    this.CategoryList.push({ value: '', viewValue: 'Seçiniz' });
    this.categoryService.list().subscribe((response: any[]) => {
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var current = response[i];
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
      'id': [''],
      'ParentId': [this.selected],
      'Name': ['', [Validators.required]],
      'Title': [''],
      'Keyword': [''],
      'Description': [''],
      'IsOnline': [''],
    });
    setTimeout(() => {
      this.loadDefaultValues();
    }, 500);
  }

  checkNameValidator() {
    return this.formGroup.get('Name').hasError('required') ? 'Kategori Adı gereklidir...' : '';
  }

  loadDefaultValues() {
    this.blockUI.start();
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe((data: any) => {
      if (data && data.data) {
        var item = JSON.parse(data.data) as Category;
        if (item && !_.isUndefined(item)) {
          this.formGroup.setValue({
            'Name': item.name,
            'ParentId': item.parentId,
            'Title': item.title,
            'Keyword': item.keyword,
            'Description': item.description,
            'IsOnline': item.isOnline,
            'id': item.id
          });
          this.uiHelpService.checkInputLabels();
          this.blockUI.stop();
        }
      }
      else {
        this.blockUI.stop();
        this.notificationService.warn('Dikkat', 'Kategori detayları getirilirken hata meydana geldi. Lütfen tekrar deneyin.');
        setTimeout(() => {
          this.back();
        }, 3500);
      }
    });

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
      this.categoryService.update(post).subscribe((response: any) => {
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

}
