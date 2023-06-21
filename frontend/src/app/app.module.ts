import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ItemSummaryComponent } from './component/item-summary/item-summary.component';
import { HistoryComponent } from './component/history/history.component';
import { HeaderComponent } from './component/header/header.component';
import { ItemManageComponent } from './component/item-manage/item-manage.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemSummaryComponent,
    HistoryComponent,
    HeaderComponent,
    ItemManageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, HeaderComponent]
})
export class AppModule { }
