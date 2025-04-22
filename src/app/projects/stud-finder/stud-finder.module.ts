import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudFinderPageRoutingModule } from './stud-finder-routing.module';

import { StudFinderPage } from './stud-finder.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudFinderPageRoutingModule,
    ComponentsModule
  ],
  declarations: [StudFinderPage]
})
export class StudFinderPageModule {}
