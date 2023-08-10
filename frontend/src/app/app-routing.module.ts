import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemSummaryComponent } from './component/item-summary/item-summary.component';
import { HistoryComponent } from './component/history/history.component';
import { ItemManageComponent } from './component/item-manage/item-manage.component';
import { UserComponent } from './component/user/user.component';
import { UserInventoryComponent } from './component/user-inventory/user-inventory.component';

const routes: Routes = [
  { path: 'items', component: ItemManageComponent },
  { path: 'items/inventory', component: UserInventoryComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'user', component: UserComponent },
  { path: '**', component: ItemSummaryComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
