import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SignInCommand } from './signin.model';
import {TranslateService} from '@ngx-translate/core';
import { ApiResultBase } from 'utils';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { SigninService } from './signin.service';
import { MatSelectChange } from '@angular/material/select';
import { Language } from '../../shared/models/language.model';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SimpleMessageComponent } from 'src/app/shared/modals/simple-message/simple-message.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit, AfterViewInit {

  public signIn: SignInCommand = {} as SignInCommand;
  public countries: Array<any>;
  public states: Array<any>;
  public confirmPassword: string;
  public languages: Language[];
  private messageTitle: string;
  public loading: boolean;
  public confirmPasswordCorrect: boolean;
  public confirmPasswordRequired: boolean;
  @ViewChild('signInForm') public signInForm: NgForm;
  
  constructor(private translateService: TranslateService,
    private signinService: SigninService,
    private dialog: MatDialog) { 
  
    // Se establece el lenguaje del navegador al no haber un lenguaje guardado en el storage
    this.translateService.setDefaultLang(navigator.language);
    this.confirmPasswordCorrect = false;
    this.confirmPasswordRequired = false;
  }

  

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.languages = [
      {value: 'es-MX', viewValue: 'Español'},
      {value: 'en-US', viewValue: 'English'},
    ];

    
    this.signinService.getCountriesWithStates()
    .subscribe(response => this.countries = response.data);
  }

  onCountryChange(event: MatSelectChange) {
    const selectedCountryId = event.value;
    const selectedCountry = this.countries.filter(country => country.id === selectedCountryId)[0];
    this.states = selectedCountry.states;
  }



  onSubmit() {
    this.loading = true;
    this.signinService.signin(this.signIn)
    .subscribe({ 
      next: (response: ApiResultBase) => {
        this.loading = false;
        this.messageTitle = this.translateService.instant('login.signin.title');  
        const message = response.userMessage;
          const dialogRef = this.dialog.open(SimpleMessageComponent, {
            data: { title: this.messageTitle, message: message }
          });
      },
      error: (error) => {
      this.loading = false;
      this.messageTitle = this.translateService.instant('login.signin.title');
      const message = this.translateService.instant('login.signin.error');
      
      const dialogRef = this.dialog.open(SimpleMessageComponent, {
        data: { title: this.messageTitle, message: message }
      });

    } });
  
  }

  onLanguageChange(language: MatSelectChange) {
    this.translateService.setDefaultLang(language.value);
    
  }


  onKeyPassword(event: KeyboardEvent) {

    if(this.signIn.password !== this.confirmPassword) {
      this.confirmPasswordCorrect = false;
      if(this.signInForm.controls['confirmPasswordControl'].errors === null) {
        this.signInForm.controls['confirmPasswordControl'].setErrors({'passwordMatch': false});
      }
        
      else {
        this.signInForm.controls['confirmPasswordControl'].errors.passwordMatch = false;
       }
    } else  {
      this.confirmPasswordCorrect = true;
      this.signInForm.controls['confirmPasswordControl'].setErrors({'passwordMatch': null});
    }
     

  }

  onKeyPasswordConfirm(event: KeyboardEvent) {
    
    console.log(this.signInForm.controls['confirmPasswordControl'].errors);
    if(this.confirmPassword === '' || this.confirmPassword === null) {
      this.confirmPasswordRequired = true;
    }
    else {
      this.confirmPasswordRequired = false;
    }

    if(this.signIn.password !== this.confirmPassword) {
      this.confirmPasswordCorrect = false;
      if(this.signInForm.controls['confirmPasswordControl'].errors === null) {
        this.signInForm.controls['confirmPasswordControl'].setErrors({'passwordMatch': false});
      }
        
      else {
        this.signInForm.controls['confirmPasswordControl'].errors.passwordMatch = false;
       }
    } else  {
      this.confirmPasswordCorrect = true;
      if(this.signInForm.controls['confirmPasswordControl'].errors !== null) {
        this.signInForm.controls['confirmPasswordControl'].errors.passwordMatch = false;
      }  
    }
    
  }


  passwordCorrect() {
    if(this.signInForm !== undefined && this.signInForm.controls['confirmPasswordControl'] !== undefined) {

      if(this.signInForm.controls['confirmPasswordControl'].errors === null) {
        return true;
      }
      else {
        if(this.signInForm.controls['confirmPasswordControl'].errors.passwordMatch === undefined && 
        this.signInForm.controls['confirmPasswordControl'].errors.passwordMatch === null
        ) {
          return true;
        }
        else {
          return false;
        }
      }

    } else {

      return true;
    }

  }

}


