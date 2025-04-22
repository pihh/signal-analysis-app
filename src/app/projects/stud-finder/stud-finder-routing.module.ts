import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudFinderPage } from './stud-finder.page';

const routes: Routes = [
  {
    path: '',
    component: StudFinderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudFinderPageRoutingModule {}
