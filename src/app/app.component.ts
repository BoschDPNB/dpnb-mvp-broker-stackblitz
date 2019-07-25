import { Component } from '@angular/core';
import { imagesUrl } from './imagesUrl';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  dpnb= imagesUrl["dpnb"];
}
