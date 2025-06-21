import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLogin } from './feature/user/login/login';
import { UserList } from './feature/user/user-list/user-list';
import { UserCreate } from './feature/user/user-create/user-create';
import { UserEdit } from './feature/user/user-edit/user-edit';
import { UserDetail } from './feature/user/user-detail/user-detail';

import { VendorList } from './feature/vendor/vendor-list/vendor-list';
import { VendorCreate } from './feature/vendor/vendor-create/vendor-create';
import { VendorEdit } from './feature/vendor/vendor-edit/vendor-edit';
import { VendorDetail } from './feature/vendor/vendor-detail/vendor-detail';

import { ProductList } from './feature/product/product-list/product-list';
import { ProductCreate } from './feature/product/product-create/product-create';
import { ProductEdit } from './feature/product/product-edit/product-edit';
import { ProductDetail } from './feature/product/product-detail/product-detail';

import { RequestList } from './feature/request/request-list/request-list';
import { RequestCreate } from './feature/request/request-create/request-create';
import { RequestEdit } from './feature/request/request-edit/request-edit';
import { RequestDetail } from './feature/request/request-detail/request-detail';
import { RequestLines } from './feature/request/request-lines/request-lines';
import { ReviewComponent } from './feature/request/review/review.component';

import { LineItemList } from './feature/line-item/line-item-list/line-item-list';
import { LineItemCreate } from './feature/line-item/line-item-create/line-item-create';
import { LineItemEdit } from './feature/line-item/line-item-edit/line-item-edit';
import { LineItemDetail } from './feature/line-item/line-item-detail/line-item-detail';

import { NotFound } from './core/not-found/not-found';
import { AuthGuard } from './service/auth-guard';

const routes: Routes = [
  { path: 'login', component: UserLogin },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'user-list', component: UserList },
      { path: 'user-create', component: UserCreate },
      { path: 'user-edit/:id', component: UserEdit },
      { path: 'user-detail/:id', component: UserDetail },

      { path: 'vendor-list', component: VendorList },
      { path: 'vendor-create', component: VendorCreate },
      { path: 'vendor-edit/:id', component: VendorEdit },
      { path: 'vendor-detail/:id', component: VendorDetail },

      { path: 'product-list', component: ProductList },
      { path: 'product-create', component: ProductCreate },
      { path: 'product-edit/:id', component: ProductEdit },
      { path: 'product-detail/:id', component: ProductDetail },

      { path: 'request-list', component: RequestList },
      { path: 'request-create', component: RequestCreate },
      { path: 'request-edit/:id', component: RequestEdit },
      { path: 'request-detail/:id', component: RequestDetail },
      { path: 'request-lines/:id', component: RequestLines },
      { path: 'review', component: ReviewComponent },

      { path: 'line-item-list', component: LineItemList },
      { path: 'line-item-create', component: LineItemCreate },
      { path: 'line-item-edit/:id', component: LineItemEdit },
      { path: 'line-item-detail/:id', component: LineItemDetail },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
