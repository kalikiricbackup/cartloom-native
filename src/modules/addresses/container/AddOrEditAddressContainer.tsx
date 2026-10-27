import { useLoader } from "@/contexts/LoadingContext";
import { useToast } from "@/contexts/ToastContext";
import { createAddress, updateAddress } from "@/services/api";
import type { RootState } from "@/store/store";
import type { Address } from "@/types/api/address";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";
import AddOrEditAddressPresenter from "../presenter/AddOrEditAddressPresenter";

const AddOrEditAddressContainer = () => {
  const { showLoading, hideLoading } = useLoader();
  const { address: addressParam } = useLocalSearchParams<{
    address?: string;
  }>();
  const address: Address | undefined = addressParam
    ? JSON.parse(addressParam)
    : undefined;

  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const { showToast } = useToast();
  const [street, setStreet] = React.useState(
    address?.street || address?.address || "",
  );
  const [label, setLabel] = React.useState(address?.label || "");
  const [city, setCity] = React.useState(address?.city ?? "");
  const [state, setState] = React.useState(address?.state ?? "");
  const [pin, setPin] = React.useState(address?.pin ?? "");
  const [addr, setAddress] = React.useState(address?.address ?? "");
  const handleStreetChange = (value: string) => setStreet(value);
  const handleCityChange = (value: string) => setCity(value);
  const handleStateChange = (value: string) => setState(value);
  const handlePinChange = (value: string) => setPin(value);
  const handleAddressChange = (value: string) => setAddress(value);
  const handleNavigateBack = () => {
    router.back();
  };

  const handleSaveAddress = async () => {
    if (!accessToken) {
      showToast({ message: "Sign in to save an address.", type: "error" });
      return;
    }

    showLoading();
    try {
      const addressData = {
        address: addr.trim(),
        label: label.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        pin: pin.trim(),
      };

      if (address) {
        await updateAddress(address.id, addressData, accessToken);
      } else {
        await createAddress(addressData, accessToken);
      }

      showToast({
        message: address ? "Address updated." : "Address added.",
        type: "success",
      });
      router.back();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to save the address. Please try again.";
      showToast({ message, type: "error" });
    } finally {
      hideLoading();
    }
  };

  return (
    <AddOrEditAddressPresenter
      label={label}
      address={addr}
      isEditing={Boolean(address)}
      street={street}
      city={city}
      state={state}
      pin={pin}
      onStreetChange={handleStreetChange}
      onCityChange={handleCityChange}
      onStateChange={handleStateChange}
      onPinChange={handlePinChange}
      onNavigateBack={handleNavigateBack}
      onSaveAddress={handleSaveAddress}
      onLabelChange={setLabel}
      onAddressChange={handleAddressChange}
    />
  );
};

export default AddOrEditAddressContainer;
