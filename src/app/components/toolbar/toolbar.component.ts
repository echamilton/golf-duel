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
  golfers: IPlayer[] = [];
  error: boolean;
  tournyText = '';

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private authService: AuthService,
    private popup: MatDialog
  ) {}

  ngOnInit(): void {
    this.sportsApi.getGolfScores().subscribe(
      (apiData) => (this.golfers = apiData.golfers),
      (err) => this.handleError()
    );
  }

  handleError(): void {
    this.error = true;
    this.tournyText = this.sportsApi.getEventName() + ' will commence shortly';
  }

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  }

  openPopup(golfer: IPlayer): void {
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { golfer: golfer };
    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);
    dialogRef.afterClosed().subscribe();
  }

  navigate(): void {
    this.router.navigate(['/leader']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }
}
