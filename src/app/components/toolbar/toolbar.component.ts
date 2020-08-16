import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../../services/sports-api';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../../services/authservice';
import { IPlayer } from '../../models/models';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  golfers: Array<IPlayer> = [];
  error: boolean;
  currentRound: string;
  tournyText = '';

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private authService: AuthService,
    private popup: MatDialog
  ) {}

  ngOnInit() {
    this.sportsApi.getGolfScores().subscribe(
      (apiData) => (this.golfers = apiData.golfers),
      (err) => this.handleError()
    );
  }

  handleError() {
    this.error = true;
    this.tournyText = this.sportsApi.getEventName() + ' will commence shortly';
  }

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  }

  openPopup(golfer: IPlayer) {
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { golfer: golfer };
    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);
    dialogRef.afterClosed().subscribe();
  }

  navigate() {
    this.sportsApi.setEventId(undefined, false);
    this.router.navigate(['/leader']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }
}
