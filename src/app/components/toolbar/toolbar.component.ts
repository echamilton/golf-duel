import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GolfStoreFacade } from './../../store/golf.store.facade';
import { AuthService } from '../../services/auth.service';
import { isInvalidGolfer } from 'src/app/utilities/player-team-validator';
import { forkJoin, from, Observable, of } from 'rxjs';
import { ITournamentResults, IUserGolfPicks } from 'src/app/models/models';
import { map, take } from 'lodash';
import { SportsApiService } from 'src/app/services/sports-api.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isInvalidLineup: boolean = false;
  userSelections$!: Observable<IUserGolfPicks>;
  tournamentResults$!: Observable<ITournamentResults>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private golfFacade: GolfStoreFacade,
    private api: SportsApiService
  ) {}

  ngOnInit(): void {
    this.checkForInvalidGolfers();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  reloadLeaderboard(): void {
    this.golfFacade.loadTournamentData();
    this.golfFacade.triggerRefreshData();
    this.router.navigate(['/leader']);
  }

  get invalidPlayerText(): string {
    return 'You have an invalid lineup';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }

  checkForInvalidGolfers(): void {
    const obv1$ = this.api.getGolfScores();
    const obv2$ = this.golfFacade.getTournamentData();

    const fjObs = forkJoin([obv1$, obv1$]);

    fjObs.subscribe((x) => {
      console.log('evan');
    });

    // console.log('evan');
    // const test = forkJoin([
    //   (this.userSelections$ = this.golfFacade.getUserSelectedPicks()),
    //   (this.tournamentResults$ = this.golfFacade.getTournamentData())
    // ]).subscribe((response) => {
    //   console.log(response);
    // });

    // const source = forkJoin([
    //   this.userSelections$,
    //   this.tournamentResults$
    // ]).subscribe(
    //   ([x, y]) => console.log('GOT:', x),
    //   (err) => console.log('Error:', err),
    //   () => console.log('Completed')
    // );

    // this.tournamentResults$.pipe(
    //   combineLatest($document)
    // )
    // .subscribe(([name, document]) => {
    //      this.name = name;
    //      this.document = pair.document;
    //      this.showForm();
    //  })

    // this.golfFacade.getTournamentData().subscribe((tournamentResults) => {
    //   this.golfFacade.getUserSelectedPicks().subscribe((userSelections) => {
    //     if (userSelections != undefined && tournamentResults != undefined) {
    //       this.isInvalidLineup = isInvalidGolfer(
    //         userSelections,
    //         tournamentResults.golfers
    //       );
    //     }
    //   });
    // });
  }
}
