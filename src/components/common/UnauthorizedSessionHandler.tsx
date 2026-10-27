import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { showGlobalToast } from "@/contexts/ToastContext";
import { productCatalogActions } from "@/features/productCatalogSlice";
import { userActions } from "@/features/userSlice";
import {
  setAuthToken,
  setUnauthorizedHandler,
} from "@/services/ApiClient";
import type { AppDispatch } from "@/store/store";
import { store } from "@/store/store";
import { removeStorageItem, StorageKeys } from "@/utils/storage";

export default function UnauthorizedSessionHandler() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setUnauthorizedHandler(async (failedToken) => {
      if (store.getState().user.accessToken !== failedToken) return;

      setAuthToken(null);
      dispatch(productCatalogActions.clearProductCatalog());
      dispatch(userActions.logout());

      try {
        await removeStorageItem(StorageKeys.authSession);
      } catch (storageError) {
        console.error("Unable to clear the expired session.", storageError);
      }

      if (!store.getState().user.isAuthenticated) {
        showGlobalToast({
          message: "Your session has expired. Please sign in again.",
          type: "error",
          duration: 4000,
        });
        router.replace(AppRoutes.login);
      }
    });

    return () => setUnauthorizedHandler(null);
  }, [dispatch, router]);

  return null;
}
