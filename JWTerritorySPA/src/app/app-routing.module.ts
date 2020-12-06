import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TerritoriesComponent } from './fetch-data/territories.component';
import { TerritoryLastRecordComponent } from './export/territorylastrecord.component';

const routes: Routes = [
  {
    path: 'fetch-data',
    component: FetchDataComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'territory/:section',
    component: TerritoriesComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'territorylastrecord',
    component: TerritoryLastRecordComponent,
    canActivate: [MsalGuard]
  }
  ,
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
