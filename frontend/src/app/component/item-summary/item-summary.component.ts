import { Component, OnInit } from '@angular/core';

import { ItemSummaryDTO } from 'src/app/dto/itemSummaryDTO';
import { ItemService } from 'src/app/service/item/item.service';
import { formatDate, formatPrice } from 'src/app/util/formatter';

@Component({
  selector: 'app-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  itemSummary: ItemSummaryDTO = {} as ItemSummaryDTO;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    this.itemService.get().subscribe({
      next: itemSummary => {
        this.itemSummary = itemSummary;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(new Date(date));
  }

  formatPrice(number: number, bool: boolean): string {
    return formatPrice(number, bool);
  }
}
