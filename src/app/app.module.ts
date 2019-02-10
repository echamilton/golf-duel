import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatToolbarModule, MatSelectModule, MatCardModule, MatFormFieldModule, MatListModule } from '@angular/material';
import { MatTableModule, MatIconModule, MatPaginatorModule, MatSortModule, MatSidenavModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { PickTeamComponent } from './pick-team/pick-team.component';
import { PopupComponent } from './popup/popup.component';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from './authservice';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScorecardPopComponent } from './scorecard-pop/scorecard-pop.component';
import { HistoryComponent } from './history/history.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LeaderboardComponent,
    PickTeamComponent,
    PopupComponent,
    ScorecardPopComponent,
    HistoryComponent,
    SignUpComponent,
    LoginComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
    MatSidenavModule,
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
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase, 'legbreaker-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    StoreModule.forRoot(reducers, { metaReducers }),
  ],
  providers: [AuthService],
  entryComponents: [PopupComponent, ScorecardPopComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
