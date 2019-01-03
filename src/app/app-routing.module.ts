import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PickTeamComponent } from './pick-team/pick-team.component';
import { ScorecardComponent } from './scorecard/scorecard.component';

@NgModule({
  imports: [
  RouterModule.forRoot([
    {
          path: '', component: ToolbarComponent, children: [
        { path: 'pick', component: PickTeamComponent },
        { path: 'leader', component: LeaderboardComponent },
        { path: 'score', component: ScorecardComponent },
        { path: '', redirectTo: 'leader', pathMatch: 'full' }
      ]
    },
  ], {useHash: true}),


],
  exports: [RouterModule]
})
export class AppRoutingModule { }

