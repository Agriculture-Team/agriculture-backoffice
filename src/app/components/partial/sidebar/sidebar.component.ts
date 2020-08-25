import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/service/helper/constant.service';
import { Router, NavigationEnd } from '@angular/router';
import * as $ from 'jquery';
import { AuthenticationService } from 'src/app/service/authservice/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean;
  MenuList: any[]=[];
  isMenuLoading:boolean;
  constructor(private authService: AuthenticationService,
    private http: HttpClient,
    private constantService: ConstantService,
    private router: Router) {
    this.isAuthenticated = authService.isAuthenticated;
    this.getMenuList();

    router.events.subscribe((val: any) => {
      const value = val instanceof NavigationEnd;
      if (value == true) {
        let hasHtmlNavOpen = $('#bigboss').hasClass('nav-open');
        if(hasHtmlNavOpen){
          $('.close-layer').click();
        }
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
    this.http.post(this.constantService.apiUrl + '/staticdata/getmenulist', request).subscribe((response: any[]) => {
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

}
