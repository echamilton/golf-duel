import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolferPicksComponent } from './golfer-picks-form.component';

describe('GolferPicksComponent', () => {
  let component: GolferPicksComponent;
  let fixture: ComponentFixture<GolferPicksComponent>;

  beforeEach(async(() => {
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
