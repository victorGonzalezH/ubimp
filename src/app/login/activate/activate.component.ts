import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMessageComponent } from 'src/app/shared/modals/simple-message/simple-message.component';
import { ApiResultBase, ERROR_CODE } from 'utils';
import { ActivateCommand } from './activate-command.model';
import { ActivateService } from './activate.service';

const SUCCESS_USER_ACTIVATED = 400;
const TOKEN_EXPIRED_ERROR_CODE = 401;

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ActivateComponent implements OnInit {

  private activateToken: string;
  public loading: boolean;
  private messageTitle: string;
  public isActivated: boolean;

 

  constructor(private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private activateService: ActivateService,
    private dialog: MatDialog) { 
    this.loading = false;
    this.isActivated = false;
    // Se establece el lenguaje del navegador al no haber un lenguaje guardado en el storage
    this.translateService.setDefaultLang(navigator.language);
    this.route.queryParams.subscribe(params => {
        
        this.activateToken = params['res'];
    });
  }

  ngOnInit(): void {
  }

  /**
   * 
   * @param event 
   */
  onChange(event: MatSlideToggleChange) {
    this.loading = true;
    const activateCommand: ActivateCommand = { token: this.activateToken, lang: this.translateService.getDefaultLang() };
    this.activateService.activate(activateCommand)
    .subscribe({
      next: (response: ApiResultBase) => {
        console.log(response);
        this.loading = false;
        this.messageTitle = this.translateService.instant('login.activate.title');
        const message = response.userMessage;
          const dialogRef = this.dialog.open(SimpleMessageComponent, {
            data: { title: this.messageTitle, message: message }
          });

          dialogRef.afterClosed().subscribe(result => {
            if(response.resultCode === TOKEN_EXPIRED_ERROR_CODE) {
                this.router.navigate(['login/signin']);
            }

            else if(response.resultCode === SUCCESS_USER_ACTIVATED) {
              this.router.navigate(['login']);
            }

            else if(response.resultCode ===  ERROR_CODE) {
              this.isActivated = false;
            }

          });

      },
      error: (error: any) => {
        this.loading = false;
        this.messageTitle = this.translateService.instant('login.activate.title');
        const message = this.translateService.instant('login.activate.error');
        
        const dialogRef = this.dialog.open(SimpleMessageComponent, {
          data: { title: this.messageTitle, message: message }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.isActivated = false;
        });
      }
    });
  }

}
