import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IGolferGroupingsUI, IUserGolfPicks } from '../../models/models';
import { SportsApiService } from '../../services/sports-api.service';
import { AuthService } from '../../services/auth.service';
import { Messages } from './../../models/constants';
import { PopupComponent } from './../popup/popup.component';
import { GolfDataStoreService } from './../../services/golf-data-store.service';
import { GolfStoreFacade } from './../../store/golf.store.facade';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})
export class PickTeamComponent implements OnInit {
  answer: string;
  popupText: string;
  isLoading: boolean;
  config = new MatSnackBarConfig();
  golferGroupings$: Observable<IGolferGroupingsUI>;
  existingEntry = false;
  picksFg: FormGroup;

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private popup: MatDialog,
    private authService: AuthService,
    private golfDataService: GolfDataStoreService,
    private golfFacade: GolfStoreFacade
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUserPicks();
    this.getGolferGroupings();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isTournamentActive(): boolean {
    return this.sportsApi.isTournamentActive();
  }

  private loadUserPicks(): void {
    this.golfDataService.loadUserPicks().subscribe((picks) => {
      if (picks) {
        this.existingEntry = true;
        this.picksFg.get('team').disable();
        this.mapPicksToForm(picks);
      }
      this.isLoading = false;
    });
  }

  private getGolferGroupings(): void {
    this.isLoading = true;
    this.golferGroupings$ = this.golfFacade.getGolferGroups();
  }

  openConfirmationPopup(action: string): void {
    let popupText: string;
    if (action === 'update') {
      if (this.picksFg.status === 'INVALID') {
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

  private validateSubmit(action: string, status: string): void {
    if (this.sportsApi.isTournamentActive(status)) {
      this.openSnackBar(Messages.picksActiveTourny);
      this.isLoading = false;
      return;
    }
    if (action === 'update') {
      this.golfDataService.updateGolferPicks(this.mapFormToPicks());
      this.openSnackBar(Messages.teamSuccess);
    } else {
      this.golfDataService.deleteGolferPicks(this.mapFormToPicks());
      this.openSnackBar(Messages.deleteSuccess);
    }
    this.isLoading = false;
    this.router.navigate(['/leader']);
  }

  openSnackBar(text: string): void {
    this.config.duration = 2500;
    this.snackBar.open(text, 'Close', this.config);
  }

  private initializeForm(): void {
    this.picksFg = new FormGroup({
      golfer1: new FormControl('', Validators.required),
      golfer2: new FormControl('', Validators.required),
      golfer3: new FormControl('', Validators.required),
      golfer4: new FormControl('', Validators.required),
      golfer5: new FormControl('', Validators.required),
      golfer6: new FormControl('', Validators.required),
      golfer7: new FormControl('', Validators.required),
      golfer8: new FormControl('', Validators.required),
      team: new FormControl({ value: '', disabled: false }, Validators.required)
    });
  }

  private mapPicksToForm(picks: IUserGolfPicks): void {
    this.picksFg.setValue({
      golfer1: picks.golfer1,
      golfer2: picks.golfer2,
      golfer3: picks.golfer3,
      golfer4: picks.golfer4,
      golfer5: picks.golfer5,
      golfer6: picks.golfer6,
      golfer7: picks.golfer7,
      golfer8: picks.golfer8,
      team: picks.team
    });
  }

  private mapFormToPicks(): IUserGolfPicks {
    const userPicks: IUserGolfPicks = {
      golfer1: this.picksFg.value.golfer1,
      golfer2: this.picksFg.value.golfer2,
      golfer3: this.picksFg.value.golfer3,
      golfer4: this.picksFg.value.golfer4,
      golfer5: this.picksFg.value.golfer5,
      golfer6: this.picksFg.value.golfer6,
      golfer7: this.picksFg.value.golfer7,
      golfer8: this.picksFg.value.golfer8,
      team: this.picksFg.get('team').value,
      email: this.authService.getCurrentUser(),
      eventId: this.sportsApi.getEventId()
    };
    return userPicks;
  }
}
