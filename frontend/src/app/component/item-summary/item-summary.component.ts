import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
  sorts = [
    {
      name: 'DATE',
      value: 'date',
      active: true
    },
    {
      name: 'PRICE',
      value: 'totalPrice',
      active: false
    },
    {
      name: 'AMOUNT',
      value: 'amount',
      active: false
    },
    {
      name: 'PROFIT (SP)',
      value: 'totalProfitSP',
      active: false
    },
    {
      name: 'PROFIT (SCM)',
      value: 'totalProfitSCM',
      active: false
    }
  ];
  orders = [
    {
      name: 'ASCENDING',
      value: 'asc',
      active: false
    },
    {
      name: 'DESCENDING',
      value: 'desc',
      active: true
    }
  ];

  constructor(private itemService: ItemService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.get();
    this.getActive();
  }

  get(): void {
    this.itemService.get().subscribe({
      next: itemSummary => {
        this.itemSummary = itemSummary;
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        this.getActive();
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(new Date(date));
  }

  formatPrice(number: number, bool: boolean): string {
    return formatPrice(number, bool);
  }

  setQueryParams(param: string, value: string): void {
    const queryParams = {} as Params;
    let sort, order;

    this.route.queryParams.subscribe(params => {
      sort = params['sort'];
      order = params['order'];
    });

    if (sort) queryParams['sort'] = sort;
    if (order) queryParams['order'] = order;
    queryParams[param] = value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    }).then(() => this.get());
  }

  getActive(): void {
    let existsActiveSort;
    let existsActiveOrder;
    let sort, order;

    this.route.queryParams.subscribe(params => {
      sort = params['sort'];
      order = params['order'];
    });

    for (let i = 0; i < this.sorts.length; i++) {
      if (sort == this.sorts[i].value) this.sorts[i].active = true;
      else this.sorts[i].active = false;
      if (this.sorts[i].active) existsActiveSort = true;
    }

    for (let i = 0; i < this.orders.length; i++) {
      if (order == this.orders[i].value) this.orders[i].active = true;
      else this.orders[i].active = false;
      if (this.orders[i].active) existsActiveOrder = true;
    }

    if (!existsActiveSort) this.sorts[0].active = true;
    if (!existsActiveOrder) this.orders[1].active = true;
  };
}
