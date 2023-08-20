import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() type: string = '';
  @Output() get: EventEmitter<void> = new EventEmitter<void>();
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteAll: EventEmitter<void> = new EventEmitter<void>();
  name: string = '';
  sorts = [
    {
      name: 'DATE',
      value: 'date',
      active: false,
      order: true
    },
    {
      name: 'PRICE',
      value: 'totalPrice',
      active: false,
      order: true
    },
    {
      name: 'AMOUNT',
      value: 'amount',
      active: false,
      order: true
    },
    {
      name: 'SKINPORT',
      value: 'totalProfitSP',
      active: false,
      order: true
    },
    {
      name: 'STEAM',
      value: 'totalProfitSCM',
      active: false,
      order: true
    }
  ];
  buttons = [
    {
      name: 'Refresh Prices ⟳',
      value: 'cacheDirty'
    },
    {
      name: 'Delete All 🗑',
      value: 'deleteAll'
    }
  ];
  button = this.buttons[0];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.setSorts();
    this.setButtons();
    this.setObjectsIntial();
  }

  setSorts(): void {
    if (this.type == 'itemManage') this.sorts.splice(this.sorts.length - 2, 2);
  }

  setButtons(): void {
    if (this.type == 'itemSummary') this.button = this.buttons[0];
    if (this.type == 'itemManage') this.button = this.buttons[1];
  }

  setObjectsIntial(): void {
    let existsActiveSort;
    let sort, order, name;

    // gets parameters from browser URL
    this.route.queryParams.subscribe(params => {
      sort = params['sort'];
      order = params['order']
      name = params['name'];
    });

    // sets active sort
    for (let i = 0; i < this.sorts.length; i++) {
      if (sort == this.sorts[i].value) {
        this.sorts[i].active = true;
        existsActiveSort = true;
      }
    }

    // if no sort is active, the sort 'date' is set active
    if (!existsActiveSort) this.sorts[0].active = true;

    // sets correct order of active sort
    for (let i = 0; i < this.sorts.length; i++) {
      if (this.sorts[i].active) this.sorts[i].order = order ? this.getOrderOfString(order) : false;
    }

    // sets name
    if (name) this.name = name;
  }

  setObjects(object: string, value: string): void {
    const queryParams = {} as Params;

    if (object == 'sort') {
      // sets active sort, deactivates all other sorts
      for (let i = 0; i < this.sorts.length; i++) {
        if (value == this.sorts[i].value) {
          this.sorts[i].active = true;
          this.sorts[i].order = !this.sorts[i].order;
        } else {
          this.sorts[i].active = false;
          this.sorts[i].order = true;
        }
      }
    } else if (object == 'name') {
      // sets name
      this.name = value;
    } else if (object == 'cacheDirty') {
      // sets cache dirty
      queryParams[value] = true;
      this.reset.emit();
    }

    queryParams['sort'] = this.getActiveSort().value;
    queryParams['order'] = this.getStringOfOrder(this.getActiveSort().order);
    if (this.name.length > 0) queryParams['name'] = this.name; // empty entries should be ignored

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    }).then(() => {
      this.get.emit();
    });
  }

  deleteAllFunc(): void {
    this.deleteAll.emit();
  }

  getActiveSort() {
    for (let i = 0; i < this.sorts.length; i++) {
      if (this.sorts[i].active) return this.sorts[i];
    }
    return this.sorts[0];
  }

  getOrderOfString(order: string): boolean {
    return order == 'asc' ? true : false;
  }

  getStringOfOrder(bool: boolean): string {
    return bool ? 'asc' : 'desc';
  }

  getRepresentationOfOrder(bool: boolean): string {
    return bool ? ' 🠕' : ' 🠗';
  }

}
