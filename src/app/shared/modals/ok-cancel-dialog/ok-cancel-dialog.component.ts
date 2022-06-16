import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ok-cancel-dialog',
  templateUrl: './ok-cancel-dialog.component.html',
  styleUrls: ['./ok-cancel-dialog.component.css']
})
export class OkCancelDialogComponent implements OnInit {

  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, title: string}, translateService: TranslateService) { 
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
