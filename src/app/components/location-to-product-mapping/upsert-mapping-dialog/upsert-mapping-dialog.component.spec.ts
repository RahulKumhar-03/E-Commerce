import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertMappingDialogComponent } from './upsert-mapping-dialog.component';

describe('UpsertMappingDialogComponent', () => {
  let component: UpsertMappingDialogComponent;
  let fixture: ComponentFixture<UpsertMappingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertMappingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
