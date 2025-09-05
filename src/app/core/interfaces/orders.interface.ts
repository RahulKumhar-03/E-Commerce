import { Products } from "./products.interface";

export interface Orders {
    orderId: number;
    userId: number;
    username: string;
    product: Products;
    quantity: number;
    totalPrice: number;
    date: Date;
}
