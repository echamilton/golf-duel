import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildGroupsComponent } from './build-groups.component';

describe('BuildGroupsComponent', () => {
  let component: BuildGroupsComponent;
  let fixture: ComponentFixture<BuildGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
