import { Component, OnInit } from '@angular/core';
import { IUserGolfPicks, IGolfers } from '../models';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SportsApiService } from '../sports-api';
import { AuthService } from '../authservice';
import { Messages } from '../constants';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})

export class PickTeamComponent implements OnInit {
  subscription: Subscription;
  picks: IUserGolfPicks;
  answer: string;
  popupText: string;
  existingPicks: boolean;
  golferGrpA: Array<IGolfers> = [];
  golferGrpB: Array<IGolfers> = [];
  golferGrpC: Array<IGolfers> = [];
  isLoading: boolean;
  config = new MatSnackBarConfig();

  constructor(private sportsApi: SportsApiService, private router: Router, private snackBar: MatSnackBar,
    private popup: MatDialog, private authService: AuthService) {
    this.initialize();
  }

  ngOnInit() {
    this.isLoading = true;
    this.picks.eventId = this.sportsApi.getActiveEventId();
    this.getGolferGroupings();
    this.loadUserPicks();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openPopup(action: string) {
    if (action == 'update') {
      if (this.picks.golfer1 == '' || this.picks.golfer2 == '' ||
        this.picks.golfer3 == '' || this.picks.golfer4 == '' ||
        this.picks.golfer5 == '' || this.picks.golfer6 == '' ||
        this.picks.golfer7 == '' || this.picks.golfer8 == '' ||
        this.picks.team == '') {
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

    dialogRef.afterClosed().subscribe(
      answer => this.processData(answer, action)
    );
  }

  processData(answer: string, action: string) {
    this.isLoading = true;
    if (answer === 'Yes') {
      this.sportsApi.getGolfScores().subscribe(
        apiData => { this.validateSubmit(action, false, apiData) },
        err => { this.validateSubmit(action, true, []) });
    } else {
      this.isLoading = false;
    }
  }

  validateSubmit(action: string, apiNotReady: boolean, apiData: any) {
    // *Check status of API before proceeding
    let active = false;

    if (!apiNotReady) {
      active = this.sportsApi.isTournamentActive(apiData.leaderboard.round_state);
    }

    if (active) {
      this.openSnackBar(Messages.picksActiveTourny);
      this.isLoading = false;
      return;
    }

    if (action == 'update') {
      this.picks.email = this.authService.getCurrentUser();
      this.sportsApi.updateGolferPicks(this.picks);
      this.openSnackBar(Messages.teamSuccess);
    } else {
      this.sportsApi.deleteGolferPicks(this.picks);
      this.openSnackBar(Messages.deleteSuccess);
    }
    this.isLoading = false;
    this.router.navigate(['/leader']);
  }

  openSnackBar(Text: string) {
    this.config.duration = 2500;
    this.snackBar.open(Text, 'Close', this.config);
  }

  checkData(golferID, currentGolfer) {
    if (golferID === currentGolfer) {
      return true;
    }
  }

  isLoggedIn() {
    let email = this.authService.getCurrentUser();
    if (email != null && email != undefined && email != '') {
      return true;
    } else {
      return false;
    }
  }

  getActive() {
    let apiData = this.sportsApi.getApiData();
    if (apiData == undefined) {
      return false;
    }

    if (this.sportsApi.isTournamentActive(apiData.leaderboard.round_state) == true) {
      return true;
    } else {
      return false;
    }
  }

  checkData2(golferID, currentGolfer) {
    if (golferID === currentGolfer) {
      return false;
    } else {
      if (golferID === this.picks.golfer5 || golferID === this.picks.golfer6 ||
        golferID === this.picks.golfer7 || golferID === this.picks.golfer8) {
        return true;
      }
    }
  }

  getGolferGroupings() {
    this.subscription = this.sportsApi.getGolferGroupings().subscribe(groups => {
      let golferGroupings: Array<any>;
      golferGroupings = groups[0];
      for (let groupsKey in golferGroupings) {
        if (golferGroupings[groupsKey].eventId != this.picks.eventId) {
          continue;
        }
        let group = {} as IGolfers;
        group.id = golferGroupings[groupsKey].golferId;
        group.name = golferGroupings[groupsKey].name;

        if (golferGroupings[groupsKey].group == 'A') {
          this.golferGrpA.push(group);
        } else if (golferGroupings[groupsKey].group == 'B') {
          this.golferGrpB.push(group);
        } else {
          this.golferGrpC.push(group);
        }
      }
    });
  }

  private initialize() {
    this.picks = {
      golfer1: '', golfer2: '', golfer3: '', golfer4: '',
      golfer5: '', golfer6: '', golfer7: '', golfer8: '',
      eventId: '', team: '', email: '',
    };
  }

  private loadUserPicks() {
    this.subscription = this.sportsApi.getGolferPicks().subscribe(golferPicks => {
      for (let picksKey in golferPicks) {
        if (this.authService.getCurrentUser() == golferPicks[picksKey].email) {
          if (golferPicks[picksKey].eventId == this.picks.eventId) {
            this.existingPicks = true;
            this.picks = golferPicks[picksKey];
            break;
          }
        }
      }
      this.isLoading = false;
    });
  }
}
