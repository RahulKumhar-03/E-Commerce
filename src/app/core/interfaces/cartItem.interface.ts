import { Products } from "./products.interface";

export interface CartItem{
    product: Products;
    quantity: number;
}