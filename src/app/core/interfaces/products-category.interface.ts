import { Products } from "./products.interface";

export interface ProductsCategory {
    categoryId: number;
    categoryName: string;
    gst: number;
    products: Products[];
}
