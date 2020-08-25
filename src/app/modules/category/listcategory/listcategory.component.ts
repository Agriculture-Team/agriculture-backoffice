import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/service/helper/constant.service';

export interface PeriodicElement {
  name: string;
  title: string;
  pageSlug: string;
  isOnline: string;
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
    private http: HttpClient,
    private constantService: ConstantService) {
    this.getCategoryList();
  }

  getCategoryList() {
    this.blockUI.start();
    this.http.get(this.constantService.apiUrl + '/category/getbolist').subscribe((response: any[]) => {
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
    })
  }

  ngOnInit(): void {
  }

  addNew() {
    this.router.navigate(['/kategoriler/ekle']);
  }

  changeStatus(element) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    console.log(element);
  }
}
