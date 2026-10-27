import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { useToast } from "@/contexts/ToastContext";
import { fetchProductCatalog } from "@/features/productCatalogSlice";
import {
  addWishlistProduct,
  fetchWishlist,
  removeWishlistProduct,
} from "@/features/wishlistSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { addCartItem } from "@/services/api";
import type {
  Product,
  ProductListSort,
} from "@/types/api/productList";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import ProductListPresenter, {
  type ProductFilters,
  type ProductSort,
} from "../presenter/ProductListPresenter";

const createEmptyFilters = (): ProductFilters => ({
  brand: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
});

const PRICE_LIMIT = 100_000;

const getOptionalFilterNumber = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue ? Number(trimmedValue) : undefined;
};

const toCategorySlug = (category: string) =>
  category
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toApiSort = (sort: ProductSort): ProductListSort => {
  switch (sort) {
    case "price-low":
      return "price_asc";
    case "price-high":
      return "price_desc";
    case "rating":
      return "rating";
    case "popularity":
      return "popularity";
  }
};

const ProductListContainer = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const wishlistEntries = useSelector(
    (state: RootState) => state.wishlist.entries,
  );
  const favoriteIds = useMemo(
    () => wishlistEntries.map((entry) => entry.product_id),
    [wishlistEntries],
  );
  const wishlistStatus = useSelector(
    (state: RootState) => state.wishlist.status,
  );
  const accessToken = useSelector(
    (state: RootState) => state.user.accessToken,
  );
  const {
    products,
    status,
    error,
    page,
    totalPages,
    count,
  } = useSelector(
    (state: RootState) => state.productCatalog,
  );
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );
  const {
    category: routeCategory,
    NameDescriptionsearch: routeSearch,
  } = useLocalSearchParams<{
    category?: string;
    NameDescriptionsearch?: string | string[];
  }>();
  const initialSearch = Array.isArray(routeSearch)
    ? routeSearch[0] ?? ""
    : routeSearch ?? "";
  const routeCategoryValue = routeCategory || "All";
  const [selectedCategory, setSelectedCategory] = useState(
    routeCategoryValue,
  );
  const [searchText, setSearchText] = useState(initialSearch);
  const [syncedRouteCategory, setSyncedRouteCategory] =
    useState(routeCategoryValue);
  const [syncedInitialSearch, setSyncedInitialSearch] =
    useState(initialSearch);
  if (syncedRouteCategory !== routeCategoryValue) {
    setSyncedRouteCategory(routeCategoryValue);
    setSelectedCategory(routeCategoryValue);
  }
  if (syncedInitialSearch !== initialSearch) {
    setSyncedInitialSearch(initialSearch);
    setSearchText(initialSearch);
  }
  const [filters, setFilters] = useState<ProductFilters>(createEmptyFilters);
  const [draftFilters, setDraftFilters] =
    useState<ProductFilters>(createEmptyFilters);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sort, setSort] = useState<ProductSort>("popularity");
  const requestedPageRef = useRef<number | null>(null);
  const previousCategoryRef = useRef(selectedCategory);

  useEffect(() => {
    if (accessToken && wishlistStatus === "idle") {
      void dispatch(fetchWishlist());
    }
  }, [accessToken, dispatch, wishlistStatus]);

  const createQuery = useCallback(
    (page: number, force = false) => ({
      search: searchText.trim() || undefined,
      category:
        selectedCategory === "All"
          ? undefined
          : toCategorySlug(selectedCategory),
      brand: filters.brand || undefined,
      minPrice: getOptionalFilterNumber(filters.minPrice),
      maxPrice: getOptionalFilterNumber(filters.maxPrice),
      rating: getOptionalFilterNumber(filters.rating),
      page,
      pageSize: 20,
      sort: toApiSort(sort),
      ...(force ? { force: true } : {}),
    }),
    [
      filters.brand,
      filters.maxPrice,
      filters.minPrice,
      filters.rating,
      searchText,
      selectedCategory,
      sort,
    ],
  );

  useEffect(() => {
    requestedPageRef.current = null;
    const categoryChanged = previousCategoryRef.current !== selectedCategory;
    previousCategoryRef.current = selectedCategory;

    if (categoryChanged) {
      void dispatch(fetchProductCatalog(createQuery(1)));
      return;
    }

    const timeout = setTimeout(() => {
      void dispatch(fetchProductCatalog(createQuery(1)));
    }, 300);

    return () => clearTimeout(timeout);
  }, [createQuery, dispatch, selectedCategory]);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))],
    [products],
  );

  const filterCount =
    Number(Boolean(filters.brand)) +
    Number(Boolean(filters.minPrice)) +
    Number(Boolean(filters.maxPrice)) +
    Number(Boolean(filters.rating));
  const openFilters = () => {
    setDraftFilters({ ...filters });
    setFiltersVisible(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setFiltersVisible(false);
  };

  const clearFilters = () => {
    const emptyFilters = createEmptyFilters();
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  const selectDraftFilter = (sectionId: string, value: string) => {
    if (sectionId !== "brand") {
      throw new Error(`Unsupported product filter section: ${sectionId}`);
    }
    setDraftFilters((current) => ({
      ...current,
      brand: current.brand === value ? "" : value,
    }));
  };

  const changeMinPrice = (value: number) => {
    setDraftFilters((current) => ({
      ...current,
      minPrice: String(value),
      maxPrice:
        current.maxPrice && Number(current.maxPrice) < value
          ? String(value)
          : current.maxPrice,
    }));
  };

  const changeMaxPrice = (value: number) => {
    setDraftFilters((current) => ({
      ...current,
      maxPrice: String(value),
      minPrice:
        current.minPrice && Number(current.minPrice) > value
          ? String(value)
          : current.minPrice,
    }));
  };

  const changeRating = (value: number) => {
    setDraftFilters((current) => ({
      ...current,
      rating: value === 0 ? "" : String(value),
    }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    requestedPageRef.current = null;
    void dispatch(
      fetchProductCatalog({
        ...createQuery(1),
        category: category === "All" ? undefined : toCategorySlug(category),
      }),
    );
  };

  const loadMoreProducts = useCallback(() => {
    if (
      status !== "succeeded" ||
      page >= totalPages
    ) {
      return;
    }

    const nextPage = page + 1;
    if (requestedPageRef.current === nextPage) return;

    requestedPageRef.current = nextPage;
    void dispatch(fetchProductCatalog(createQuery(nextPage)));
  }, [createQuery, dispatch, page, status, totalPages]);

  const handleAddToCart = (product: Product) => {
    if (!accessToken) {
      showToast({ message: "Sign in to add items to your cart.", type: "error" });
      return;
    }

    const variant =
      product.variants.find((candidate) => candidate.stock > 0) ??
      product.variants[0];
    if (!variant) {
      showToast({
        message: "This product has no available variants.",
        type: "error",
      });
      return;
    }

    setIsAddingToCart(true);
    void addCartItem(
      { parentId: variant.parentId, variant_id: variant.variantid },
      accessToken,
    )
      .then(() => {
        showToast({ message: `${product.name} added to cart.`, type: "success" });
      })
      .catch((error: unknown) => {
        showToast({
          message:
            error instanceof Error
              ? error.message
              : "Unable to add this product to your cart.",
          type: "error",
        });
      })
      .finally(() => setIsAddingToCart(false));
  };

  return (
    <ProductListPresenter
      categories={categories}
      brands={brands}
      searchText={searchText}
      selectedCategory={selectedCategory}
      draftFilters={draftFilters}
      maxPriceLimit={PRICE_LIMIT}
      filtersVisible={filtersVisible}
      sortVisible={sortVisible}
      sort={sort}
      filterCount={filterCount}
      products={products}
      totalCount={count}
      isLoading={status === "loading"}
      isLoadingMore={status === "loadingMore"}
      canLoadMore={status === "succeeded" && page < totalPages}
      error={error}
      favoriteIds={favoriteIds}
      isAddingToCart={isAddingToCart}
      onBack={() => router.navigate(AppRoutes.home)}
      onSearchChange={setSearchText}
      onSearchClear={() => setSearchText("")}
      onRetry={() => {
        const retryPage = products.length > 0 ? page + 1 : 1;
        void dispatch(fetchProductCatalog(createQuery(retryPage, true)));
        requestedPageRef.current = null;
      }}
      onLoadMore={loadMoreProducts}
      onCategorySelect={handleCategorySelect}
      onOpenFilters={openFilters}
      onCloseFilters={() => setFiltersVisible(false)}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
      onSelectDraftFilter={selectDraftFilter}
      onMinPriceChange={changeMinPrice}
      onMaxPriceChange={changeMaxPrice}
      onRatingChange={changeRating}
      onOpenSort={() => setSortVisible(true)}
      onCloseSort={() => setSortVisible(false)}
      onSelectSort={(value) => {
        setSort(value);
        setSortVisible(false);
      }}
      onSelectProduct={(product) => {
        blurFocusedWebElement();
        router.push({
          pathname: AppRoutes.productDetails,
          params: { productId: String(product.id) },
        });
      }}
      onToggleFavorite={async (product) => {
        if (favoriteIds.includes(product.id)) {
          await dispatch(removeWishlistProduct(product.id)).unwrap();
          return;
        }

        const variant = product.variants[0];
        if (!variant) {
          throw new Error("This product has no variant to add to your wishlist.");
        }
        await dispatch(
          addWishlistProduct({
            product_id: product.id,
            variant_id: variant.variantid,
          }),
        ).unwrap();
      }}
      onAddToCart={handleAddToCart}
    />
  );
};

export default ProductListContainer;
