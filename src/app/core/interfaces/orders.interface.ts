import { Cart } from "./cart.interface";
import { Products } from "./products.interface";

export interface Orders {
    orderId: number;
    userId: number;
    username: string;
    items: Cart[];
    totalPrice: number;
    date: Date;
}
