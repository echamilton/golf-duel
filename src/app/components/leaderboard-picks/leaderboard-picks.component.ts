import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolferStatus, Messages } from './../../models/constants';
import { IPlayer } from './../../models/models';

@Component({
  selector: 'app-leader-picks',
  styleUrls: ['leaderboard-picks.component.scss'],
  templateUrl: 'leaderboard-picks.component.html'
})
export class LeaderboardPicksComponent implements OnInit {
  @Input() golfers: IPlayer[];
  config = new MatSnackBarConfig();
  constructor(private popup: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  get golferCutStatus(): string {
    return GolferStatus.cut;
  }

  openPopup(golfer: IPlayer): void {
    if (!golfer.isActive) {
      this.openSnackBar();
      return;
    }

    const popupConfig = new MatDialogConfig();
    popupConfig.autoFocus = true;
    popupConfig.data = {
      golferId: golfer.golferId,
      round: golfer.round,
      img: golfer.imageLink
    };
    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);
    dialogRef.afterClosed().subscribe();
  }

  private openSnackBar(): void {
    this.config.duration = 2500;
    this.snackBar.open(Messages.golferCut, 'Close', this.config);
  }
}
