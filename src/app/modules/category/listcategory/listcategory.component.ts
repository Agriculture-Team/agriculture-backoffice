import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as _ from 'lodash';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmdialogComponent, ConfirmDialogModel } from 'src/app/components/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../../service/moduleservice/category.service';
import { NotificationsService } from 'angular2-notifications';

export interface PeriodicElement {
  name: string;
  title: string;
  pageSlug: string;
  isOnline: boolean;
  id: number;
  parentId: number;
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
  CategoryList: PeriodicElement[] = [];
  displayedColumns: string[] = ['name', 'title', 'pageSlug', 'isOnline', 'configuration'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.CategoryList);
  selection = new SelectionModel<PeriodicElement>(true, []);
  loading: boolean;

  constructor(private router: Router,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private categoryService: CategoryService) {
    this.getCategoryList();
  }

  getCategoryList() {
    this.blockUI.start();
    this.categoryService.list().subscribe((response: any[]) => {
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var mainCategory = response[i];
          if (mainCategory) {
            var item = <PeriodicElement>{
              id: mainCategory.id,
              isOnline: mainCategory.isOnline,
              name: mainCategory.name,
              pageSlug: mainCategory.pageSlug,
              title: mainCategory.title,
              parentId: mainCategory.parentId
            }
            this.CategoryList.push(item);
            if (mainCategory.subCategory && mainCategory.subCategory.length > 0) {
              for (var j = 0; j < mainCategory.subCategory.length; j++) {
                var subCategory = mainCategory.subCategory[j];
                if (subCategory) {
                  var subItem = <PeriodicElement>{
                    id: subCategory.id,
                    isOnline: subCategory.isOnline,
                    name: subCategory.name,
                    pageSlug: subCategory.pageSlug,
                    title: subCategory.title,
                    parentId: subCategory.parentId
                  };
                  this.CategoryList.push(subItem);
                }
              }
            }
          }
        }
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.CategoryList);
      }
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
      console.error(error);
    });
  }

  ngOnInit(): void {
  }

  addNew() {
    this.router.navigate(['/kategoriler/ekle']);
  }

  changeConfirm(item: PeriodicElement): void {
    if (item.parentId == 0) {
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
            var subElements = _.filter(this.CategoryList, (element: PeriodicElement) => { return element.parentId == item.id });
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

  deleteConfirm(item: PeriodicElement): void {
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
            var subElements = _.filter(this.CategoryList, (element: PeriodicElement) => { return element.parentId == item.id });
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

  change(item: PeriodicElement) {
    let promise = new Promise((resolve, reject) => {
      var model = {
        Id: item.id,
        IsOnline: item.isOnline
      };
      this.blockUI.start();
      this.categoryService.change(model).subscribe((response: any) => {
        this.blockUI.stop();
        if (response && response.status == true) {
          this.notificationsService.success('İşlem Başarılı', response.message);
        } else {
          this.notificationsService.error('İşlem Hatalı', response.message);
        }
        resolve();
      }, error => {
        this.blockUI.stop();
        resolve();
      })
    });
    return promise;
  }

  delete(item: PeriodicElement) {
    let promise = new Promise((resolve, reject) => {
      var model = {
        Id: item.id
      };
      this.blockUI.start();
      this.categoryService.delete(model).subscribe((response: any) => {
        this.blockUI.stop();
        if (response && response.status == true) {
          this.notificationsService.success('İşlem Başarılı', response.message);
        } else {
          this.notificationsService.error('İşlem Hatalı', response.message);
        }
        resolve();
      }, error => {
        this.blockUI.stop();
        resolve();
      })
    });
    return promise;
  }

  changeElement(item: PeriodicElement, newStatus: boolean) {
    var index = _.findIndex(this.CategoryList, (element: PeriodicElement) => {
      return element.id == item.id
    })
    this.CategoryList[index].isOnline = newStatus;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.CategoryList);
  }

  deleteElement(item: PeriodicElement) {
    _.remove(this.CategoryList, (element: PeriodicElement) => {
      return element.id == item.id
    })
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.CategoryList);
  }

}