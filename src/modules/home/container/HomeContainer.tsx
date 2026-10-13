import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { fetchHomeData } from "@/features/homeDataSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import HomePresenter from "../presenter/HomePresenter";

const HomeContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { topCategories, bestDeals, status, error } = useSelector(
    (state: RootState) => state.homeData,
  );
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    void dispatch(fetchHomeData());
  }, [dispatch]);

  const handleCategorySelect = (category: string) => {
    blurFocusedWebElement();
    setSelectedCategory(category);
    router.push({
      pathname: AppRoutes.productList,
      params: { category },
    });
  };

  const handleSeeAllCategories = () => {
    blurFocusedWebElement();
    router.push(AppRoutes.productList);
  };

  const handleViewAllDeals = () => {
    blurFocusedWebElement();
    router.push(AppRoutes.productList);
  };

  return (
    <HomePresenter
      categories={topCategories}
      featuredProducts={bestDeals}
      isLoading={status === "loading"}
      error={error}
      selectedCategory={selectedCategory}
      onSearchPress={() => {
        blurFocusedWebElement();
        router.push(AppRoutes.search);
      }}
      onCategorySelect={handleCategorySelect}
      onSeeAllCategories={handleSeeAllCategories}
      onViewAllDeals={handleViewAllDeals}
      onRetry={() => {
        void dispatch(fetchHomeData());
      }}
      onSelectProduct={(productId) => {
        blurFocusedWebElement();
        router.push({
          pathname: AppRoutes.productDetails,
          params: { productId: String(productId) },
        });
      }}
    />
  );
};

export default HomeContainer;
