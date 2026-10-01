import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { userActions } from "@/features/userSlice";
import { setAuthToken } from "@/services/ApiClient";
import type { AppDispatch, RootState } from "@/store/store";
import { showAppAlert } from "@/utils/showAppAlert";
import { removeStorageItem, StorageKeys } from "@/utils/storage";
import AccountPresenter, {
  type AccountAction,
} from "../presenter/AccountPresenter";

const AccountContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector((state: RootState) => state.user);
  const user = account.user as { name?: string; email?: string } | null;

  const handleSelectAction = (action: AccountAction) => {
    switch (action) {
      case "wishlist":
        router.push(AppRoutes.wishlist);
        return;
      case "logout":
        setAuthToken(null);
        dispatch(userActions.logout());
        void removeStorageItem(StorageKeys.authSession).catch((error) => {
          console.error("Unable to clear the saved session.", error);
        });
        router.replace(AppRoutes.login);
        return;
      case "profile":
      case "orders":
      case "addresses":
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
      name={user?.name || "test user"}
      email={user?.email || account.email || "test@gmail.com"}
      onBack={() => router.navigate(AppRoutes.home)}
      onSelectAction={handleSelectAction}
    />
  );
};

export default AccountContainer;
