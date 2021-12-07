import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'top-navbar',
    templateUrl: './top-navbar.component.html',
    styleUrls: ['./top-navbar.component.scss']
})

export class TopNavbarComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}
  public toggleLeftSidebar() {
    const body = document.querySelector('body');
    body.classList.toggle('nav-sm');
    body.classList.toggle('nav-md');
  }
  public logOut() {
    this.authService.doLogout()
    .then(res =>{
      this.router.navigate(['/login']);
    }, err => console.log(err)
    )
  }
}
