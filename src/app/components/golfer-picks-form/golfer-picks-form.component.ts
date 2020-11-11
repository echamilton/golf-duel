import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGolfersGroupPick } from '../../models/models';

@Component({
  selector: 'app-golfer-picks-form',
  templateUrl: './golfer-picks-form.component.html',
  styleUrls: ['./golfer-picks-form.component.scss']
})
export class GolferPicksFormComponent implements OnInit {
  @Input() picksFg: FormGroup;
  @Input() golferGrpA: Array<IGolfersGroupPick> = [];
  @Input() golferGrpB: Array<IGolfersGroupPick> = [];
  @Input() golferGrpC: Array<IGolfersGroupPick> = [];

  constructor() {}

  ngOnInit(): void {}

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
}
