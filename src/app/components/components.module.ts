import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { LayoutMlComponent } from './layout-ml/layout-ml.component';
import { LayoutComponent } from './layout/layout.component';
import { ChartsComponent } from './charts/charts.component';

const components = [
  ListComponent,
  ListItemComponent,
  LayoutMlComponent,
  LayoutComponent,
  ChartsComponent
];
@NgModule({
  declarations: components,
  imports: [CommonModule, FormsModule, IonicModule],
  exports: components,
})
export class ComponentsModule {}
