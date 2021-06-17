import { Component } from '@angular/core';
import { AppTitle } from './models/constants';
import packageInfo from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = AppTitle;
  version = packageInfo.version;

  constructor() {}
}
