import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemManageComponent } from './item-manage.component';

describe('ItemManageComponent', () => {
  let component: ItemManageComponent;
  let fixture: ComponentFixture<ItemManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemManageComponent]
    });
    fixture = TestBed.createComponent(ItemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
