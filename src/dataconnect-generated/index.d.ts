import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddProductToCartData {
  cartItem_insert: CartItem_Key;
}

export interface AddProductToCartVariables {
  customerId: UUIDString;
  productId: UUIDString;
  quantity: number;
}

export interface CartItem_Key {
  id: UUIDString;
  __typename?: 'CartItem_Key';
}

export interface GetProductsByCategoryData {
  products: ({
    id: UUIDString;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
  } & Product_Key)[];
}

export interface GetProductsByCategoryVariables {
  category: string;
}

export interface ListProductsCreatedByUserData {
  products: ({
    id: UUIDString;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
  } & Product_Key)[];
}

export interface OrderItem_Key {
  id: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}

export interface UpdateProductStockVariables {
  productId: UUIDString;
  stockQuantity: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddProductToCartRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddProductToCartVariables): MutationRef<AddProductToCartData, AddProductToCartVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddProductToCartVariables): MutationRef<AddProductToCartData, AddProductToCartVariables>;
  operationName: string;
}
export const addProductToCartRef: AddProductToCartRef;

export function addProductToCart(vars: AddProductToCartVariables): MutationPromise<AddProductToCartData, AddProductToCartVariables>;
export function addProductToCart(dc: DataConnect, vars: AddProductToCartVariables): MutationPromise<AddProductToCartData, AddProductToCartVariables>;

interface GetProductsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductsByCategoryVariables): QueryRef<GetProductsByCategoryData, GetProductsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductsByCategoryVariables): QueryRef<GetProductsByCategoryData, GetProductsByCategoryVariables>;
  operationName: string;
}
export const getProductsByCategoryRef: GetProductsByCategoryRef;

export function getProductsByCategory(vars: GetProductsByCategoryVariables): QueryPromise<GetProductsByCategoryData, GetProductsByCategoryVariables>;
export function getProductsByCategory(dc: DataConnect, vars: GetProductsByCategoryVariables): QueryPromise<GetProductsByCategoryData, GetProductsByCategoryVariables>;

interface UpdateProductStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  operationName: string;
}
export const updateProductStockRef: UpdateProductStockRef;

export function updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;
export function updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface ListProductsCreatedByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsCreatedByUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductsCreatedByUserData, undefined>;
  operationName: string;
}
export const listProductsCreatedByUserRef: ListProductsCreatedByUserRef;

export function listProductsCreatedByUser(): QueryPromise<ListProductsCreatedByUserData, undefined>;
export function listProductsCreatedByUser(dc: DataConnect): QueryPromise<ListProductsCreatedByUserData, undefined>;

