import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/service/helper/constant.service';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {

  Title = 'Yeni Kategori';
  TitleIcon = 'addchart';
  SubmitButton = 'Kaydet';

  CategoryList: any[] = [
    { value: '', viewValue: 'Seçiniz' },
  ];
  selected = '';
  constructor(private router: Router,
    private http: HttpClient,
    private constantService: ConstantService) {
    this.getCategoryList();
  }

  ngOnInit(): void {
  }

  back() {
    this.router.navigate(['/kategoriler'])
  }

  getCategoryList() {
    this.http.get(this.constantService.apiUrl + '/category/getbolist').subscribe((response: any[]) => {
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var current = response[i];
          if (current && current.id && current.name) {
            this.CategoryList.push({ value: current.id, viewValue: current.name })
          }
        }
      }
    })
  }

}
