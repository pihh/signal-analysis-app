import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone:false
})
export class ListComponent  implements OnInit {
  @Input('title')title:string = ""
  constructor() { }

  ngOnInit() {}

}
