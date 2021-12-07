import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router, Params } from '@angular/router';
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit() {

  }
}
