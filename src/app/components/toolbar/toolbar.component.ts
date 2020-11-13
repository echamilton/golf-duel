import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GolfStoreFacade } from './../../store/golf.store.facade';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private golfFacade: GolfStoreFacade
  ) {}

  ngOnInit(): void {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  reloadLeaderboard(): void {
    this.golfFacade.loadTournamentData();
    this.golfFacade.triggerRefreshData();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }
}
