import { Component, OnInit } from '@angular/core';
import { userGolfPicks, golfers } from '../models';
import { _golferGrpA, _golferGrpB, _golferGrpC } from '../constants';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})

export class PickTeamComponent implements OnInit {
  picks: userGolfPicks;
  answer: string;
  golferGrpA: Array<golfers> = [];
  golferGrpB: Array<golfers> = [];
  golferGrpC: Array<golfers> = [];

  constructor(private router: Router, private fireDb: AngularFireDatabase, private popup: MatDialog) {
    this.picks = {
      golfer1: '', golfer2: '', golfer3: '', golfer4: '',
      golfer5: '', golfer6: '', golfer7: '', golfer8: '',
      eventId: 0, team: ''
    };
    this.golferGrpA = _golferGrpA;
    this.golferGrpB = _golferGrpB;
    this.golferGrpC = _golferGrpC;
  }

  ngOnInit() {
    this.picks.eventId = 1;
  }

  openPopup() {
    console.log(this.picks);

    /** *check if fields are populated */
    if(this.picks.golfer1 == '' || this.picks.golfer2 == '' ||
       this.picks.golfer3 == '' || this.picks.golfer4 == '' ||
       this.picks.golfer5 == '' || this.picks.golfer6 == '' ||
       this.picks.golfer7 == '' || this.picks.golfer8 == '' ||
       this.picks.team == '' ){
         console.log('works1');
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

}
