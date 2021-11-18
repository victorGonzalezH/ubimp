import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PortalModule} from '@angular/cdk/portal';
import {UtilsModule, StorageService, MessengerService, GeolocationService, RealtimeService, DataService, ErrorInterceptor, JwtInterceptor} from 'utils';
import {AppConfigService} from './shared/services/app-config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material modules
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTabsModule } from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

// Modulo de mapas de google
// import { AgmCoreModule } from '@agm/core';

// Modulos para la internacionalizacion
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


// Modulo de configuracion de las rutas
import { AppRoutingModule } from './app-routing.module';

// Importacion de los componentes
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { SimpleMessageComponent } from './shared/modals/simple-message/simple-message.component';




@NgModule({
  exports: [],
  declarations: [
    AppComponent,
    SimpleMessageComponent,
  ],
  imports:
  [
    BrowserAnimationsModule,
    BrowserModule,
    PortalModule,
    AppRoutingModule,
    UtilsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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
    MatDialogModule, //Modulo para los dialogos
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })

  ],
  providers: [StorageService, MessengerService, GeolocationService, RealtimeService, AppConfigService, DataService, Location, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public matIconRegistry: MatIconRegistry) {
    // matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

 }

// Requerido para la compilacion (AOT) antes de tiempo
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}