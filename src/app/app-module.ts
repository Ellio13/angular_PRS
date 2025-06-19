import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Menu } from './core/menu/menu';
import { NotFound } from './core/not-found/not-found';
//user
import { UserCreate } from './feature/user/user-create/user-create';
import { UserList } from './feature/user/user-list/user-list';
import { UserDetail } from './feature/user/user-detail/user-detail';
import { UserEdit } from './feature/user/user-edit/user-edit';
//vendor
import { VendorCreate } from './feature/vendor/vendor-create/vendor-create';
import { VendorList } from './feature/vendor/vendor-list/vendor-list';
import { VendorEdit } from './feature/vendor/vendor-edit/vendor-edit';
import { VendorDetail } from './feature/vendor/vendor-detail/vendor-detail';
//product
import { ProductCreate } from './feature/product/product-create/product-create';
import { ProductList } from './feature/product/product-list/product-list';
import { ProductEdit } from './feature/product/product-edit/product-edit';
import { ProductDetail } from './feature/product/product-detail/product-detail';
//request
import { RequestCreate } from './feature/request/request-create/request-create';
import { RequestList } from './feature/request/request-list/request-list';
import { RequestEdit } from './feature/request/request-edit/request-edit';
import { RequestDetail } from './feature/request/request-detail/request-detail';
import { RequestLines } from './feature/request/request-lines/request-lines';
//line item
import { LineItemCreate } from './feature/line-item/line-item-create/line-item-create';
import { LineItemList } from './feature/line-item/line-item-list/line-item-list';
import { LineItemEdit } from './feature/line-item/line-item-edit/line-item-edit';
import { LineItemDetail } from './feature/line-item/line-item-detail/line-item-detail';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@NgModule({
  declarations: [
    App,
    Menu,
    NotFound,
    //user
    UserCreate,
    UserList,
    UserDetail,
    UserEdit,
    //vendor
    VendorCreate,
    VendorList,
    VendorEdit,
    VendorDetail,
    //product
    ProductCreate,
    ProductList,
    ProductEdit,
    ProductDetail,
    //request
    RequestCreate,
    RequestList,
    RequestEdit,
    RequestDetail,
    
    //line item
    LineItemCreate,
    LineItemList,
    LineItemEdit,
    LineItemDetail,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }


