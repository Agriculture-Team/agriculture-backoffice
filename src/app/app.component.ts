import { Component } from '@angular/core';
import * as $ from 'jquery';
import { AuthenticationService } from './service/authservice/authentication.service';
import { slideInAnimation } from './route-animation';
import {
  Router, Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent {
  public notification = {
    timeOut: 4000,
    position: ["top", "right"],
    lastOnBottom: true
  }
  isAuthenticated: boolean;
  isPageLoading: boolean;
  constructor(private authService: AuthenticationService,
    private router: Router) {
    this.isAuthenticated = authService.isAuthenticated;
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isPageLoading = true;
          break;
        }
        case event instanceof NavigationEnd: {
          setTimeout(() => {
            this.isPageLoading = false;
          }, 1000);
          break;
        }
        case event instanceof NavigationCancel: {
          setTimeout(() => {
            this.isPageLoading = false;
          }, 1000);
          break;
        }
        case event instanceof NavigationError: {
          setTimeout(() => {
            this.isPageLoading = false;
          }, 1000);
          break;
        }
        default: {
          break;
        }
      }
    });
    if (this.isAuthenticated) {
      this.setupBarComponents();
    }
  }

  setupBarComponents() {
    $(document).ready(function () {
      $().ready(function () {
        let sidebar = $('.sidebar');
        let sidebar_img_container = sidebar.find('.sidebar-background');
        let full_page = $('.full-page');
        let sidebar_responsive = $('body > .navbar-collapse');
        let window_width = $(window).width();
        let fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();
        if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
          if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
            $('.fixed-plugin .dropdown').addClass('open');
          }
        }
        $('.fixed-plugin a').click(function (event) {
          if ($(this).hasClass('switch-trigger')) {
            if (event.stopPropagation) {
              event.stopPropagation();
            } else if (window.event) {
              window.event.cancelBubble = true;
            }
          }
        });
        $('.fixed-plugin .active-color span').click(function () {
          let full_page_background = $('.full-page-background');
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
          var new_color = $(this).data('color');
          if (sidebar.length != 0) {
            sidebar.attr('data-color', new_color);
          }
          if (full_page.length != 0) {
            full_page.attr('filter-color', new_color);
          }
          if (sidebar_responsive.length != 0) {
            sidebar_responsive.attr('data-color', new_color);
          }
        });
        $('.fixed-plugin .background-color .badge').click(function () {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
          var new_color = $(this).data('background-color');
          if (sidebar.length != 0) {
            sidebar.attr('data-background-color', new_color);
          }
        });
        $('.fixed-plugin .img-holder').click(function () {
          let full_page_background = $('.full-page-background');
          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');
          var new_image = $(this).find("img").attr('src');
          if (sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            sidebar_img_container.fadeOut('fast', function () {
              sidebar_img_container.css('background-image', 'url("' + new_image + '")');
              sidebar_img_container.fadeIn('fast');
            });
          }
          if (full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');
            full_page_background.fadeOut('fast', function () {
              full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
              full_page_background.fadeIn('fast');
            });
          }
          if ($('.switch-sidebar-image input:checked').length == 0) {
            var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');
            sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
          }
          if (sidebar_responsive.length != 0) {
            sidebar_responsive.css('background-image', 'url("' + new_image + '")');
          }
        });
        $('.switch-sidebar-image input').change(function () {
          let full_page_background = $('.full-page-background');
          let input = $(this);
          if (input.is(':checked')) {
            if (sidebar_img_container.length != 0) {
              sidebar_img_container.fadeIn('fast');
              sidebar.attr('data-image', '#');
            }
            if (full_page_background.length != 0) {
              full_page_background.fadeIn('fast');
              full_page.attr('data-image', '#');
            }
            let background_image = true;
          } else {
            if (sidebar_img_container.length != 0) {
              sidebar.removeAttr('data-image');
              sidebar_img_container.fadeOut('fast');
            }
            if (full_page_background.length != 0) {
              full_page.removeAttr('data-image', '#');
              full_page_background.fadeOut('fast');
            }
            let background_image = false;
          }
        });
        $('.switch-sidebar-mini input').change(function () {
          let body = $('body');
          let input = $(this);
          $('body').removeClass('sidebar-mini');
          $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
          var simulateWindowResize = setInterval(function () {
            window.dispatchEvent(new Event('resize'));
          }, 180);
          setTimeout(function () {
            clearInterval(simulateWindowResize);
          }, 1000);
        });
      });
    });
  }

}
