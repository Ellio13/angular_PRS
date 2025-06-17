import { Component, OnInit } from '@angular/core';
// Update the path below to the correct relative path where MenuItem is defined
import { MenuItem } from '../../model/menu-item';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  title: string = "PRS";
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    //initialize the menu items
    this.menuItems = [
      new MenuItem('User', '/user-list', 'User List'),
      new MenuItem('Vendor', '/vendor-list', 'Vendor List'),
      new MenuItem('Product', '/product-list', 'Product List'),
      new MenuItem('Request', '/request-list', 'Request List'),
      new MenuItem('Line Item', '/line-item-list', 'Line Item List')
    ];
  }
}
