import { ProductsCategory } from "./products-category.interface";
import { ProductsReview } from "./products-review.interface";

export interface Products {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    review: ProductsReview[];
    productsImages: [];
}
