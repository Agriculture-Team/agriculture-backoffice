import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogModel, ConfirmdialogComponent } from 'src/app/components/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from 'src/app/service/moduleservice/user.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import { SelectionModel } from '@angular/cdk/collections';

export interface User {
  NameSurname: string;
  Email: string;
  PhoneNumber: string;
  IsOnline: boolean;
  Id: number;
}

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.css']
})
export class ListuserComponent implements OnInit {
  Title: string = 'Kullanıcılar';
  TitleIcon: string = 'people';
  @BlockUI() blockUI: NgBlockUI;
  UserList: User[] = [];
  dataSource = new MatTableDataSource<User>(this.UserList);
  selection = new SelectionModel<User>(true, []);
  displayedColumns: string[] = ['name', 'email', 'phone', 'isOnline', 'configuration'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private userService: UserService) {
    this.getUserList();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  getUserList() {
    this.blockUI.start();
    this.userService.list().subscribe((response: any[]) => {
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var user = response[i];
          if (user) {
            var item = <User>{
              Email: user.email,
              Id: user.id,
              IsOnline: user.isOnline,
              NameSurname: user.nameSurname,
              PhoneNumber: user.phoneNumber
            }
            this.UserList.push(item);
          }
        }
        this.dataSource = new MatTableDataSource<User>(this.UserList);
      }
      this.setTableSpecs();
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
    });
  }

  addNew() {
    this.router.navigate(['/kullanicilar/ekle']);
  }

  changeConfirm(item: any): void {
    this.change(item);
  }

  deleteConfirm(item: User): void {
    const message = item.NameSurname + ' isimli kullanıcıyı silmek istediğinize emin misiniz?';
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

  change(item: User) {
    let promise = new Promise((resolve, reject) => {
      this.blockUI.start();
      this.userService.change(item).subscribe((response: any) => {
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

  delete(item: User) {
    let promise = new Promise((resolve, reject) => {
      this.blockUI.start();
      this.userService.delete(item.Id).subscribe((response: any) => {
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

  changeElement(item: User, newStatus: boolean) {
    var index = _.findIndex(this.UserList, (element: User) => {
      return element.Id == item.Id
    })
    this.UserList[index].IsOnline = newStatus;
    this.dataSource = new MatTableDataSource<User>(this.UserList);
  }

  deleteElement(item: User) {
    _.remove(this.UserList, (element: User) => {
      return element.Id == item.Id
    })
    this.dataSource = new MatTableDataSource<User>(this.UserList);
  }

  navigateToUpdate(item: User) {
    this.router.navigateByUrl('/kullanicilar/guncelle', { state: { data: JSON.stringify(item) } });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  setTableSpecs() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

}
