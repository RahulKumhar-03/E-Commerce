import { Products } from "./products.interface";

export interface ProductsCategory {
    categoryId: number;
    categoryName: string;
    products: Products[];
}
