import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PickTeamComponent } from './pick-team/pick-team.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HistoryComponent } from './history/history.component';
import { BuildGroupsComponent } from './build-groups/build-groups.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: ToolbarComponent, children: [
          { path: 'pick', component: PickTeamComponent },
          { path: 'leader', component: LeaderboardComponent },
          { path: 'signup', component: SignUpComponent },
          { path: 'login', component: LoginComponent },
          { path: 'history', component: HistoryComponent },
          { path: 'groups', component: BuildGroupsComponent },
          { path: '', redirectTo: 'leader', pathMatch: 'full' }
        ]
      },
    ], { useHash: true }),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

