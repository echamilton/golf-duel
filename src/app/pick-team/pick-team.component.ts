import { Component, OnInit } from '@angular/core';
import { userGolfPicks } from '../models';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.css']
})
export class PickTeamComponent implements OnInit {
  picks: userGolfPicks;

  constructor() { 
    this.picks = { eventId:'', golfer1: '', golfer2: '', golfer3: '',
                   golfer4: '', golfer5: '', golfer6: '', golfer7: '', 
                   golfer8: '', team:  '' };
  }

  ngOnInit() {
    this.picks.eventId = 'Masters';
    console.log(this.picks);
  }

}
