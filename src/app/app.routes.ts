import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './components/home/home';
import { PlayerProfile } from './components/player-profile/player-profile';
import { RosterView } from './components/roster-view/roster-view';
import { RosterEdit } from './components/roster-edit/roster-edit';
import { AuthenticationComponent } from './components/auth/auth';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'players', component: PlayerProfile },
  { path: 'rosters', component: RosterView }, 
  { path: 'rosters/edit', component: RosterEdit },
  { path: 'login', component: AuthenticationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }