import { Cart } from "./cart.interface";

export interface User {
    id: number;
    name: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    cart: Cart[];
}
