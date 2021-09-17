import { TestBed } from '@angular/core/testing';

import { HomeGoogleMapsTranslateService } from './home-google-maps-translate.service';

describe('HomeGoogleMapsTranslateService', () => {
  let service: HomeGoogleMapsTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeGoogleMapsTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
