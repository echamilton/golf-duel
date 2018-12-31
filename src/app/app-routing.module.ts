import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PickTeamComponent } from './pick-team/pick-team.component';

@NgModule({
  imports: [RouterModule.forRoot([

    
        { path: 'pickteam', component: PickTeamComponent},
        { path: 'leaderboard', component: LeaderboardComponent },
        { path: '', redirectTo: '/leaderboard', pathMatch: 'full' }
 

  ],{useHash: true}),
],
  exports: [RouterModule]
})
export class AppRoutingModule { }

