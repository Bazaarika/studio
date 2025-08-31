import { AddProductToCartData, AddProductToCartVariables, GetProductsByCategoryData, GetProductsByCategoryVariables, UpdateProductStockData, UpdateProductStockVariables, ListProductsCreatedByUserData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddProductToCart(options?: useDataConnectMutationOptions<AddProductToCartData, FirebaseError, AddProductToCartVariables>): UseDataConnectMutationResult<AddProductToCartData, AddProductToCartVariables>;
export function useAddProductToCart(dc: DataConnect, options?: useDataConnectMutationOptions<AddProductToCartData, FirebaseError, AddProductToCartVariables>): UseDataConnectMutationResult<AddProductToCartData, AddProductToCartVariables>;

export function useGetProductsByCategory(vars: GetProductsByCategoryVariables, options?: useDataConnectQueryOptions<GetProductsByCategoryData>): UseDataConnectQueryResult<GetProductsByCategoryData, GetProductsByCategoryVariables>;
export function useGetProductsByCategory(dc: DataConnect, vars: GetProductsByCategoryVariables, options?: useDataConnectQueryOptions<GetProductsByCategoryData>): UseDataConnectQueryResult<GetProductsByCategoryData, GetProductsByCategoryVariables>;

export function useUpdateProductStock(options?: useDataConnectMutationOptions<UpdateProductStockData, FirebaseError, UpdateProductStockVariables>): UseDataConnectMutationResult<UpdateProductStockData, UpdateProductStockVariables>;
export function useUpdateProductStock(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductStockData, FirebaseError, UpdateProductStockVariables>): UseDataConnectMutationResult<UpdateProductStockData, UpdateProductStockVariables>;

export function useListProductsCreatedByUser(options?: useDataConnectQueryOptions<ListProductsCreatedByUserData>): UseDataConnectQueryResult<ListProductsCreatedByUserData, undefined>;
export function useListProductsCreatedByUser(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductsCreatedByUserData>): UseDataConnectQueryResult<ListProductsCreatedByUserData, undefined>;
