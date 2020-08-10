import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickTeamComponent } from './pick-team.component';

describe('PickTeamComponent', () => {
  let component: PickTeamComponent;
  let fixture: ComponentFixture<PickTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
