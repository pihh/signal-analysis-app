import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


interface iListItemOption{
  label:string;
  color?:string;

}
@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  standalone:false
})
export class ListItemComponent  implements OnInit {
  @Input('options')options:iListItemOption[] =[]
  @Output() onSelectOption = new EventEmitter<iListItemOption>();
  @Output() onClickItem = new EventEmitter();

  selectOption(option:iListItemOption) {
    this.onSelectOption.emit(option);
  }
  clickItem() {
    debugger
    this.onClickItem.emit();
  }
  constructor() { }

  ngOnInit() {}

}
