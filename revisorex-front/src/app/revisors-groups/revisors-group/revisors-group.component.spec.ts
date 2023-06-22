import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisorsGroupComponent } from './revisors-group.component';

describe('RevisorsGroupComponent', () => {
  let component: RevisorsGroupComponent;
  let fixture: ComponentFixture<RevisorsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisorsGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisorsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
