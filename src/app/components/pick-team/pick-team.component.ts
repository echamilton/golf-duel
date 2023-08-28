import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  IGolferGroupingsUI,
  IUserGolfPicks,
  ITabStructure
} from '../../models/models';
import { SportsApiService } from '../../services/sports-api.service';
import { AuthService } from '../../services/auth.service';
import {
  INITIALIZED_VALUE,
  Messages,
  Operation
} from './../../models/constants';
import { PopupComponent } from './../popup/popup.component';
import { GolfStoreFacade } from './../../store/golf.store.facade';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss']
})
export class PickTeamComponent implements OnInit {
  answer: string = INITIALIZED_VALUE;
  userPicks$: Observable<IUserGolfPicks>;
  popupText: string = INITIALIZED_VALUE;
  isLoading: boolean = false;
  config = new MatSnackBarConfig();
  golferGroupings$: Observable<IGolferGroupingsUI>;
  existingEntry = false;
  picksFg: UntypedFormGroup;
  teamEntries: Array<ITabStructure> = [];

  constructor(
    private sportsApi: SportsApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private popup: MatDialog,
    private authService: AuthService,
    private golfFacade: GolfStoreFacade
  ) {
    this.golferGroupings$ = this.getGolferGroupings();
    this.picksFg = this.initializeForm();
    this.userPicks$ = this.golfFacade.getUserSelectedPicks();

    // const newtab: ITabStructure = {
    //   entryName: 'Entry 1'
    // };
    // this.teamEntries.push(newtab);
  }

  ngOnInit(): void {
    this.loadUserPicks();
    this.getGolferGroupings();
    this.checkLoadingStatus();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get updateOperation(): Operation {
    return Operation.update;
  }

  get deleteOperation(): Operation {
    return Operation.delete;
  }

  get isTournamentActive(): boolean {
    return this.sportsApi.isTournamentActive();
  }

  private loadUserPicks(): void {
    this.userPicks$.subscribe((picks) => {
      if (picks && picks.team) {
        this.existingEntry = true;
        this.picksFg.get('team')!.disable();
        this.mapPicksToForm(picks);
      }
    });
  }

  private getGolferGroupings(): Observable<IGolferGroupingsUI> {
    return this.golfFacade.getGolferGroups();
  }

  private preFormCheck(isTourneyLoading: boolean): void {
    if (this.isTournamentActive && !isTourneyLoading) {
      this.picksFg.disable();
    }
  }

  openConfirmationPopup(action: Operation): void {
    let popupText: string;
    if (action === Operation.update) {
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

  processData(answer: string, operation: Operation): void {
    this.isLoading = true;
    if (answer === 'Yes') {
      this.sportsApi.getGolfScores().subscribe((apiData) => {
        if (this.sportsApi.isTournamentActive(apiData.status)) {
          this.openSnackBar(Messages.picksActiveTourny);
          return;
        }

        this.golfFacade.updateUserPicks(this.mapFormToPicks(), operation);
        this.openSnackBar(Messages.teamSuccess);
        this.isLoading = false;
        this.golfFacade.loadUserPicks();
        this.router.navigate(['/leader']);
      });
    } else {
      this.isLoading = false;
    }
  }

  private launchConfirmModal(text: string, action: Operation): void {
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { answer: this.answer, text: text };

    const dialogRef = this.popup.open(PopupComponent, popupConfig);

    dialogRef
      .afterClosed()
      .subscribe((answer) => this.processData(answer, action));
  }

  openSnackBar(text: string): void {
    this.config.duration = 2500;
    this.snackBar.open(text, 'Close', this.config);
  }

  private initializeForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      golfer1: new UntypedFormControl('', Validators.required),
      golfer2: new UntypedFormControl('', Validators.required),
      golfer3: new UntypedFormControl('', Validators.required),
      golfer4: new UntypedFormControl('', Validators.required),
      golfer5: new UntypedFormControl('', Validators.required),
      golfer6: new UntypedFormControl('', Validators.required),
      golfer7: new UntypedFormControl('', Validators.required),
      golfer8: new UntypedFormControl('', Validators.required),
      team: new UntypedFormControl(
        { value: '', disabled: false },
        Validators.required
      )
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
      team: this.picksFg.get('team')!.value
    };
    return userPicks;
  }

  private checkLoadingStatus() {
    this.golfFacade
      .getLoadingIndicator()
      .subscribe((x) => this.preFormCheck(x));

    this.golfFacade
      .getAreGroupsLoading()
      .subscribe((isLoading) => (this.isLoading = isLoading));
  }

  newEntry(): void {
    const newEntry: ITabStructure = {
      entryName: 'Entry ' + (this.teamEntries.length + 1).toString()
    };
    this.teamEntries.push(newEntry);
  }

  selectedTabValue(event: any) {}
}
