import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone:false
})
export class LayoutComponent  implements OnInit {
  @Input('title')title:string = ""
  constructor() { }

  ngOnInit() {}

}
