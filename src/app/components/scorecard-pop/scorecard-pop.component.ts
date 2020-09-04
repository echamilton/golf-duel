import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SportsApiService } from '../../services/sports-api.service';
import { IScoreCard } from '../../models/models';
import { ScoreValues } from './../../models/constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent implements OnInit {
  loading: boolean;
  scorecard$: Observable<IScoreCard>;

  constructor(
    private sportsApi: SportsApiService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.scorecard$ = this.sportsApi.getGolferScoreCard(
      data.golferId,
      Number(data.round)
    );
  }

  ngOnInit() {
    this.loading = true;
  }

  getColor(score) {
    let color: string;
    switch (score) {
      case ScoreValues.par: {
        color = 'black';
        break;
      }
      case ScoreValues.birdie: {
        color = 'blue';
        break;
      }
      case ScoreValues.bogey: {
        color = 'red';
        break;
      }
      case ScoreValues.eagle: {
        color = 'green';
        break;
      }
      case ScoreValues.double: {
        color = 'purple';
        break;
      }
      case ScoreValues.noScore: {
        color = 'black';
        break;
      }
      default: {
        color = 'purple';
        break;
      }
    }
    return color;
  }
}
