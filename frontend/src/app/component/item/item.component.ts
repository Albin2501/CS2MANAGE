import { Component, OnInit, OnChanges, EventEmitter, SimpleChanges, Input, Output } from '@angular/core';

import { ItemDTO } from 'src/app/dto/itemDTO';
import { ProfileDTO } from 'src/app/dto/profileDTO';
import { ItemService } from 'src/app/service/item/item.service';
import { ProfileService } from 'src/app/service/profile/profile.service';
import { ToastifyService } from 'src/app/service/toastify/toastify.service';
import { formatDate } from 'src/app/util/formatter';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnChanges {

  @Input() items: ItemDTO[] = [];
  @Output() get: EventEmitter<void> = new EventEmitter<void>();
  itemsCopy: ItemDTO[] = [];
  profiles: ProfileDTO[] = [];
  itemShowAmount: number = 5;
  noMoreLoad: boolean = true;

  constructor(private itemService: ItemService, private profileService: ProfileService,
    private toastifyService: ToastifyService) { }

  ngOnInit(): void {
    this.getProfiles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.noMoreLoad) {
      this.initialLoad();
    }
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

  edit(item: ItemDTO): void {
    const itemEditDTO = {
      id: item.id,
      price: item.price,
      amount: item.amount,
      profileId: item.profileId
    };

    this.itemService.edit(itemEditDTO).subscribe({
      next: () => {
        this.toastifyService.successToast(`Item '${item.name}' successfully edited.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        this.get.emit();
      }
    });
  }

  delete(id: number, name: string): void {
    this.itemService.delete(id).subscribe({
      next: () => {
        this.toastifyService.successToast(`Item '${name}' successfully deleted.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        this.get.emit();
      }
    });
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
}
