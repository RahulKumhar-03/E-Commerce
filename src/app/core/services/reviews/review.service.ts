import { Injectable } from '@angular/core';
import { ProductsReview } from '../../interfaces/products-review.interface';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  public reviews: ProductsReview[] = [];

  constructor() { 
    this.reviews = this.loadReviews();
  }

  public loadReviews(){
    const reviews = localStorage.getItem('reviews');
    if(reviews){
      return JSON.parse(reviews);
    }

    const initialReviews: ProductsReview[] = [];
    localStorage.setItem('reviews',JSON.stringify(initialReviews));

    if(!localStorage.getItem('lastReviewId')){
      localStorage.setItem('lastReviewId', '0');
    }

    return initialReviews;
  }

  public getNextReviewId(): number {
    let lastId = parseInt(localStorage.getItem('lastReviewId') || '0', 10);
    lastId++;
    localStorage.setItem('lastReviewId', lastId.toString());
    return lastId;
  }

  public saveReviewsData(){
    localStorage.setItem('reviews', JSON.stringify(this.reviews))
  }

  public getReviewsData(){
    return this.reviews;
  }

  public createReview(newReview: ProductsReview){
    this.reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    this.reviews.push(newReview);
    this.saveReviewsData();
  }

  public deleteReview(reviewId: number){
    this.reviews = this.reviews.filter(review => review.id !== reviewId);
    this.saveReviewsData();
  }
}
