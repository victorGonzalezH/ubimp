import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PortalModule} from '@angular/cdk/portal';
import {UtilsModule, StorageService, MessengerService, GeolocationService} from 'utils';
import { FormsModule } from '@angular/forms';

//Material modules
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

//Modulo de mapas de google
import { AgmCoreModule } from '@agm/core';

//Modulos para la internacionalizacion
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


//Modulo de configuracion de las rutas
import { AppRoutingModule } from './app-routing.module';

//Importacion de los componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { EsriMapComponent } from './esri-map/esri-map.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainComponent,
    EsriMapComponent
    
  ],
  imports:
  [
    BrowserAnimationsModule,
    BrowserModule,
    PortalModule,
    AppRoutingModule,
    UtilsModule,
    FormsModule,

    AgmCoreModule.forRoot({
      apiKey: ''
    }),

    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSlideToggleModule,

    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })

  ],
  providers: [StorageService, MessengerService, GeolocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

//Requerido para la compilacion (AOT) antes de tiempo
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}