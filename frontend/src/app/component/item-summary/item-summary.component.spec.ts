import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSummaryComponent } from './item-summary.component';

describe('ItemSummaryComponent', () => {
  let component: ItemSummaryComponent;
  let fixture: ComponentFixture<ItemSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSummaryComponent]
    });
    fixture = TestBed.createComponent(ItemSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
