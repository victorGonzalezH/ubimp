import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  /*Formulario de login */
  public addVehicleFormControl: FormGroup;
  
  constructor() { }

  ngOnInit(): void {

    // Inicializacion del formulario para la autenticacion
    this.addVehicleFormControl = new FormGroup(
      {

        vehicleNameControl: new FormControl('', [Validators.required]),
      });

  }

  
  onSubmit() {

  }

}
