const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const addProductToCartRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddProductToCart', inputVars);
}
addProductToCartRef.operationName = 'AddProductToCart';
exports.addProductToCartRef = addProductToCartRef;

exports.addProductToCart = function addProductToCart(dcOrVars, vars) {
  return executeMutation(addProductToCartRef(dcOrVars, vars));
};

const getProductsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductsByCategory', inputVars);
}
getProductsByCategoryRef.operationName = 'GetProductsByCategory';
exports.getProductsByCategoryRef = getProductsByCategoryRef;

exports.getProductsByCategory = function getProductsByCategory(dcOrVars, vars) {
  return executeQuery(getProductsByCategoryRef(dcOrVars, vars));
};

const updateProductStockRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductStock', inputVars);
}
updateProductStockRef.operationName = 'UpdateProductStock';
exports.updateProductStockRef = updateProductStockRef;

exports.updateProductStock = function updateProductStock(dcOrVars, vars) {
  return executeMutation(updateProductStockRef(dcOrVars, vars));
};

const listProductsCreatedByUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductsCreatedByUser');
}
listProductsCreatedByUserRef.operationName = 'ListProductsCreatedByUser';
exports.listProductsCreatedByUserRef = listProductsCreatedByUserRef;

exports.listProductsCreatedByUser = function listProductsCreatedByUser(dc) {
  return executeQuery(listProductsCreatedByUserRef(dc));
};
