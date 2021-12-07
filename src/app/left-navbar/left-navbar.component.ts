import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'left-navbar',
    templateUrl: './left-navbar.component.html',
    styleUrls: ['./left-navbar.component.scss']
})
export class LeftNavbarComponent implements OnInit {
  menuList = [
    {
      name: 'Main Dashboard',
      link: '/home',
      icon: 'home'
    }
  ];
  name: string;
  selected: any;

  constructor(public router: Router) {
       router.events.subscribe(e => {
         if ((e instanceof NavigationStart)) {
            this.activateRoute();
         }
    });
  }
  public ngOnInit() {
    this.activateRoute();
  }

  public select(item) {
     this.selected = (this.selected === item ? null : item);
  }

  public isActive(item) {
    return this.selected === item;
  }
  public activateRoute() {
      this.menuList.forEach((item) => {
        if (item.link && this.router.url === item.link) {
            this.select(item.name);
        }
      });
  }
}
