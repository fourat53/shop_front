export * from "./api/client";
export * from "./api/products";
export * from "./api/categories";
export * from "./api/users";
export * from "./api/orders";

import { productsApi } from "./api/products";
import { categoriesApi } from "./api/categories";
import { usersApi } from "./api/users";
import { ordersApi } from "./api/orders";

export const api = {
  ...productsApi,
  ...categoriesApi,
  ...usersApi,
  ...ordersApi,
};
