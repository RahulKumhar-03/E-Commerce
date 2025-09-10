import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertDeliveryDialogComponent } from './upsert-delivery-dialog.component';

describe('UpsertDeliveryDialogComponent', () => {
  let component: UpsertDeliveryDialogComponent;
  let fixture: ComponentFixture<UpsertDeliveryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertDeliveryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertDeliveryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
