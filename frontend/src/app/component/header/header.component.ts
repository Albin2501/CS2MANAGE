import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuItems = [
    {
      name: 'CS2MANAGE',
      link: '/',
      active: true
    },
    {
      name: 'ITEMS',
      link: '/items',
      active: false
    },
    {
      name: 'HISTORY',
      link: '/history',
      active: false
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  makeActive(index: number) {
    for (let i = 0; i < this.menuItems.length; i++) {
      if (i == index) this.menuItems[i].active = true;
      else this.menuItems[i].active = false;
    }
  }
}
