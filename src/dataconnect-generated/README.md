# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetProductsByCategory*](#getproductsbycategory)
  - [*ListProductsCreatedByUser*](#listproductscreatedbyuser)
- [**Mutations**](#mutations)
  - [*AddProductToCart*](#addproducttocart)
  - [*UpdateProductStock*](#updateproductstock)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetProductsByCategory
You can execute the `GetProductsByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProductsByCategory(vars: GetProductsByCategoryVariables): QueryPromise<GetProductsByCategoryData, GetProductsByCategoryVariables>;

interface GetProductsByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductsByCategoryVariables): QueryRef<GetProductsByCategoryData, GetProductsByCategoryVariables>;
}
export const getProductsByCategoryRef: GetProductsByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductsByCategory(dc: DataConnect, vars: GetProductsByCategoryVariables): QueryPromise<GetProductsByCategoryData, GetProductsByCategoryVariables>;

interface GetProductsByCategoryRef {
  ...
  (dc: DataConnect, vars: GetProductsByCategoryVariables): QueryRef<GetProductsByCategoryData, GetProductsByCategoryVariables>;
}
export const getProductsByCategoryRef: GetProductsByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductsByCategoryRef:
```typescript
const name = getProductsByCategoryRef.operationName;
console.log(name);
```

### Variables
The `GetProductsByCategory` query requires an argument of type `GetProductsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductsByCategoryVariables {
  category: string;
}
```
### Return Type
Recall that executing the `GetProductsByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductsByCategoryData {
  products: ({
    id: UUIDString;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
  } & Product_Key)[];
}
```
### Using `GetProductsByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProductsByCategory, GetProductsByCategoryVariables } from '@dataconnect/generated';

// The `GetProductsByCategory` query requires an argument of type `GetProductsByCategoryVariables`:
const getProductsByCategoryVars: GetProductsByCategoryVariables = {
  category: ..., 
};

// Call the `getProductsByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProductsByCategory(getProductsByCategoryVars);
// Variables can be defined inline as well.
const { data } = await getProductsByCategory({ category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProductsByCategory(dataConnect, getProductsByCategoryVars);

console.log(data.products);

// Or, you can use the `Promise` API.
getProductsByCategory(getProductsByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `GetProductsByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductsByCategoryRef, GetProductsByCategoryVariables } from '@dataconnect/generated';

// The `GetProductsByCategory` query requires an argument of type `GetProductsByCategoryVariables`:
const getProductsByCategoryVars: GetProductsByCategoryVariables = {
  category: ..., 
};

// Call the `getProductsByCategoryRef()` function to get a reference to the query.
const ref = getProductsByCategoryRef(getProductsByCategoryVars);
// Variables can be defined inline as well.
const ref = getProductsByCategoryRef({ category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductsByCategoryRef(dataConnect, getProductsByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## ListProductsCreatedByUser
You can execute the `ListProductsCreatedByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProductsCreatedByUser(): QueryPromise<ListProductsCreatedByUserData, undefined>;

interface ListProductsCreatedByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsCreatedByUserData, undefined>;
}
export const listProductsCreatedByUserRef: ListProductsCreatedByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductsCreatedByUser(dc: DataConnect): QueryPromise<ListProductsCreatedByUserData, undefined>;

interface ListProductsCreatedByUserRef {
  ...
  (dc: DataConnect): QueryRef<ListProductsCreatedByUserData, undefined>;
}
export const listProductsCreatedByUserRef: ListProductsCreatedByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsCreatedByUserRef:
```typescript
const name = listProductsCreatedByUserRef.operationName;
console.log(name);
```

### Variables
The `ListProductsCreatedByUser` query has no variables.
### Return Type
Recall that executing the `ListProductsCreatedByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsCreatedByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsCreatedByUserData {
  products: ({
    id: UUIDString;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
  } & Product_Key)[];
}
```
### Using `ListProductsCreatedByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductsCreatedByUser } from '@dataconnect/generated';


// Call the `listProductsCreatedByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductsCreatedByUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductsCreatedByUser(dataConnect);

console.log(data.products);

// Or, you can use the `Promise` API.
listProductsCreatedByUser().then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListProductsCreatedByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsCreatedByUserRef } from '@dataconnect/generated';


// Call the `listProductsCreatedByUserRef()` function to get a reference to the query.
const ref = listProductsCreatedByUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsCreatedByUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddProductToCart
You can execute the `AddProductToCart` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addProductToCart(vars: AddProductToCartVariables): MutationPromise<AddProductToCartData, AddProductToCartVariables>;

interface AddProductToCartRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddProductToCartVariables): MutationRef<AddProductToCartData, AddProductToCartVariables>;
}
export const addProductToCartRef: AddProductToCartRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addProductToCart(dc: DataConnect, vars: AddProductToCartVariables): MutationPromise<AddProductToCartData, AddProductToCartVariables>;

interface AddProductToCartRef {
  ...
  (dc: DataConnect, vars: AddProductToCartVariables): MutationRef<AddProductToCartData, AddProductToCartVariables>;
}
export const addProductToCartRef: AddProductToCartRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addProductToCartRef:
```typescript
const name = addProductToCartRef.operationName;
console.log(name);
```

### Variables
The `AddProductToCart` mutation requires an argument of type `AddProductToCartVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddProductToCartVariables {
  customerId: UUIDString;
  productId: UUIDString;
  quantity: number;
}
```
### Return Type
Recall that executing the `AddProductToCart` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddProductToCartData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddProductToCartData {
  cartItem_insert: CartItem_Key;
}
```
### Using `AddProductToCart`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addProductToCart, AddProductToCartVariables } from '@dataconnect/generated';

// The `AddProductToCart` mutation requires an argument of type `AddProductToCartVariables`:
const addProductToCartVars: AddProductToCartVariables = {
  customerId: ..., 
  productId: ..., 
  quantity: ..., 
};

// Call the `addProductToCart()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addProductToCart(addProductToCartVars);
// Variables can be defined inline as well.
const { data } = await addProductToCart({ customerId: ..., productId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addProductToCart(dataConnect, addProductToCartVars);

console.log(data.cartItem_insert);

// Or, you can use the `Promise` API.
addProductToCart(addProductToCartVars).then((response) => {
  const data = response.data;
  console.log(data.cartItem_insert);
});
```

### Using `AddProductToCart`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addProductToCartRef, AddProductToCartVariables } from '@dataconnect/generated';

// The `AddProductToCart` mutation requires an argument of type `AddProductToCartVariables`:
const addProductToCartVars: AddProductToCartVariables = {
  customerId: ..., 
  productId: ..., 
  quantity: ..., 
};

// Call the `addProductToCartRef()` function to get a reference to the mutation.
const ref = addProductToCartRef(addProductToCartVars);
// Variables can be defined inline as well.
const ref = addProductToCartRef({ customerId: ..., productId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addProductToCartRef(dataConnect, addProductToCartVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cartItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cartItem_insert);
});
```

## UpdateProductStock
You can execute the `UpdateProductStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductStockRef:
```typescript
const name = updateProductStockRef.operationName;
console.log(name);
```

### Variables
The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductStockVariables {
  productId: UUIDString;
  stockQuantity: number;
}
```
### Return Type
Recall that executing the `UpdateProductStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProductStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProductStock, UpdateProductStockVariables } from '@dataconnect/generated';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  productId: ..., 
  stockQuantity: ..., 
};

// Call the `updateProductStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProductStock(updateProductStockVars);
// Variables can be defined inline as well.
const { data } = await updateProductStock({ productId: ..., stockQuantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProductStock(dataConnect, updateProductStockVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProductStock(updateProductStockVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProductStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductStockRef, UpdateProductStockVariables } from '@dataconnect/generated';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  productId: ..., 
  stockQuantity: ..., 
};

// Call the `updateProductStockRef()` function to get a reference to the mutation.
const ref = updateProductStockRef(updateProductStockVars);
// Variables can be defined inline as well.
const ref = updateProductStockRef({ productId: ..., stockQuantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductStockRef(dataConnect, updateProductStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

