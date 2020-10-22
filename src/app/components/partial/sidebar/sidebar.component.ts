import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/service/helper/constant.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authservice/authentication.service';
import { ConfirmDialogModel, ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UiHelperService } from 'src/app/service/helper/uihelper.service';
import { DashboardService } from 'src/app/service/moduleservice/dashboard.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean;
  MenuList: any[] = [];
  isMenuLoading: boolean;
  showMobilOption: boolean;
  constructor(private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private uiHelperService: UiHelperService,
    private dashBoardService: DashboardService) {
    this.isAuthenticated = authService.isAuthenticated;
    this.showMobilOptions(screen.width);
    this.getMenuList();

    router.events.subscribe((val: any) => {
      const value = val instanceof NavigationEnd;
      if (value == true) {
        this.uiHelperService.closeSideBar();
        this.setMenuClass();
      }
    });
  }

  ngOnInit(): void {
  }

  getMenuList() {
    let request = {
      "SecureKey": this.authService.getLocalStorage('SecureKey')
    }
    this.isMenuLoading = true;
    this.dashBoardService.getMenuList(request).subscribe((response: any[]) => {
      this.isMenuLoading = false;
      if (response && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          var menu = {
            isActive: false,
            icon: response[i].icon,
            title: response[i].title,
            link: response[i].link,
            activeMenu: response[i].activeMenu
          }
          this.MenuList.push(menu);
        }
        this.setMenuClass();
      }
    })
  }

  rotate(item: any) {
    if (item && item.link) {
      this.router.navigate([item.link]);
    } else {
      this.router.navigate(['/']);
    }
  }

  logOut() {
    this.authService.logOut();
  }

  setMenuClass() {
    for (let i = 0; i < this.MenuList.length; i++) {
      const currentMenu = this.MenuList[i] as any;
      if (currentMenu.link == '' && this.router.url == '/') {
        currentMenu.isActive = true;
      } else {
        if (currentMenu.subMenu && currentMenu.subMenu.length > 0) {
          for (let j = 0; j < currentMenu.subMenu.length; j++) {
            const currentSubMenu = currentMenu.subMenu[j];
            if (currentSubMenu.link != '' && this.router.url.indexOf(currentSubMenu.activeMenu) > -1) {
              currentSubMenu.isActive = true;
              currentMenu.isActive = true;
            } else {
              currentSubMenu.isActive = false;
              currentMenu.isActive = false;
            }
          }
        } else {
          if (currentMenu.link != '' && this.router.url.indexOf(currentMenu.activeMenu) > -1) {
            currentMenu.isActive = true;
          } else {
            currentMenu.isActive = false;
          }
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.showMobilOptions(event.target.innerWidth);
  }

  showMobilOptions(size: number) {
    if (size < 960) {
      this.showMobilOption = true;
    } else {
      this.showMobilOption = false;
    }
  }

  confirmLogout(): void {
    this.uiHelperService.closeSideBar();
    const message = 'Çıkış yapmak istediğinize emin misiniz?';
    const dialogData = new ConfirmDialogModel("İşlemi Onayla", message, 'Hayır', 'Evet', true);
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      maxWidth: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult == true) {
        this.logOut();
      }
    });
  }

}
