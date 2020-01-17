import {ChangeDetectorRef, OnInit, Component, OnDestroy, HostListener} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {TranslateService} from '@ngx-translate/core';
import {MessengerService} from 'utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy 
{

  //mobileQuery almacena informacion de un mediaquery aplicado a un documento.
  private mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  //Mode de operacion del sidenav
  sideNavMode: string;

  //media: MediaMatcher. Clase de Aagular material.
   constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, translateService: TranslateService, private messengerService: MessengerService) 
   {
     //Se establece ingles como idioma por default.
      translateService.setDefaultLang('en');
      

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this.mobileQueryListener = () => {
          changeDetectorRef.detectChanges();
          
      };

      this.mobileQuery.addListener(this.mobileQueryListener);
      
      
   }


   calculateSideNavMode(windowWidth: number): string
   {
      if(windowWidth <= 600 ) 
      {
        return 'over';
      } 
      else if(windowWidth > 600 && windowWidth <= 900) 
      {
         return 'side';
      } 
      else
      {
        return 'push';
      }
   }


  ngOnInit() 
  {
    this.sideNavMode = this.calculateSideNavMode(window.innerWidth);
  }

  ngOnDestroy(): void 
  {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) 
  {
    this.sideNavMode = this.calculateSideNavMode(window.innerWidth);
  }


  settingsTogle()
  {
      this.messengerService.sendStringMessage('settings_button_click');
  }

}
