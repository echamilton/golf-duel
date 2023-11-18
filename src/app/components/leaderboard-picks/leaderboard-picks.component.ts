import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolferStatus, Messages } from './../../models/constants';
import { IPlayer } from './../../models/models';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';

@Component({
  selector: 'golf-leader-picks',
  styleUrls: ['leaderboard-picks.component.scss'],
  templateUrl: 'leaderboard-picks.component.html'
})
export class LeaderboardPicksComponent {
  @Input() golfers: IPlayer[] = [];
  config = new MatSnackBarConfig();

  constructor(
    private popup: MatDialog,
    private snackBar: MatSnackBar,
    private golfFacade: GolfStoreFacade
  ) {}

  get golferCutStatus(): string {
    return GolferStatus.cut;
  }

  get golferActiveStatus(): string {
    return GolferStatus.active;
  }

  get golferWithdrawnStatus(): string {
    return GolferStatus.withdrawn;
  }

  openPopup(golfer: IPlayer): void {
    if (!golfer.isActive) {
      this.openSnackBar();
      return;
    }
    this.golfFacade.loadGolferScorecard(golfer.golferId, golfer.round);
    this.popup.open(ScorecardPopComponent, this.setPopupConfig(golfer));
  }

  private setPopupConfig(golfer: IPlayer): MatDialogConfig {
    const popupConfig = new MatDialogConfig();
    popupConfig.autoFocus = true;
    return popupConfig;
  }

  private openSnackBar(): void {
    this.config.duration = 2500;
    this.snackBar.open(Messages.golferCut, 'Close', this.config);
  }
}
