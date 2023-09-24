import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IGolfersGroupPick } from '../../models/models';

@Component({
  selector: 'golf-golfer-picks-form',
  templateUrl: './golfer-picks-form.component.html',
  styleUrls: ['./golfer-picks-form.component.scss']
})
export class GolferPicksFormComponent implements OnInit {
  @Input() picksFg!: UntypedFormGroup;
  @Input() golferGrpA: Array<IGolfersGroupPick> = [];
  @Input() golferGrpB: Array<IGolfersGroupPick> = [];
  @Input() golferGrpC: Array<IGolfersGroupPick> = [];

  constructor() {}

  ngOnInit(): void {}

  checkGolferSelected(golferDropDown: string, currentGolfer: string): boolean {
    if (golferDropDown === currentGolfer) {
      return false;
    }
    const golferArray = Object.values(this.picksFg.value);
    return golferArray.includes(golferDropDown);
  }
}
