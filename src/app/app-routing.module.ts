import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AwoofComponent } from './awoof/awoof.component';
import { GamearenaComponent } from './gamearena/gamearena.component';
import { LandingComponent } from './landing/landing.component';
import { LevelComponent } from './level/level.component';
import { LevelarenaComponent } from './levelarena/levelarena.component';
import { PadiplayComponent } from './padiplay/padiplay.component';
import { SettingsComponent } from './settings/settings.component';
import { NativetinkComponent } from './nativetink/nativetink.component';
import { CreditsComponent } from './credits/credits.component';
import { HelepComponent } from './helep/helep.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'nativetink',
    pathMatch: 'full'
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)
  },
  { path: 'nativetink', component: NativetinkComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'gamearena', component: GamearenaComponent },
  { path: 'awoof', component: AwoofComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'level', component: LevelComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'helep', component: HelepComponent },
  { path: 'levelarena/:rank/:level/:word', component: LevelarenaComponent },
  { path: 'padiplay/:gamedata', component: PadiplayComponent },
  {
    path: 'details',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)
  },
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
