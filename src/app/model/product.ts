import { Vendor } from "./vendor";

export class Product {
 id: number; // primary key, internally generated
 vendor: Vendor; // FK to Vendor, internally generated
 partNumber: string; // string of 50 characters
 name: string; // string of 150 characters
 price: number; // 10 digits, 2 decimal places
 unit: string; // nullable, string of 255 characters
 photoPath: string; // string of 255 characters
email: any;
vendorId: any;

constructor(id: number = 0,
    vendor: Vendor = new Vendor(),
    partNumber: string = '',
    name: string = '',
    price: number = 0.00,
    unit: string = '',
    photoPath: string = ''
)
{
    this.id = id;
    this.vendor = vendor;
    this.partNumber = partNumber;
    this.name = name;
    this.price = price;
    this.unit = unit;
    this.photoPath = photoPath;
}
}

