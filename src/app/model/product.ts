import { Vendor } from "./vendor";

export class Product {
 id: number; // primary key, internally generated
 vendorId: number; // FK to Vendor
 vendor?: Vendor; // Vendor object for display
 partNumber: string; // string of 50 characters
 name: string; // string of 150 characters
 price: number; // 10 digits, 2 decimal places
 unit: string; // nullable, string of 255 characters
 photoPath: string; // string of 255 characters

constructor(
    id: number = 0,
    vendorId: number = 0,
    partNumber: string = '',
    name: string = '',
    price: number = 0.00,
    unit: string = '',
    photoPath: string = ''
)
{
    this.id = id;
    this.vendorId = vendorId;
    this.partNumber = partNumber;
    this.name = name;
    this.price = price;
    this.unit = unit;
    this.photoPath = photoPath;
}
}
