import { Component } from '@angular/core';
import { StorageService, UtilsService } from 'utils';
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
  constructor(private utilsService: UtilsService, appConfigService: AppConfigService, private authenticationService: AuthenticationService, private storageService: StorageService) {
    
  }
}