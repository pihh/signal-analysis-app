import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PluginTestingPage } from './plugin-testing.page';

const routes: Routes = [
  {
    path: '',
    component: PluginTestingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginTestingPageRoutingModule {}
