import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-message',
  templateUrl: './simple-message.component.html',
  styleUrls: ['./simple-message.component.css']
})
export class SimpleMessageComponent implements OnInit {

  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, title: string}) { 
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
