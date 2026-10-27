import { AppRoutes } from "@/constants/AppConstants";
import { useToast } from "@/contexts/ToastContext";
import { deleteAddress, getAddresses } from "@/services/api";
import type { RootState } from "@/store/store";
import type { Address } from "@/types/api/address";
import { showAppAlert } from "@/utils/showAppAlert";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddressesPresenter from "../presenter/AddressesPresenter";
const AddressesContainer = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const activeRequestCleanup = useRef<(() => void) | null>(null);

  const loadAddresses = useCallback(() => {
    if (!accessToken) {
      setAddresses([]);
      setIsLoading(false);
      setLoadError("Sign in to view your saved addresses.");
      return;
    }

    let cancelled = false;

    setAddresses([]);
    setIsLoading(true);
    setLoadError(null);
    getAddresses(accessToken)
      .then((result) => {
        if (!cancelled) setAddresses(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("Unable to load saved addresses.");
          setLoadError(
            typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
              ? error.message
              : "Please check your connection and try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const reloadAddresses = useCallback(() => {
    activeRequestCleanup.current?.();
    activeRequestCleanup.current = loadAddresses() ?? null;
  }, [loadAddresses]);

  useFocusEffect(
    useCallback(() => {
      reloadAddresses();
      return () => {
        activeRequestCleanup.current?.();
        activeRequestCleanup.current = null;
      };
    }, [reloadAddresses]),
  );

  const handleEditAddress = (address: Address) => {
    router.push({
      pathname: AppRoutes.editAddress,
      params: { address: JSON.stringify(address) },
    });
  };

  const handleDeleteAddress = (address: Address) => {
    showAppAlert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void confirmDeleteAddress(address),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const confirmDeleteAddress = async (address: Address) => {
    if (!accessToken) {
      showToast({
        message: "Sign in to delete an address.",
        type: "error",
      });
      return;
    }

    try {
      await deleteAddress(address.id, accessToken);
      setAddresses((currentAddresses) =>
        currentAddresses.filter((item) => item.id !== address.id),
      );
      showToast({ message: "Address deleted.", type: "success" });
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to delete the address. Please try again.";
      showToast({ message, type: "error" });
    }
  };
  const handleAddAddress = () => {
    router.push(AppRoutes.addAddress);
  };
  return (
    <AddressesPresenter
      addresses={addresses}
      onNavigateBack={() => router.replace(AppRoutes.account)}
      onEditAddress={handleEditAddress}
      onDeleteAddress={handleDeleteAddress}
      onAddAddress={handleAddAddress}
      isLoading={isLoading}
      error={loadError}
      onRetry={reloadAddresses}
    />
  );
};

export default AddressesContainer;
