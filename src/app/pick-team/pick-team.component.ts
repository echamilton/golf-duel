import { Component, OnInit } from '@angular/core';
import { UserGolfPicks, Golfers, GolferGrouping } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SportsApiService } from '../sports-api';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../authservice';
import { DatabaseQuery } from '@angular/fire/database/interfaces';
import { PopupComponent } from '../popup/popup.component';
import { FirebaseApp } from 'angularfire2';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})

export class PickTeamComponent implements OnInit {
  subscription: Subscription;
  picks: UserGolfPicks;
  picksBuffer: UserGolfPicks;
  answer: string;
  status: string;
  golferGrpA: Array<Golfers> = [];
  golferGrpB: Array<Golfers> = [];
  golferGrpC: Array<Golfers> = [];

  constructor(private sportsApi: SportsApiService, private router: Router, private snackBar: MatSnackBar,
    private fireDb: AngularFireDatabase, private popup: MatDialog, private snack: MatSnackBarModule,
    private authService: AuthService) {
    this.picks = {
      golfer1: '', golfer2: '', golfer3: '', golfer4: '',
      golfer5: '', golfer6: '', golfer7: '', golfer8: '',
      eventId: '', team: '', email: '',
    };
  }

  ngOnInit() {
    this.picks.eventId = this.sportsApi.getEventId();

    this.getGolferGroupings();
    // this.loadUserPicks();
  }

  openPopup() {

    /** *check if fields are populated */
    if (this.picks.golfer1 == '' || this.picks.golfer2 == '' ||
      this.picks.golfer3 == '' || this.picks.golfer4 == '' ||
      this.picks.golfer5 == '' || this.picks.golfer6 == '' ||
      this.picks.golfer7 == '' || this.picks.golfer8 == '' ||
      this.picks.team == '') {
      console.log('User did not complete all picks');
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
      if( this.picksBuffer != undefined ){
        //*process delete
        // this.fireDb.list('myGolfers').update(this.picksBuffer);
        // var ref = FirebaseApp.database().ref("dinosaurs");
        // let query: DatabaseQuery;
        // query.equalTo('evanchamilton@gmail.com','email');

        // this.fireDb.list('myGolfers').query(query);
      }


      this.picks.email = this.authService.getCurrentUser();
      this.fireDb.list('myGolfers').push(this.picks).then(_ => {
        console.log('Team has been submitted');
        this.router.navigate(['/leader']);
        this.snackBar.open('Picks have been submitted!', 'Close');
      });
    }
  }

  checkData(golferID, currentGolfer) {
    if (golferID === currentGolfer) {
      return true;
    }
  }

  isLoggedIn(){
    // let email = this.authService.getCurrentUser();
    // if(email != null){
      return true;
    // }else{return false};
  }

  getActive() {
    let apiData: any;
    apiData = this.sportsApi.getApiData();
    if (apiData == undefined) { return false };
    this.status = apiData.leaderboard.round_state;
    if (this.status == 'Official' || this.status == 'In Progress') {
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
    this.subscription = this.fireDb.list<GolferGrouping>('golferGroups').valueChanges().subscribe(golferGroupings => {
      for (let groupsKey in golferGroupings) {
        if (golferGroupings[groupsKey].eventId != this.sportsApi.getEventId()) { continue }
        let group = {} as Golfers;
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


  private loadUserPicks() {
    this.subscription = this.fireDb.list<UserGolfPicks>('myGolfers').valueChanges().subscribe(golferPicks => {
      for (let picksKey in golferPicks) {
        if (this.authService.getCurrentUser() == golferPicks[picksKey].email) {
          if (golferPicks[picksKey].eventId == this.sportsApi.getEventId() && golferPicks[picksKey].team == 'Hampion') {
            this.picks = golferPicks[picksKey];
            this.picksBuffer = golferPicks[picksKey];
            return;
          }
        }
      }
    })
  }
}
