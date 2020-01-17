import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
//import { HomeComponent } from './internal/default/home/home.component';



const routes: Routes =
[
  {
    path: '',
    component: MainComponent,
    children:
    [
        {  path: '', component: HomeComponent }

    ] 
  }
  
  //,{
    //path: 'home',
    //component: HomeComponent
    //data: { falseUrl: '/login'} 
    // loadChildren: () => import('./internal/default/default.module').then(mod => mod.DefaultModule)
  //}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
