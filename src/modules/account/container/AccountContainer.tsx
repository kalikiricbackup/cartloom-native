import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { productCatalogActions } from "@/features/productCatalogSlice";
import { userActions } from "@/features/userSlice";
import { wishlistActions } from "@/features/wishlistSlice";
import { logoutUser } from "@/services/api";
import { setAuthToken } from "@/services/ApiClient";
import type { AppDispatch, RootState } from "@/store/store";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import { showAppAlert } from "@/utils/showAppAlert";
import { removeStorageItem, StorageKeys } from "@/utils/storage";
import AccountPresenter, {
  type AccountAction,
} from "../presenter/AccountPresenter";

const AccountContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector((state: RootState) => state.user);

  const handleSelectAction = (action: AccountAction) => {
    switch (action) {
      case "wishlist":
        blurFocusedWebElement();
        router.push(AppRoutes.wishlist);
        return;
      case "profile":
        blurFocusedWebElement();
        router.push(AppRoutes.profile);
        return;
      case "logout":
        blurFocusedWebElement();
        void (async () => {
          let sessionExpired = false;
          try {
            if (account.accessToken) {
              if (account.refreshToken) {
                await logoutUser(account.accessToken, account.refreshToken);
              }
            }
          } catch (error) {
            sessionExpired =
              typeof error === "object" &&
              error !== null &&
              "status" in error &&
              error.status === 401;
            if (!sessionExpired) {
              console.warn(
                "Logout API failed; clearing local session anyway.",
                error,
              );
            }
          } finally {
            setAuthToken(null);
            dispatch(productCatalogActions.clearProductCatalog());
            dispatch(wishlistActions.clearWishlist());
            dispatch(userActions.logout());
            void removeStorageItem(StorageKeys.authSession).catch((error) => {
              console.error("Unable to clear the saved session.", error);
            });
            if (!sessionExpired) router.replace(AppRoutes.home);
          }
        })();
        return;
      case "orders":
        return;
      case "addresses":
        router.push(AppRoutes.addresses);
        return;
      case "payments":
      case "notifications":
        showAppAlert(
          action[0].toUpperCase() + action.slice(1),
          "This section is coming soon.",
        );
        return;
    }
  };

  return (
    <AccountPresenter
      isAuthenticated={account.isAuthenticated}
      email={account.email}
      onBack={() => router.navigate(AppRoutes.home)}
      onLogin={() => {
        blurFocusedWebElement();
        router.push(AppRoutes.login);
      }}
      onSelectAction={handleSelectAction}
    />
  );
};

export default AccountContainer;
