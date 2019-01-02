import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PickTeamComponent } from './pick-team/pick-team.component';

@NgModule({
  imports: [
  RouterModule.forRoot([
    {
          path: '', component: ToolbarComponent, children: [
        // { path: 'fanduel', component: FanduelComponent },
        { path: 'pick', component: PickTeamComponent },
        // { path: 'h', component: HomeComponent, canActivate: [AuthGuard] },
        // { path: 'user', component: UserCompComponent },
        { path: 'leader', component: LeaderboardComponent },
        // { path: 'updateDuel', component: UpdateDuelComponent },
        // { path: 'signup', component: SignUpComponent },
        // { path: 'scorec', component: ScorecardComponent },
        { path: '', redirectTo: 'leader', pathMatch: 'full' }
      ]
    },
  ], {useHash: true}),

    
        // { path: 'pickteam', component: PickTeamComponent},
        // { path: 'leaderboard', component: LeaderboardComponent },
        // { path: '', redirectTo: '/leaderboard', pathMatch: 'full' }
 

  
],
  exports: [RouterModule]
})
export class AppRoutingModule { }

