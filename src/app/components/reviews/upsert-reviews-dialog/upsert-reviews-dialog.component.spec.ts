import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertReviewsDialogComponent } from './upsert-reviews-dialog.component';

describe('UpsertReviewsDialogComponent', () => {
  let component: UpsertReviewsDialogComponent;
  let fixture: ComponentFixture<UpsertReviewsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertReviewsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertReviewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
