import { Product } from "./product";
import { Request } from "./request";

export class LineItem {
    id: number;
    requestId: number;
    productId: number;
    quantity: number;

    request?: Request;
    product?: Product;

    constructor(id: number =0,
        requestId: number = 0,
        productId: number = 0,
        quantity: number = 0) {

            this.id = id;
            this.requestId = requestId;
            this.productId = productId;
            this.quantity = quantity;
        }
    }


