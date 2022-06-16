import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { ApiResultBase, DataService, DataServiceProtocols, ResponseTypes } from 'utils';
import { ActivateCommand } from './activate-command.model';

@Injectable({
  providedIn: 'root'
})
export class ActivateService {

  constructor(private dataService: DataService, private appConfigService: AppConfigService) { }


  /**
   * Activate the users account
   * @param activateCommand 
   * @returns 
   */
  public activate(activateCommand: ActivateCommand): Observable<ApiResultBase> {
    return this.dataService.post(this.appConfigService.apiUrl + '/activate', activateCommand, null, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
  }

}
