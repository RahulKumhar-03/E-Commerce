import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertCategoryDialogComponent } from './upsert-category-dialog.component';

describe('UpsertCategoryDialogComponent', () => {
  let component: UpsertCategoryDialogComponent;
  let fixture: ComponentFixture<UpsertCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
