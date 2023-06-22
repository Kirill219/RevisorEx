import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisorsGroupsComponent } from './revisors-groups.component';

describe('RevisorsGroupsComponent', () => {
  let component: RevisorsGroupsComponent;
  let fixture: ComponentFixture<RevisorsGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisorsGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisorsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
