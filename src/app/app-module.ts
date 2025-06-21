import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Menu } from './core/menu/menu';
import { NotFound } from './core/not-found/not-found';

import { AuthService } from './service/auth-service';
import { AuthGuard } from './service/auth-guard'; // ✅ Adjusted path

// User components
import { UserLogin } from './feature/user/login/login';
import { UserCreate } from './feature/user/user-create/user-create';
import { UserList } from './feature/user/user-list/user-list';
import { UserEdit } from './feature/user/user-edit/user-edit';
import { UserDetail } from './feature/user/user-detail/user-detail';

// Vendor components
import { VendorCreate } from './feature/vendor/vendor-create/vendor-create';
import { VendorList } from './feature/vendor/vendor-list/vendor-list';
import { VendorEdit } from './feature/vendor/vendor-edit/vendor-edit';
import { VendorDetail } from './feature/vendor/vendor-detail/vendor-detail';

// Product components
import { ProductCreate } from './feature/product/product-create/product-create';
import { ProductList } from './feature/product/product-list/product-list';
import { ProductEdit } from './feature/product/product-edit/product-edit';
import { ProductDetail } from './feature/product/product-detail/product-detail';

// Request components
import { RequestCreate } from './feature/request/request-create/request-create';
import { RequestList } from './feature/request/request-list/request-list';
import { RequestEdit } from './feature/request/request-edit/request-edit';
import { RequestDetail } from './feature/request/request-detail/request-detail';
import { RequestLines } from './feature/request/request-lines/request-lines';

// LineItem components
import { LineItemCreate } from './feature/line-item/line-item-create/line-item-create';
import { LineItemList } from './feature/line-item/line-item-list/line-item-list';
import { LineItemEdit } from './feature/line-item/line-item-edit/line-item-edit';
import { LineItemDetail } from './feature/line-item/line-item-detail/line-item-detail';

@NgModule({
  declarations: [
    App,
    Menu,
    NotFound,

    // User
    UserLogin,
    UserCreate,
    UserList,
    UserEdit,
    UserDetail,

    // Vendor
    VendorCreate,
    VendorList,
    VendorEdit,
    VendorDetail,

    // Product
    ProductCreate,
    ProductList,
    ProductEdit,
    ProductDetail,

    // Request
    RequestCreate,
    RequestList,
    RequestEdit,
    RequestDetail,
    RequestLines,

    // Line Item
    LineItemCreate,
    LineItemList,
    LineItemEdit,
    LineItemDetail,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [App]
})
export class AppModule {}
