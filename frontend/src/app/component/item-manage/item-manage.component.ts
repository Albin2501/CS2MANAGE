import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ItemDTO } from 'src/app/dto/itemDTO';
import { ProfileDTO } from 'src/app/dto/profileDTO';
import { UserDTO } from 'src/app/dto/userDTO';
import { ItemService } from 'src/app/service/item/item.service';
import { ProfileService } from 'src/app/service/profile/profile.service';
import { ToastifyService } from 'src/app/service/toastify/toastify.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-item-manage',
  templateUrl: './item-manage.component.html',
  styleUrls: ['./item-manage.component.css']
})
export class ItemManageComponent implements OnInit {

  items: ItemDTO[] = [];
  profiles: ProfileDTO[] = [];
  user: UserDTO = {} as UserDTO;
  group: boolean = true;
  editMode: boolean = false;
  conditions = ['None', 'Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
  createForm = this.formBuilder.group({
    name: [null, Validators.required],
    condition: [this.conditions[0], Validators.required],
    price: [null, Validators.required],
    amount: [1, Validators.required],
    profileId: [null, Validators.required]
  });
  warned: boolean = false;

  constructor(private itemService: ItemService, private profileService: ProfileService,
    private userService: UserService, private formBuilder: FormBuilder,
    private toastifyService: ToastifyService) { }

  ngOnInit(): void {
    this.get();
    this.getProfiles();
    this.getUser();
  }

  get(): void {
    this.itemService.getOverview().subscribe({
      next: items => {
        this.items = items;
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
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
      },
      complete: () => {
        this.reset();
      }
    });
  }

  getUser(): void {
    this.userService.get().subscribe({
      next: user => {
        this.user = user;
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      }
    });
  }

  post(): void {
    const condition = this.createForm.value.condition;

    const itemCreateDTO = {
      name: this.createForm.value.name + (condition != this.conditions[0] ? ` (${condition})` : ''),
      image: null,
      price: this.createForm.value.price,
      amount: this.createForm.value.amount,
      profileId: this.createForm.value.profileId,
    };

    this.itemService.post(itemCreateDTO).subscribe({
      next: () => {
        this.toastifyService.successToast(`Item '${this.createForm.value.name}' successfully added.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        this.reset();
        this.get();
      }
    });
  }

  editUser(): void {
    this.userService.edit(this.user).subscribe({
      next: () => {
        this.toastifyService.successToast(`Steam ID successfully edited.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      }
    });
  }

  warnUser(): void {
    this.warned = !this.warned;
  }

  deleteAll(): void {
    this.warned = false;
    this.itemService.deleteAll().subscribe({
      next: () => {
        this.toastifyService.successToast(`All items successfully deleted.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        this.get();
      }
    });
  }

  reset(): void {
    this.createForm = this.initialForm();
  }

  initialForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      condition: [this.conditions[0], Validators.required],
      price: [null, Validators.required],
      amount: [1, Validators.required],
      profileId: [this.profiles[0].id, Validators.required]
    });
  }
}
