import { Component } from '@angular/core';
import { AppTitle } from './models/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = AppTitle;

  constructor() {
  }
}
