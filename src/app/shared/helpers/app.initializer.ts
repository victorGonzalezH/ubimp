import { catchError } from 'rxjs/operators';
import { UserSource, UtilsService } from 'utils';
import { AppConfigService } from '../services/app-config.service';
import { AuthenticationService } from '../services/authentication.service';

export function appInitializer(authenticationService: AuthenticationService, utilsService: UtilsService, appConfigService: AppConfigService) 
{
    return () => new Promise(resolve => {
        // Gets the app configuration, this includes the api url, the realtime url. You can access
        // to the loaded configuration thrown the methods from the appConfigService
        appConfigService.getAppConfig();

        //We have to configure the utils service.
        // the first parameter is the default view when the user log in succesfully
        // the second is the name view of the loging page
        // the third param is the key name of the user object, that one that is stored in the local storage
        // the forth parameter is the authentication service
        //the fith paramters indicates if the library applies or no refresh token
        utilsService.configureUtils('home', 'login', appConfigService.currentUserKey, authenticationService, true);
    
        utilsService.reloadPageOnHttpNoAuthorizedError = true  ;

        
        //Attempt to refresh token on app start up to auto authenticate
        if(authenticationService.getUser(UserSource.LocalStorage) != null) {
            authenticationService.refreshToken()
            .subscribe(  {   error: error => {  } } ).add(resolve);
        } else {

            return resolve(true);
        }

    });
}