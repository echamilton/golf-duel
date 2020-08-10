import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PickTeamComponent } from './components/pick-team/pick-team.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: ToolbarComponent, children: [
          { path: 'pick', component: PickTeamComponent },
          { path: 'leader', component: LeaderboardComponent },
          { path: 'signup', component: SignUpComponent },
          { path: 'login', component: LoginComponent },
          { path: '', redirectTo: 'leader', pathMatch: 'full' }
        ]
      },
    ], { useHash: true }),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

