import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PluginTestingPageRoutingModule } from './plugin-testing-routing.module';

import { PluginTestingPage } from './plugin-testing.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PluginTestingPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PluginTestingPage]
})
export class PluginTestingPageModule {}
