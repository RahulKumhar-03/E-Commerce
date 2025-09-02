import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpsertReviewsDialogComponent } from '../upsert-reviews-dialog/upsert-reviews-dialog.component';
import { ReviewService } from '../../../core/services/reviews/review.service';
import { ProductsReview } from '../../../core/interfaces/products-review.interface';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-reviews-list',
  imports: [MatIconModule, MatButtonModule, MatDialogModule, MatCardModule],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent implements OnInit {
  public currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
  public reviews: ProductsReview[]= [];

  constructor(private dialog: MatDialog, private service: ReviewService){}
  
  ngOnInit():void{
    this.loadReviews();
  }

  public loadReviews(){
    this.reviews = this.service.getReviewsData();
  }

  public openReviewDialog(){
    let dialogRef = this.dialog.open(UpsertReviewsDialogComponent,{
      width: '500px',
    })

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.service.createReview(data);
        this.loadReviews();
      }
    })
  }

  public deleteReview(reviewId: number){
    this.service.deleteReview(reviewId);
    this.loadReviews();
  }
}
