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
import { MatTableModule, MatIconModule, MatSortModule, MatButtonModule, MatInputModule } from '@angular/material';
import { MatDividerModule, MatMenuModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PickTeamComponent } from './pick-team/pick-team.component';
import { PopupComponent } from './popup/popup.component';
import { AuthService } from './authservice';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ScorecardPopComponent } from './scorecard-pop/scorecard-pop.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from './loader/loader.component';
import { HistoryComponent } from './history/history.component';
import { BuildGroupsComponent } from './build-groups/build-groups.component';

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
    HistoryComponent,
    BuildGroupsComponent
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
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase, 'legbreaker-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [AuthService],
  entryComponents: [PopupComponent, ScorecardPopComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
