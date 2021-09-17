import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozonesComponent } from './geozones.component';

describe('GeozonesComponent', () => {
  let component: GeozonesComponent;
  let fixture: ComponentFixture<GeozonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeozonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
