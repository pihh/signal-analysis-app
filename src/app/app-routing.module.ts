import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./projects/plugin-testing/plugin-testing.module').then( m => m.PluginTestingPageModule)
  },
  {
    path: 'plugin-testing',
    loadChildren: () => import('./projects/plugin-testing/plugin-testing.module').then( m => m.PluginTestingPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'stud-finder',
    loadChildren: () => import('./projects/stud-finder/stud-finder.module').then( m => m.StudFinderPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
