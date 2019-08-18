import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';

//Modulo para las rutas
import { DefaultRoutingModule } from './default-routing.module';

import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';


import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { ZonesComponent } from './zones/zones.component';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';

//Modulo de mapas de google
import { AgmCoreModule } from '@agm/core';

//Modulos para la internacionalizacion
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';



@NgModule({
  declarations: [HomeComponent, MainComponent, ZonesComponent, NavigationBarComponent],
  imports: [

    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    CommonModule,
    DefaultRoutingModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,

    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ]
})
export class DefaultModule { }

//Requerido para la compilacion (AOT) antes de tiempo
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
