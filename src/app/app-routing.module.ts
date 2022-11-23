import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PickTeamComponent } from './components/pick-team/pick-team.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { PwdResetComponent } from './components/pwd-reset/pwd-reset.component';

const applicationRoutes: Routes = [
  { path: 'pick', component: PickTeamComponent },
  { path: 'leader', component: LeaderboardComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: PwdResetComponent },
  { path: '', redirectTo: 'leader', pathMatch: 'full' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      applicationRoutes,
      { useHash: true }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
