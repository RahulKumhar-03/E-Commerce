import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../../core/interfaces/user.interface';
import { Products } from '../../../core/interfaces/products.interface';
import { MatSelectModule } from '@angular/material/select';
import { ReviewService } from '../../../core/services/reviews/review.service';
import { ProductsReview } from '../../../core/interfaces/products-review.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upsert-reviews-dialog',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule, MatInputModule],
  templateUrl: './upsert-reviews-dialog.component.html',
  styleUrl: './upsert-reviews-dialog.component.scss'
})
export class UpsertReviewsDialogComponent {
  public currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
  public users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  public reviewForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UpsertReviewsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Products, private service: ReviewService){
    this.reviewForm = this.fb.group({
      userId: [this.currentUser.id, Validators.required],
      productId:[data.id, Validators.required],
      comment:['', Validators.required],
      reviewStar: [0, Validators.required],
    })
  }

  public submitReviewForm(){
    if(this.reviewForm.valid){
      const newReview: ProductsReview = {
        id: this.service.getNextReviewId(),
        userId: this.currentUser.id,
        productId: this.data.id,
        comment: this.reviewForm.value.comment,
        reviewStar: this.reviewForm.value.reviewStar
      }
      this.dialogRef.close(newReview);
    }
  }

  public onClose(){
    this.dialogRef.close();
  }
}

