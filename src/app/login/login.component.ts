import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { ViewEncapsulation } from '@angular/core';
import { LoginService } from './login.service';
import { StorageService, StorageType } from 'utils';
import { AppConfigService } from '../shared/services/app-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../shared/models/language.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  // Atributos y propiedades

  /*Indica si esta autenticando al usuario */
  private authenticating: boolean;

  /*Formulario de login */
  public loginFormControl: FormGroup;

  /*Direccion url a la cual originalmente se navegaba antes de cargar el componente LoginComponent */
  private returnUrl: string;

  // Url del servicio de backend que resolvera si el usuario se autentica o no
  private loginApiUrl: string;

  private currentUserKey: string;

  public loading: boolean;

  public defaultLanguage: string;

  constructor(private translateService: TranslateService,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router,
              private appConfigService: AppConfigService,
              private storageService: StorageService) {

    if (this.storageService.retrieve(this.appConfigService.defaultLanguage, StorageType.Session) == undefined) {
      
      // Se establece el lenguaje del navegador al no haber un lenguaje guardado en el storage
      // esto se hace para que la traduccion se haga correctamente
      this.translateService.setDefaultLang(navigator.language);
      // Aqui se establece para que en el combo de lenguajes aparezca elegido el
      // lenguaje
      this.defaultLanguage = navigator.language;
    } else {
      this.defaultLanguage = this.storageService.retrieve(this.appConfigService.defaultLanguage, StorageType.Session);
    }
    console.log(navigator.language);
    this.loading = false;
   }

  public hidePassword: boolean;

  public languages: Language[];


ngOnInit(): void
{


    this.hidePassword = true;

    // Inicializacion del formulario para la autenticacion
    this.loginFormControl = new FormGroup(
      {

         emailControl: new FormControl('', [Validators.required, Validators.email]),
         passwordControl: new FormControl('', [Validators.required, ])

      });

    this.loginApiUrl    = history.state.loginApiUrl;
    this.currentUserKey = history.state.currentUserKey;

    this.languages = [
      {value: 'es-MX', viewValue: 'Español'},
      {value: 'en-US', viewValue: 'English'},
    ];
}

  onSubmit() {
    this.loading = true;
    const username = this.loginFormControl.get('emailControl').value;
    const password = this.loginFormControl.get('passwordControl').value;
    this.loginService.login(username, password, this.defaultLanguage)
    .subscribe( {
      next: value => {
        console.log(value);
        this.loading = false;
        // Se guarda el lenguaje elegido por el usuario
        this.storageService.store(this.appConfigService.defaultLanguage, this.defaultLanguage, StorageType.Session);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: error => {
        this.loading = false;
        if (error != null && error.error != null ) {

          // Error desconocido o error interno en el servidor
          if (error.error.status === 0 || error.error.status === 500) {
            this.loginFormControl.setErrors({ unknowError: true });

          }

          // Si el error es acceso no autorizado entonces las credenciales no son validas
          else if (error.error.status === 401) {
            this.loginFormControl.setErrors({ invalidCredentials: true });

          }
        }

      }

    } );
  }

  onLanguageChange(language: any){
    this.translateService.setDefaultLang(this.defaultLanguage);
  }

}
