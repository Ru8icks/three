import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubeComponent } from './cube/cube.component';
import { ImportComponent } from './import/import.component';

const routes: Routes = [
  {
    path: "1",
    component: CubeComponent
  },
  {
    path: "",
    component: ImportComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
