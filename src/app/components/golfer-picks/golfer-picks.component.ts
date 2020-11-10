import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGolfersGroupPick, IGolferGroupingsUI } from '../../models/models';

@Component({
  selector: 'app-golfer-picks',
  templateUrl: './golfer-picks.component.html',
  styleUrls: ['./golfer-picks.component.scss']
})
export class GolferPicksComponent implements OnInit, OnChanges {
  @Input() golferGroupings: IGolferGroupingsUI;
  @Input() picksFg: FormGroup;
  golferGrpA: Array<IGolfersGroupPick> = [];
  golferGrpB: Array<IGolfersGroupPick> = [];
  golferGrpC: Array<IGolfersGroupPick> = [];

  constructor() {}

  ngOnInit(): void {
    this.buildGroupings();
  }

  ngOnChanges(): void {
    this.buildGroupings();
  }

  checkGolferSelected(golferDropDown, currentGolfer): boolean {
    if (golferDropDown === currentGolfer) {
      return false;
    }
    const golferArray = [];
    for (let key in this.picksFg.value) {
      if (this.picksFg.value.hasOwnProperty(key)) {
        golferArray.push(this.picksFg.value[key]);
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
}
