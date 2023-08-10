import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ItemDetailDTO } from 'src/app/dto/itemDetailDTO';

import { formatDate, formatPrice } from 'src/app/util/formatter';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnChanges {

  @Input() items: ItemDetailDTO[] = [];
  itemsCopy: ItemDetailDTO[] = [];
  itemShowAmount: number = 5;
  noMoreLoad: boolean = true;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.noMoreLoad) {
      this.initialLoad();
    }
  }

  initialLoad(): void {
    this.itemsCopy = this.items.slice();
    this.items.splice(this.itemShowAmount);
  }

  loadItems(): void {
    this.items = this.itemsCopy;
    this.noMoreLoad = false;
  }

  formatDate(date: Date): string {
    return formatDate(new Date(date));
  }

  formatPrice(number: number, bool: boolean): string {
    return formatPrice(number, bool);
  }
}
