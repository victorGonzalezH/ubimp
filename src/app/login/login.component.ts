import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit 
{

//Atributos y propiedades

  /*Indica si esta autenticando al usuario */
  private authenticating: boolean;

  /*Formulario de login */
  private loginForm: FormGroup;

  /*Direccion url a la cual originalmente se navegaba antes de cargar el componente LoginComponent */
  private returnUrl: string;

  //Url del servicio de backend que resolvera si el usuario se autentica o no
  private loginApiUrl: string;

  private currentUserKey: string;


  constructor() { }

// tslint:disable-next-line: no-trailing-whitespace
ngOnInit() 
{
    //Inicializacion del formulario para la autenticacion
    this.loginForm = new FormGroup(
      {
        username: new FormControl(),
        password: new FormControl()
        
      });


    this.loginApiUrl    = history.state.loginApiUrl;
    this.currentUserKey = history.state.currentUserKey;

}

}
