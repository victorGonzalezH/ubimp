import {ChangeDetectorRef, OnInit, Component, OnDestroy, HostListener} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';
import {MessengerService, StorageService} from 'utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy 
{

  // mobileQuery almacena informacion de un mediaquery aplicado a un documento.
  public mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  // Mode de operacion del sidenav
  sideNavMode: string;
  public currentRoute: string;

  // media: MediaMatcher. Clase de Aagular material.
   constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private translateService: TranslateService, private messengerService: MessengerService, private router: Router)  {
     
     // Se establece ingles como idioma por default.
      this.translateService.setDefaultLang('en');
      
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this.mobileQueryListener = () => {
          changeDetectorRef.detectChanges();
          
      };

      this.mobileQuery.addListener(this.mobileQueryListener);
      
      
   }


   calculateSideNavMode(windowWidth: number): string {
      if(windowWidth <= 600 ) 
      {
        return 'over';
      } 
      else if(windowWidth > 600 && windowWidth <= 900) 
      {
         return 'push';
      } 
      else
      {
        return 'side';
      }
   }


  ngOnInit() {
    this.sideNavMode = this.calculateSideNavMode(window.innerWidth);

    this.translateService.get(this.getRouteTranslateKey(this.router.url)).subscribe(value => this.currentRoute = value);
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) 
  {
    this.sideNavMode = this.calculateSideNavMode(window.innerWidth);
    
    
  }


  settingsTogle() {
      this.messengerService.sendStringMessage('settings_button_click');
  }

  /**
   * 
   * @param routeName 
   */
  getRouteTranslateKey(routeName: string): string {

    switch(routeName) {
 
      case '/home': 
        return 'main.items.item1';
      case '/geozones': 
        return 'main.items.item2';
      case '/settings': 
        return 'main.items.item3';
    }

  }

  onActivateComponent(event) {
    console.log(this.router.url);
    this.translateService
    .get(this.getRouteTranslateKey(this.router.url))
    .subscribe(value => 
      {

        this.currentRoute = value;
        console.log(this.currentRoute);

      }
        
      );
    // switch(this.router.url) {

      
    //   case '/home': 
    //     this.currentRoute = this.translateService.instant('main.items.item1');
    //     console.log(this.currentRoute);
    //   break;
    //   case '/geozones': 
    //     this.currentRoute = this.translateService.instant('main.items.item2');
    //     console.log(this.currentRoute);
    //   break;
    //   case '/settings': 
    //     this.currentRoute = this.translateService.instant('main.items.item3');
    //     console.log(this.currentRoute);
    //   break;
    // }
    
    
  }

}