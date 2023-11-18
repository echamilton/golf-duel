import { Component } from '@angular/core';
import packageInfo from '../../package.json';

@Component({
  selector: 'golf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '443 Fantasy Golf';
  version = packageInfo.version;

  constructor() {}
}
