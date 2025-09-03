import { FormArray } from "@angular/forms";
import { ProductsReview } from "./products-review.interface";

export interface Products {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: number;
    review: ProductsReview[];
    productsImages: string[];
}
