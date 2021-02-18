import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GolferPicksFormComponent } from './golfer-picks-form.component';

describe('GolferPicksComponent', () => {
  let component: GolferPicksFormComponent;
  let fixture: ComponentFixture<GolferPicksFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GolferPicksFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolferPicksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
