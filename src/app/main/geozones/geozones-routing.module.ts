import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeozonesComponent } from './geozones.component';

const routes: Routes = [{ path: '', component: GeozonesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeozonesRoutingModule { }
