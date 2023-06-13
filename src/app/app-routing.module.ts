import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubeComponent } from './cube/cube.component';
import { ImportComponent } from './import/import.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  {
    path: "1",
    component: CubeComponent
  },
  {
    path: "2",
    component: ImportComponent
  },
  {
    path: "",
    component: WeatherComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
