import { Component, OnInit } from '@angular/core';
import { IUserGolfPicks, IGolfers } from '../models';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SportsApiService } from '../sports-api';
import { AuthService } from '../authservice';
import { PopupComponent } from '../popup/popup.component';


@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})

export class PickTeamComponent implements OnInit {
  subscription: Subscription;
  picks: IUserGolfPicks;
  picksBuffer: IUserGolfPicks;
  answer: string;
  golferGrpA: Array<IGolfers> = [];
  golferGrpB: Array<IGolfers> = [];
  golferGrpC: Array<IGolfers> = [];

  constructor(private sportsApi: SportsApiService, private router: Router, private snackBar: MatSnackBar,
    private popup: MatDialog, private authService: AuthService) {

    this.initialize();
  }

  ngOnInit() {
    this.picks.eventId = this.sportsApi.getEventId();
    this.getGolferGroupings();
  }

  openPopup() {
    /** *check if fields are populated */
    if (this.picks.golfer1 == '' || this.picks.golfer2 == '' ||
      this.picks.golfer3 == '' || this.picks.golfer4 == '' ||
      this.picks.golfer5 == '' || this.picks.golfer6 == '' ||
      this.picks.golfer7 == '' || this.picks.golfer8 == '' ||
      this.picks.team == '') {
      this.snackBar.open('Complete all picks!', 'Close');
      return;
    }

    const popupConfig = new MatDialogConfig();

    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { answer: this.answer };

    const dialogRef = this.popup.open(PopupComponent, popupConfig);

    dialogRef.afterClosed().subscribe(
      answer => this.processData(answer)
    );
  }

  processData(answer) {
    if (answer === 'Yes') {
      this.sportsApi.saveGolferPicks(this.picks);
      this.router.navigate(['/leader']);
      this.snackBar.open('Picks have been submitted!', 'Close');
    }
  }

  checkData(golferID, currentGolfer) {
    if (golferID === currentGolfer) {
      return true;
    }
  }

  isLoggedIn() {
    return true;
  }

  getActive() {
    let apiData: any;
    apiData = this.sportsApi.getApiData();
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
    this.subscription = this.sportsApi.getGolferGroupings().subscribe(golferGroupings => {
      for (let groupsKey in golferGroupings) {
        if (golferGroupings[groupsKey].eventId !== this.sportsApi.getEventId()) {
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
    })
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
          if (golferPicks[picksKey].eventId == this.sportsApi.getEventId() && golferPicks[picksKey].team == 'Hampion') {
            this.picks = golferPicks[picksKey];
            this.picksBuffer = golferPicks[picksKey];
            return;
          }
        }
      }
    });
  }
}
