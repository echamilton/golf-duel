import { Component, OnInit } from '@angular/core';
import { IUserGolfPicks, IGolfersGroupPick } from '../../models/models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SportsApiService } from '../../services/sports-api.service';
import { AuthService } from '../../services/auth.service';
import { Messages } from './../../models/constants';
import { PopupComponent } from './../popup/popup.component';
import { GolfDataStoreService } from 'src/app/services/golf-data-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})
export class PickTeamComponent implements OnInit {
  subscription: Subscription;
  picks: IUserGolfPicks;
  answer: string;
  golferGrpA: Array<IGolfersGroupPick> = [];
  golferGrpB: Array<IGolfersGroupPick> = [];
  golferGrpC: Array<IGolfersGroupPick> = [];
  isLoading: boolean;
  golfPicksFg: FormGroup;
  config = new MatSnackBarConfig();

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private popup: MatDialog,
    private authService: AuthService,
    private golfDataService: GolfDataStoreService,
    private formBuilder: FormBuilder
  ) {
    this.initateFormGroup();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getGolferGroupings();
    this.loadUserPicks();
  }

  get picksFormHasError(): boolean {
    return this.golfPicksFg.invalid;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isActive(): boolean {
    const apiData = this.sportsApi.getApiData();
    return this.sportsApi.isTournamentActive(apiData.status);
  }

  private initateFormGroup(): void {
    this.golfPicksFg = this.formBuilder.group({
      golfer1: ['', Validators.required],
      golfer2: ['', Validators.required],
      golfer3: ['', Validators.required],
      golfer4: ['', Validators.required],
      golfer5: ['', Validators.required],
      golfer6: ['', Validators.required],
      golfer7: ['', Validators.required],
      golfer8: ['', Validators.required],
      team: ['', Validators.required]
    });
  }

  private mapExistingPicks(): void {
    this.golfPicksFg.setValue({
      golfer1: this.picks.golfer1,
      golfer2: this.picks.golfer2,
      golfer3: this.picks.golfer3,
      golfer4: this.picks.golfer4,
      golfer5: this.picks.golfer5,
      golfer6: this.picks.golfer6,
      golfer7: this.picks.golfer7,
      golfer8: this.picks.golfer8,
      team: this.picks.team
    });
    this.golfPicksFg.controls['team'].disable();
  }

  openPopup(action: string): void {
    let popupText;
    if (action === 'update') {
      if (this.picksFormHasError) {
        this.openSnackBar(Messages.teamError);
        return;
      }
      popupText = Messages.submitTeam;
    } else {
      popupText = Messages.deleteTeam;
    }
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { answer: this.answer, text: popupText };
    const dialogRef = this.popup.open(PopupComponent, popupConfig);

    dialogRef
      .afterClosed()
      .subscribe((answer) => this.processData(answer, action));
  }

  processData(answer: string, action: string): void {
    this.isLoading = true;
    if (answer === 'Yes') {
      this.sportsApi.getGolfScores().subscribe(
        (apiData) => {
          this.validateSubmit(action, false, apiData);
        },
        (err) => {
          this.validateSubmit(action, true, []);
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  private validateSubmit(
    action: string,
    apiNotReady: boolean,
    apiData: any
  ): void {
    let active = false;
    if (!apiNotReady) {
      active = this.sportsApi.isTournamentActive(apiData.status);
    }

    if (active) {
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
    this.subscription = this.golfDataService
      .getGolferGroupings()
      .subscribe((groups) => {
        let golferGroupings: Array<any>;
        golferGroupings = groups[0];
        golferGroupings.forEach((groupRecord) => {
          if (groupRecord.eventId == this.sportsApi.getActiveEventId()) {
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
          }
        });
      });
  }

  private loadUserPicks(): void {
    this.golfDataService.loadUserPicks().subscribe((userPicks) => {
      this.picks = userPicks;
      if (userPicks) {
        this.mapExistingPicks();
      }
      this.isLoading = false;
    });
  }
}
