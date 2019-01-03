import { Component, OnInit } from '@angular/core';
import { sportsApiService } from '../sports-api';
import { ActivatedRoute } from '@angular/router';
import { scoreCard } from '../models';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss']
})
export class ScorecardComponent implements OnInit {
  pgaTournyRespPlayers: any[];
  sub: any;
  scoreCard: scoreCard;
  golferId: string;

  constructor(private sportsApi: sportsApiService, private route: ActivatedRoute) {
    this.scoreCard = {
      hole1: '', hole2: '', hole3: '', hole4: '', hole5: '', hole6: '', hole7: '', hole8: '',
      hole9: '', hole10: '', hole11: '', hole12: '', hole13: '', hole14: '', hole15: '', hole16: '', hole17: '', hole18: '',
      par1: '', par2: '', par3: '', par4: '', par5: '', par6: '', par7: '', par8: '', par9: '', par10: '', par11: '', par12: '',
      par13: '', par14: '', par15: '', par16: '', par17: '', par18: '', holeIn: '', holeOut: '', parIn: '', parOut: '',
      holeTot: '', parTot: '', playerName: ''
    };
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.golferId = params['golferId'];

      //*Execute API to fetch data and return the player scorecard
      this.sportsApi.getGolfScores().subscribe(apiData => {

        let pgaPlayer = {} as any;
        this.pgaTournyRespPlayers = apiData.leaderboard.players;

        pgaPlayer = this.pgaTournyRespPlayers.find(player =>
          player.player_id === this.golferId);

        this.buildScorecard(pgaPlayer);
      }
      )
    }
    )
  }

  buildScorecard(playerData) {
    let holes: any[];
    let i = 0;
    let parIn = 0;
    let parOut = 0;
    let holeIn = 0;
    let holeOut = 0;
    holes = playerData.holes;
    console.log(playerData);
    for (let hole of holes) {
      i++;
      this.scoreCard['par' + i] = hole.par;
      this.scoreCard['hole' + i] = hole.strokes;

      if (i < 10) {
        parOut = +parOut + +hole.par;
        holeOut = holeOut + +hole.strokes;
      } else {
        parIn = parIn + +hole.par;
        holeIn = holeIn + +hole.strokes;
      }
    }
    this.scoreCard.playerName = playerData.player_bio.first_name + ' ' + playerData.player_bio.last_name;
    this.scoreCard.parIn = parIn.toString();
    this.scoreCard.parOut = parOut.toString();
    this.scoreCard.holeOut = holeOut.toString();
    this.scoreCard.holeIn = holeIn.toString();
    this.scoreCard.parTot = (parIn + parOut).toString();
    this.scoreCard.holeTot = (holeIn + holeOut).toString();

  }
}
