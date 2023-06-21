import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemSummaryComponent } from './component/item-summary/item-summary.component';
import { HistoryComponent } from './component/history/history.component';
import { ItemManageComponent } from './component/item-manage/item-manage.component';


const routes: Routes = [
  { path: 'items', component: ItemManageComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', component: ItemSummaryComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
