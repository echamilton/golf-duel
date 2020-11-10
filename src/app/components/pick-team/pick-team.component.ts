import { Component, OnInit } from '@angular/core';
import { IGolferGroupingsUI, IUserGolfPicks } from '../../models/models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SportsApiService } from '../../services/sports-api.service';
import { AuthService } from '../../services/auth.service';
import { Messages } from './../../models/constants';
import { PopupComponent } from './../popup/popup.component';
import { GolfDataStoreService } from './../../services/golf-data-store.service';
import { Observable } from 'rxjs';
import { GolfStoreFacade } from './../../store/golf.store.facade';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})
export class PickTeamComponent implements OnInit {
  picks: IUserGolfPicks;
  answer: string;
  popupText: string;
  isLoading: boolean;
  config = new MatSnackBarConfig();
  golferGroupings$: Observable<IGolferGroupingsUI>;
  disableName = false;

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private popup: MatDialog,
    private authService: AuthService,
    private golfDataService: GolfDataStoreService,
    private golfFacade: GolfStoreFacade
  ) {
    this.initialize();
  }

  ngOnInit(): void {
    this.loadUserPicks();
    this.getGolferGroupings();
  }

  openPopup(action: string): void {
    let popupText: string;
    if (action === 'update') {
      if (
        this.picks.golfer1 == '' ||
        this.picks.golfer2 == '' ||
        this.picks.golfer3 == '' ||
        this.picks.golfer4 == '' ||
        this.picks.golfer5 == '' ||
        this.picks.golfer6 == '' ||
        this.picks.golfer7 == '' ||
        this.picks.golfer8 == '' ||
        this.picks.team == ''
      ) {
        this.openSnackBar(Messages.teamError);
        return;
      }
      popupText = Messages.submitTeam;
    } else {
      popupText = Messages.deleteTeam;
    }

    this.launchConfirmModal(popupText, action);
  }

  processData(answer: string, action: string): void {
    this.isLoading = true;
    if (answer === 'Yes') {
      this.sportsApi.getGolfScores().subscribe((apiData) => {
        this.validateSubmit(action, apiData.status);
      });
    } else {
      this.isLoading = false;
    }
  }

  private launchConfirmModal(text: string, action: string): void {
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { answer: this.answer, text: text };

    const dialogRef = this.popup.open(PopupComponent, popupConfig);

    dialogRef
      .afterClosed()
      .subscribe((answer) => this.processData(answer, action));
  }

  validateSubmit(action: string, status: string): void {
    if (this.sportsApi.isTournamentActive(status)) {
      this.openSnackBar(Messages.picksActiveTourny);
      this.isLoading = false;
      return;
    }

    if (action === 'update') {
      this.picks.eventId = this.sportsApi.getActiveEventId();
      this.picks.email = this.authService.getCurrentUser();
      this.golfDataService.updateGolferPicks(this.picks);
      this.openSnackBar(Messages.teamSuccess);
    } else {
      this.golfDataService.deleteGolferPicks(this.picks);
      this.openSnackBar(Messages.deleteSuccess);
    }
    this.isLoading = false;
    this.router.navigate(['/leader']);
  }

  openSnackBar(Text: string): void {
    this.config.duration = 2500;
    this.snackBar.open(Text, 'Close', this.config);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getActive(): boolean {
    return this.sportsApi.isTournamentActive();
  }

  getGolferGroupings(): void {
    this.isLoading = true;
    this.golferGroupings$ = this.golfFacade.getGolferGroups();
  }

  private initialize(): void {
    this.picks = {
      golfer1: '',
      golfer2: '',
      golfer3: '',
      golfer4: '',
      golfer5: '',
      golfer6: '',
      golfer7: '',
      golfer8: '',
      eventId: '',
      team: '',
      email: ''
    };
  }

  private loadUserPicks(): void {
    this.golfDataService.loadUserPicks().subscribe((picks) => {
      if (picks) {
        this.picks = picks;
        this.disableName = true;
      }
      this.isLoading = false;
    });
  }
}
