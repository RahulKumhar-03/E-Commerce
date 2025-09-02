import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertInventoryDialogComponent } from './upsert-inventory-dialog.component';

describe('UpsertInventoryDialogComponent', () => {
  let component: UpsertInventoryDialogComponent;
  let fixture: ComponentFixture<UpsertInventoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertInventoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
