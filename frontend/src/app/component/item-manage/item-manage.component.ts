import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfileDTO } from 'src/app/dto/profileDTO';
import { ItemService } from 'src/app/service/item/item.service';
import { ProfileService } from 'src/app/service/profile/profile.service';
import { ToastifyService } from 'src/app/service/toastify/toastify.service';

@Component({
  selector: 'app-item-manage',
  templateUrl: './item-manage.component.html',
  styleUrls: ['./item-manage.component.css']
})
export class ItemManageComponent implements OnInit {

  profiles: ProfileDTO[] = [];
  conditions = ['None', 'Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
  createForm = this.formBuilder.group({
    name: [null, Validators.required],
    condition: [this.conditions[0], Validators.required],
    price: [null, Validators.required],
    amount: [1, Validators.required],
    profileId: [null, Validators.required]
  });

  constructor(private itemService: ItemService, private profileService: ProfileService,
    private formBuilder: FormBuilder, private toastifyService: ToastifyService) { }

  ngOnInit(): void {
    this.getProfiles();
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

  post(): void {
    const condition = this.createForm.value.condition;

    const itemDTO = {
      name: this.createForm.value.name + (condition != this.conditions[0] ? ` (${condition})` : ''),
      price: this.createForm.value.price,
      amount: this.createForm.value.amount,
      profileId: this.createForm.value.profileId,
    };

    this.itemService.post(itemDTO).subscribe({
      next: () => {
        this.toastifyService.successToast(`Item '${this.createForm.value.name}' successfully added.`);
      },
      error: error => {
        this.toastifyService.errorToast(error.error);
      },
      complete: () => {
        this.reset();
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
