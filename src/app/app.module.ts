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
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GolferPicksFormComponent } from './components/golfer-picks-form/golfer-picks-form.component';
import { environment } from '../environments/environment';
import { PickTeamComponent } from './components/pick-team/pick-team.component';
import { PopupComponent } from './components/popup/popup.component';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
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
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { EffectsModule } from '@ngrx/effects';

export function loadInitialData(golfStoreFacade: GolfStoreFacade) {
  return () => golfStoreFacade.loadTournamentData();
}

export function loadGolfGroups(golfStoreFacade: GolfStoreFacade) {
  return () => golfStoreFacade.loadGolferGroupings();
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
    AngularFireModule.initializeApp(environment.firebase, 'legbreaker-app'),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
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
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: NoCacheHeadersInterceptor,
    //   multi: true
    // }
  ],
  entryComponents: [PopupComponent, ScorecardPopComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
