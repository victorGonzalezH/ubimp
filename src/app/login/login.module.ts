import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Material modules
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
// Modulos para la internacionalizacion
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { LoginService } from './login.service';
import { DataService } from 'utils';
import { SigninComponent } from './signin/signin.component';

import { SigninService } from './signin/signin.service';

@NgModule({
  declarations: [LoginComponent, SigninComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    FlexLayoutModule
  ],
  providers: [LoginService, DataService, Location, SigninService ]
})
export class LoginModule { }
