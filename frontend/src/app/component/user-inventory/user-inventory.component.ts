import { Component, OnInit } from '@angular/core';

import { InventoryDTO } from 'src/app/dto/inventoryDTO';
import { ProfileDTO } from 'src/app/dto/profileDTO';
import { ItemService } from 'src/app/service/item/item.service';
import { UserService } from 'src/app/service/user/user.service';
import { ToastifyService } from 'src/app/service/toastify/toastify.service';
import { ProfileService } from 'src/app/service/profile/profile.service';

@Component({
  selector: 'app-user-inventory',
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.css']
})
export class UserInventoryComponent implements OnInit {

  profiles: ProfileDTO[] = [];
  inventory: InventoryDTO = {} as InventoryDTO;

  constructor(private itemService: ItemService, private userService: UserService,
    private profileService: ProfileService, private toastifyService: ToastifyService) { }

  ngOnInit(): void {
    this.getProfiles();
  }

  get(bool: boolean): void {
    this.userService.getSteamItems(bool).subscribe({
      next: inventory => {
        this.inventory = inventory;
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        console.log(this.inventory);
      }
    });
  }

  getProfiles(): void {
    this.profileService.get().subscribe({
      next: profiles => {
        this.profiles = profiles;
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      }
    });
  }

  post(): void {
    this.itemService.postList({ steamId: this.inventory.steamId, items: this.inventory.items }).subscribe({
      next: () => {
        this.toastifyService.successToast(`Inventory of ${this.inventory.steamId} successfully added.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        window.history.back();
      }
    });
  }
}
