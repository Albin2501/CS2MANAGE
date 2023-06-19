import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemSummaryComponent } from './component/item-summary/item-summary.component';
import { HistoryComponent } from './component/history/history.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent, title: 'HISTORY' },
  { path: '**', component: ItemSummaryComponent, title: 'CS2MANAGE' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
