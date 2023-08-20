import { Component, OnInit } from '@angular/core';

import { ItemSummaryDTO } from 'src/app/dto/itemSummaryDTO';
import { ItemService } from 'src/app/service/item/item.service';
import { ToastifyService } from 'src/app/service/toastify/toastify.service';
import { formatDate, formatPrice } from 'src/app/util/formatter';

@Component({
  selector: 'app-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  itemSummary: ItemSummaryDTO = {} as ItemSummaryDTO;

  constructor(private itemService: ItemService, private toastifyService: ToastifyService) { }

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    this.itemService.get().subscribe({
      next: itemSummary => {
        this.itemSummary = itemSummary;
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        const number = this.itemSummary.failedItems;
        if (number > 0) this.toastifyService.infoToast(`Steam value of ${number} item${number > 1 ? 's' : ''} could not be fetched. Try again later.`);;
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
