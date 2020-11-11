import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGoogleMapComponent } from './home-google-map.component';

describe('HomeGoogleMapComponent', () => {
  let component: HomeGoogleMapComponent;
  let fixture: ComponentFixture<HomeGoogleMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeGoogleMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeGoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
