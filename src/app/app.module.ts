import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GolferPicksFormComponent } from './components/golfer-picks-form/golfer-picks-form.component';
import { environment } from '../environments/environment';
import { PickTeamComponent } from './components/pick-team/pick-team.component';
import { PopupComponent } from './components/popup/popup.component';
import { AuthService } from './services/auth.service';
import { ScorecardPopComponent } from './components/scorecard-pop/scorecard-pop.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { LeaderboardPicksComponent } from './components/leaderboard-picks/leaderboard-picks.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from './components/loader/loader.component';
import { TournamentLeadersComponent } from './components/tournament-leaders/tournament-leaders.component';
import { PwdResetComponent } from './components/pwd-reset/pwd-reset.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { golfReducer } from './store/golf.reducer';
import { UserEffects } from './store/golf.effects';
import { GolfStoreFacade } from './store/golf.store.facade';
import { NoCacheHeadersInterceptor } from './services/http-cache';
import { initializeApp } from 'firebase/app';

import { EffectsModule } from '@ngrx/effects';

initializeApp(environment.firebase);

export function loadInitialData(golfStoreFacade: GolfStoreFacade) {
  return () => golfStoreFacade.loadTournamentData();
}

export function loadGolfGroups(golfStoreFacade: GolfStoreFacade) {
  return () => golfStoreFacade.loadGolferGroupings();
}

export function loadUserPicks(golfStoreFacade: GolfStoreFacade) {
  return () => golfStoreFacade.loadUserPicks();
}

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LeaderboardComponent,
    PickTeamComponent,
    PopupComponent,
    ScorecardPopComponent,
    SignUpComponent,
    LoginComponent,
    LoaderComponent,
    TournamentLeadersComponent,
    LeaderboardPicksComponent,
    GolferPicksFormComponent,
    PwdResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    RouterModule,
    MatIconModule,
    LayoutModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    StoreModule.forRoot({ golfData: golfReducer }),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 50
    })
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: loadInitialData,
      deps: [GolfStoreFacade]
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: loadGolfGroups,
      deps: [GolfStoreFacade]
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: loadUserPicks,
      deps: [GolfStoreFacade]
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: NoCacheHeadersInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
