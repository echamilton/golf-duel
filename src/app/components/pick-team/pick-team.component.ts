import { Component, OnInit } from '@angular/core';
import { IUserGolfPicks, IGolfersGroupPick } from '../../models/models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SportsApiService } from '../../services/sports-api.service';
import { AuthService } from '../../services/auth.service';
import { Messages } from './../../models/constants';
import { PopupComponent } from './../popup/popup.component';
import { GolfDataStoreService } from 'src/app/services/golf-data-store.service';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})
export class PickTeamComponent implements OnInit {
  picks: IUserGolfPicks;
  answer: string;
  popupText: string;
  disableName: boolean;
  golferGrpA: Array<IGolfersGroupPick> = [];
  golferGrpB: Array<IGolfersGroupPick> = [];
  golferGrpC: Array<IGolfersGroupPick> = [];
  isLoading: boolean;
  config = new MatSnackBarConfig();

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private popup: MatDialog,
    private authService: AuthService,
    private golfDataService: GolfDataStoreService
  ) {
    this.initialize();
  }

  ngOnInit(): void {
    this.getGolferGroupings();
    this.loadUserPicks();
  }

  openPopup(action: string): void {
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
      this.popupText = Messages.submitTeam;
    } else {
      this.popupText = Messages.deleteTeam;
    }
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { answer: this.answer, text: this.popupText };

    const dialogRef = this.popup.open(PopupComponent, popupConfig);

    dialogRef
      .afterClosed()
      .subscribe((answer) => this.processData(answer, action));
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

  checkGolferSelected(golferDropDown, currentGolfer): boolean {
    if (golferDropDown === currentGolfer) {
      return false;
    }

    const golferArray = [];
    for (let key in this.picks) {
      if (this.picks.hasOwnProperty(key)) {
        golferArray.push(this.picks[key]);
      }
    }
    return golferArray.includes(golferDropDown);
  }

  getGolferGroupings() {
    this.isLoading = true;
    this.disableName = false;
    this.golfDataService.getGolferGroupings().subscribe((groups) => {
      groups[0].forEach((groupRecord) => {
        const group: IGolfersGroupPick = {
          id: groupRecord.golferId,
          name: groupRecord.name
        };

        if (groupRecord.group == 'A') {
          this.golferGrpA.push(group);
        } else if (groupRecord.group == 'B') {
          this.golferGrpB.push(group);
        } else {
          this.golferGrpC.push(group);
        }
      });
    });
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
        this.disableName = true;
        this.picks = picks;
      }
      this.isLoading = false;
    });
  }
}
