import { Component, OnInit } from '@angular/core';
import { userGolfPicks, golfers, golferGrouping } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { sportsApiService } from '../sports-api';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})

export class PickTeamComponent implements OnInit {
  subscription: Subscription;
  picks: userGolfPicks;
  answer: string;
  golferGrpA: Array<golfers> = [];
  golferGrpB: Array<golfers> = [];
  golferGrpC: Array<golfers> = [];

  constructor(private sportsApi: sportsApiService, private router: Router, private fireDb: AngularFireDatabase, private popup: MatDialog) {
    this.picks = {
      golfer1: '', golfer2: '', golfer3: '', golfer4: '',
      golfer5: '', golfer6: '', golfer7: '', golfer8: '',
      eventId: '', team: ''
    };
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
      console.log('User did not complete all picks');
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
      this.fireDb.list('myGolfers').push(this.picks).then(_ => {
        console.log('Team has been submitted');
        /**log any errors , or handle exceptions here */
        this.router.navigate(['/leader']);
      });
    }
  }

  checkData(golferID, currentGolfer) {
    if (golferID === currentGolfer) {
      return true;
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
    this.subscription = this.fireDb.list<golferGrouping>('golferGroups').valueChanges().subscribe(golferGroupings => {
      for (let groupsKey in golferGroupings) {
        if (golferGroupings[groupsKey].eventId != this.sportsApi.getEventId()) { continue };
        let group = {} as golfers;
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
}
