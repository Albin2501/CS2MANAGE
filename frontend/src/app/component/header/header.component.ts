import { Component, OnInit } from '@angular/core';

import { frontendBase } from '../../util/config';

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
      active: false
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
    },
    {
      name: 'LOADING',
      link: '/loading',
      active: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.getActiveTab();
  }

  getActiveTab(): void {
    // TODO: This is a work-around. Fix this.
    setTimeout(() => {
      const currentURL = window.location.href;
      const currentLink = currentURL.replace(frontendBase, '');
      let existsActive;

      for (let i = 0; i < this.menuItems.length; i++) {
        if (currentLink == this.menuItems[i].link) this.menuItems[i].active = true;
        else this.menuItems[i].active = false;
      }

      for (let i = 0; i < this.menuItems.length; i++) {
        if (this.menuItems[i].active) existsActive = true;
      }

      if (!existsActive) this.menuItems[0].active = true;
    }, 0);
  }
}
