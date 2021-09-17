import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent implements OnInit {

  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, title: string}) { 
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
