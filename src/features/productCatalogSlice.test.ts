import { describe, expect, it } from "vitest";

import {
  fetchProductCatalog,
  productCatalogReducer,
} from "./productCatalogSlice";
import type {
  Product,
  ProductListQuery,
  ProductListResponse,
} from "@/types/api/productList";

const product = (id: number, category: string): Product => ({
  id,
  name: `Product ${id}`,
  description: "",
  category,
  subCategory: "",
  brand: "Brand",
  rating: 4,
  reviews: 1,
  offers: [],
  variants: [],
});

const query = (category?: string, page = 1): ProductListQuery => ({
  category,
  page,
  pageSize: 20,
  sort: "popularity",
});

const response = (
  products: Product[],
  page = 1,
  totalPages = 1,
): ProductListResponse => ({
  count: products.length,
  page,
  pageSize: 20,
  totalPages,
  products,
});

describe("product catalog state", () => {
  it("clears the previous category products as soon as a new query starts", () => {
    const shoesQuery = query("shoes");
    let state = productCatalogReducer(
      undefined,
      fetchProductCatalog.pending("shoes-request", shoesQuery),
    );
    state = productCatalogReducer(
      state,
      fetchProductCatalog.fulfilled(
        response([product(1, "Shoes")]),
        "shoes-request",
        shoesQuery,
      ),
    );

    state = productCatalogReducer(
      state,
      fetchProductCatalog.pending("clothing-request", query("clothing")),
    );

    expect(state.status).toBe("loading");
    expect(state.products).toEqual([]);
  });

  it("retains loaded products while fetching another page of the same query", () => {
    const firstPageQuery = query("shoes");
    let state = productCatalogReducer(
      undefined,
      fetchProductCatalog.pending("page-one", firstPageQuery),
    );
    state = productCatalogReducer(
      state,
      fetchProductCatalog.fulfilled(
        response([product(1, "Shoes")], 1, 2),
        "page-one",
        firstPageQuery,
      ),
    );

    const secondPageQuery = query("shoes", 2);
    state = productCatalogReducer(
      state,
      fetchProductCatalog.pending("page-two", secondPageQuery),
    );
    expect(state.status).toBe("loadingMore");
    expect(state.products).toHaveLength(1);

    state = productCatalogReducer(
      state,
      fetchProductCatalog.fulfilled(
        response([product(1, "Shoes"), product(2, "Shoes")], 2, 2),
        "page-two",
        secondPageQuery,
      ),
    );

    expect(state.products.map(({ id }) => id)).toEqual([1, 2]);
    expect(state.page).toBe(2);
    expect(state.status).toBe("succeeded");
  });

  it("ignores a stale response after a newer category request starts", () => {
    const shoesQuery = query("shoes");
    let state = productCatalogReducer(
      undefined,
      fetchProductCatalog.pending("shoes-request", shoesQuery),
    );
    state = productCatalogReducer(
      state,
      fetchProductCatalog.pending("clothing-request", query("clothing")),
    );

    state = productCatalogReducer(
      state,
      fetchProductCatalog.fulfilled(
        response([product(1, "Shoes")]),
        "shoes-request",
        shoesQuery,
      ),
    );

    expect(state.products).toEqual([]);
    expect(state.status).toBe("loading");
    expect(state.requestId).toBe("clothing-request");
  });
});
