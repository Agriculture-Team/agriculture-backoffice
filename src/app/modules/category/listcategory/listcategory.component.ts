import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as _ from 'lodash';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmdialogComponent, ConfirmDialogModel } from 'src/app/components/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../../service/moduleservice/category.service';
import { NotificationsService } from 'angular2-notifications';

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
  selector: 'app-listcategory',
  templateUrl: './listcategory.component.html',
  styleUrls: ['./listcategory.component.css']
})
export class ListcategoryComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  Title: string = 'Kategoriler';
  TitleIcon: string = 'library_books';
  CategoryList: Category[] = [];
  displayedColumns: string[] = ['name', 'title', 'pageSlug', 'isOnline', 'configuration'];
  dataSource = new MatTableDataSource<Category>(this.CategoryList);
  selection = new SelectionModel<Category>(true, []);
  loading: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private categoryService: CategoryService) {
    this.getCategoryList();
  }

  getCategoryList() {
    this.blockUI.start();
    this.categoryService.list().subscribe((response: any) => {
      var list = response.data;
      if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var mainCategory = list[i];
          if (mainCategory) {
            var item = <Category>{
              id: mainCategory.id,
              isOnline: mainCategory.isOnline,
              name: mainCategory.name,
              pageSlug: mainCategory.pageSlug,
              title: mainCategory.title,
              parentId: mainCategory.parentId,
              description: mainCategory.description,
              keyword: mainCategory.keyword
            }
            this.CategoryList.push(item);
            if (mainCategory.subCategory && mainCategory.subCategory.length > 0) {
              for (var j = 0; j < mainCategory.subCategory.length; j++) {
                var subCategory = mainCategory.subCategory[j];
                if (subCategory) {
                  var subItem = <Category>{
                    id: subCategory.id,
                    isOnline: subCategory.isOnline,
                    name: subCategory.name,
                    pageSlug: subCategory.pageSlug,
                    title: subCategory.title,
                    parentId: subCategory.parentId,
                    description: subCategory.description,
                    keyword: subCategory.keyword
                  };
                  this.CategoryList.push(subItem);
                }
              }
            }
          }
        }
        this.dataSource = new MatTableDataSource<Category>(this.CategoryList);
      }
      this.setTableSpecs();
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  addNew() {
    this.router.navigate(['/kategoriler/ekle']);
  }

  changeConfirm(item: Category): void {
    if (item.parentId == 0 && item.isOnline==false) {
      const message = 'Ana kategori statüsündeki kategori durumu değiştirildiğinde tüm alt kategoriler etkilenir. Yine de durum değiştirilsin mi?';
      const dialogData = new ConfirmDialogModel("İşlemi Onayla", message, 'Hayır', 'Evet');
      const dialogRef = this.dialog.open(ConfirmdialogComponent, {
        maxWidth: "600px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult && dialogResult == true) {
          this.change(item).then(() => {
            this.changeElement(item, item.isOnline);
            var subElements = _.filter(this.CategoryList, (element: Category) => { return element.parentId == item.id });
            if (subElements && subElements.length > 0) {
              for (var i = 0; i < subElements.length; i++) {
                this.changeElement(subElements[i], item.isOnline);
              }
            }
          })
        } else {
          item.isOnline = !item.isOnline;
        }
      });
    } else {
      this.change(item);
    }
  }

  deleteConfirm(item: Category): void {
    if (item.parentId == 0) {
      const message = 'Ana kategori statüsündeki kategori durumu silindiğinde tüm alt kategoriler ve bağlı ilanlar da silinir. Yine de silmek istediğinize emin misiniz?';
      const dialogData = new ConfirmDialogModel("İşlemi Onayla", message, 'Hayır', 'Evet');
      const dialogRef = this.dialog.open(ConfirmdialogComponent, {
        maxWidth: "600px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult && dialogResult == true) {
          this.delete(item).then(() => {
            this.deleteElement(item);
            var subElements = _.filter(this.CategoryList, (element: Category) => { return element.parentId == item.id });
            if (subElements && subElements.length > 0) {
              for (var i = 0; i < subElements.length; i++) {
                this.deleteElement(subElements[i]);
              }
            }
          });
        }
      });
    } else {
      const message = item.name + ' isimli kategoriyi silmek istediğinize emin misiniz?';
      const dialogData = new ConfirmDialogModel("İşlemi Onayla", message, 'Hayır', 'Evet');
      const dialogRef = this.dialog.open(ConfirmdialogComponent, {
        maxWidth: "600px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult && dialogResult == true) {
          this.delete(item).then(() => {
            this.deleteElement(item);
          });
        }
      });
    }
  }

  change(item: Category) {
    let promise = new Promise((resolve, reject) => {
      this.blockUI.start();
      this.categoryService.change(item).subscribe((response: any) => {
        this.blockUI.stop();
        if (response && response.isSuccess == true) {
          this.notificationsService.success('İşlem Başarılı', response.serviceMessage);
        } else {
          this.notificationsService.error('İşlem Hatalı', response.serviceMessage);
        }
        resolve();
      }, error => {
        this.blockUI.stop();
        resolve();
      })
    });
    return promise;
  }

  delete(item: Category) {
    let promise = new Promise((resolve, reject) => {
      this.blockUI.start();
      this.categoryService.delete(item.id).subscribe((response: any) => {
        this.blockUI.stop();
        if (response && response.isSuccess == true) {
          this.notificationsService.success('İşlem Başarılı', response.serviceMessage);
        } else {
          this.notificationsService.error('İşlem Hatalı', response.serviceMessage);
        }
        resolve();
      }, error => {
        this.blockUI.stop();
        resolve();
      })
    });
    return promise;
  }

  changeElement(item: Category, newStatus: boolean) {
    if(newStatus==false){
      var index = _.findIndex(this.CategoryList, (element: Category) => {
        return element.id == item.id
      })
      this.CategoryList[index].isOnline = newStatus;
      this.dataSource = new MatTableDataSource<Category>(this.CategoryList);
      this.setTableSpecs();
    }
  }

  deleteElement(item: Category) {
    _.remove(this.CategoryList, (element: Category) => {
      return element.id == item.id
    })
    this.dataSource = new MatTableDataSource<Category>(this.CategoryList);
    this.setTableSpecs();
  }

  navigateToUpdate(item: Category) {
    this.router.navigateByUrl('/kategoriler/guncelle', { state: { data: JSON.stringify(item) } });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  setTableSpecs(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}