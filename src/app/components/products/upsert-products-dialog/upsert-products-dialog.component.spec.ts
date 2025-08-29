import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertProductsDialogComponent } from './upsert-products-dialog.component';

describe('UpsertProductsDialogComponent', () => {
  let component: UpsertProductsDialogComponent;
  let fixture: ComponentFixture<UpsertProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertProductsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
