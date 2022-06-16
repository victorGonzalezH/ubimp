import { Injectable } from '@angular/core';
import { DataService, DataServiceProtocols } from 'utils';
import { AuthenticationService } from '../shared/services/authentication.service';

import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private authenticationService: AuthenticationService) {

  }



  public login(username: string, password: string, lang: string) {

    return this.authenticationService.login(username, password, lang)
    .pipe(catchError( error => throwError(error) ));

  }

}
