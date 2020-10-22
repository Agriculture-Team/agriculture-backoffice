import { Component, OnInit, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DashboardService } from 'src/app/service/moduleservice/dashboard.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import * as moment from 'moment';

interface Log {
  Action: String;
  AddDate: string;
  Browser: string;
  Controller: string;
  LogLevel: string;
  Request: string;
  Response: string;
  User: string;
  UserPlatform: String;
}
interface User {
  NameSurname: string;
  Email: string;
  PhoneNumber: string;
  IsOnline: boolean;
  Id: number;
  CreatedDate: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isUserDataLoading: boolean;
  UserList: User[] = [];
  LogList: Log[] = [];
  logSource = new MatTableDataSource<Log>(this.LogList);
  userSource = new MatTableDataSource<User>(this.UserList);
  selection = new SelectionModel<User>(true, []);
  displayedUserColumns: string[] = ['name', 'email', 'phone', 'createdDate', 'configuration'];
  displayedLogColumns: string[] = ['date', 'controller', 'action', 'request', 'response', 'loglevel'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private notification: NotificationsService,
    private dashBoardService: DashboardService,
    private router: Router) {
    this.getLog();
    this.getUser();
  }

  ngOnInit(): void {
  }

  getLog() {
    this.dashBoardService.getLogList().subscribe((response: any[]) => {
      this.LogList = [];
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var current = response[i];
          if (current) {
            var item = <Log>{
              Action: current.action,
              AddDate: current.addDate,
              Controller: current.controller,
              LogLevel: current.logLevel,
              Request: current.request,
              Response: current.response
            }
            this.LogList.push(item);
          }
        }
      }
      this.logSource = new MatTableDataSource<Log>(this.LogList);
      setTimeout(()=>{
        this.setTableSpecs();
      },500);
    })
  }

  getUser() {
    this.isUserDataLoading = true;
    this.dashBoardService.getUserList().subscribe((response: any[]) => {
      this.UserList = [];
      this.isUserDataLoading = false;
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var current = response[i];
          if (current) {
            var item = <User>{
              Email: current.email,
              Id: current.id,
              IsOnline: current.isOnline,
              NameSurname: current.nameSurname,
              PhoneNumber: current.phoneNumber,
              CreatedDate: current.createdDate
            }
            this.UserList.push(item);
          }
        }
      }
      this.userSource = new MatTableDataSource<User>(this.UserList);
    })
  }

  navigateToUpdate(item: User) {
    this.router.navigateByUrl('/kullanicilar/guncelle', { state: { data: JSON.stringify(item) } });
  }

  setCreateDate(date: string) {
    if (date && date.indexOf('T') > 0) {
      var dateTime = date.split('T');
      if (dateTime && dateTime.length > 0) {
        var dateText = dateTime[0];
        return moment(dateText).format('DD.MM.YYYY');
      }
    }
  }

  setRequestResponseText(text: string) {
    if (text && text.length > 10) {
      return text.substr(0,9);
    }
  }

  setTableSpecs(){
    this.logSource.paginator = this.paginator;
    this.userSource.paginator = this.paginator;
  }

}
