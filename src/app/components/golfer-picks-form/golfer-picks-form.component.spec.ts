import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GolferPicksComponent } from './golfer-picks-form.component';

describe('GolferPicksComponent', () => {
  let component: GolferPicksComponent;
  let fixture: ComponentFixture<GolferPicksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GolferPicksComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolferPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
