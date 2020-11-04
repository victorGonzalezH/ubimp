import { Component } from '@angular/core';
import { UtilsService } from 'utils';
import {AppConfigService} from './shared/services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ubimp';

  // Constructor de la clase
  constructor(private utilsService: UtilsService, appConfigService: AppConfigService) {

    utilsService.configureUtils('home', 'login', appConfigService.currentUserKey);
  }
}
