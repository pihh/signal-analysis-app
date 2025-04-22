import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-layout-ml',
  templateUrl: './layout-ml.component.html',
  styleUrls: ['./layout-ml.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone:false
})
export class LayoutMlComponent  implements OnInit {
  @Input('title')title:string = ""
  constructor() { }

  ngOnInit() {}

}
