import { Component } from '@angular/core';
import { UtilsService } from 'utils';
import {AppConfigService} from './shared/services/app-config.service';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ubimp';

  // Constructor de la clase
  constructor(private utilsService: UtilsService, appConfigService: AppConfigService, private authenticationService: AuthenticationService) {
    // Gets the app configuration, this includes the api url, the realtime url. You can access
    // to the loaded configuration thrown the methods from the appConfigService
    appConfigService.getAppConfig();

    
    this.utilsService.configureUtils('home', 'login', appConfigService.currentUserKey, authenticationService);
    this.utilsService.reloadPageOnHttpNoAuthorizedError = false;
  }
}