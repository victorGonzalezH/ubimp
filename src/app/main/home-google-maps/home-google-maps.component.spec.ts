import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGoogleMapsComponent } from './home-google-maps.component';

describe('HomeGoogleMapsComponent', () => {
  let component: HomeGoogleMapsComponent;
  let fixture: ComponentFixture<HomeGoogleMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeGoogleMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeGoogleMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
