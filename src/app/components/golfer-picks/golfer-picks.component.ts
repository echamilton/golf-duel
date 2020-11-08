import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  IUserGolfPicks,
  IGolfersGroupPick,
  IGolferGroupingsUI
} from '../../models/models';

@Component({
  selector: 'app-golfer-picks',
  templateUrl: './golfer-picks.component.html',
  styleUrls: ['./golfer-picks.component.scss']
})
export class GolferPicksComponent implements OnInit, OnChanges {
  @Input() picks: IUserGolfPicks;
  @Input() golferGroupings: IGolferGroupingsUI;
  disableName: boolean;
  golferGrpA: Array<IGolfersGroupPick> = [];
  golferGrpB: Array<IGolfersGroupPick> = [];
  golferGrpC: Array<IGolfersGroupPick> = [];

  constructor() {}

  ngOnInit(): void {
    this.buildGroupings();
    this.initialize();
  }

  ngOnChanges(): void {
    this.buildGroupings();
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

  private buildGroupings(): void {
    if (this.golferGroupings) {
      this.golferGrpA = this.golferGroupings.groupA;
      this.golferGrpB = this.golferGroupings.groupB;
      this.golferGrpC = this.golferGroupings.groupC;
    }
  }

  private initialize(): void {
    if (this.picks.team != '') {
      this.disableName = true;
    }
  }
}
