import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 constructor() {
   firebase.initializeApp(environment.firestore);
 }
}
