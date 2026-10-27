import AddressesListItem from "@/components/common/AddressesListItem";
import CustomButton from "@/components/common/CustomButton";
import EmptyState from "@/components/common/EmptyState";
import Header from "@/components/common/Header";
import type { Address } from "@/types/api/address";
import { useAppTheme } from "@/utils/useTheme";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddressesPresenterProps {
  addresses: Address[];
  onNavigateBack: () => void;
  onEditAddress?: (address: Address) => void;
  onDeleteAddress?: (address: Address) => void;
  onAddAddress: () => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const AddressesPresenter = ({
  addresses,
  onNavigateBack,
  onEditAddress,
  onAddAddress,
  onDeleteAddress,
  isLoading,
  error,
  onRetry,
}: AddressesPresenterProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Header title="Addresses" onBack={onNavigateBack} />
      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          keyExtractor={(address) => String(address.id)}
          renderItem={({ item }) => (
            <AddressesListItem
              onEdit={onEditAddress}
              onDelete={onDeleteAddress}
              address={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          fillAvailableSpace
          loading={isLoading}
          icon={error ? "alert-circle-outline" : undefined}
          message={error ?? undefined}
          onRetry={error ? onRetry : undefined}
          title={
            isLoading
              ? "Loading addresses"
              : error
                ? "Unable to load addresses"
                : "No addresses found"
          }
        />
      )}
      <CustomButton
        title="Add Address"
        onPress={onAddAddress}
        style={styles.addButton}
      />
    </SafeAreaView>
  );
};

export default AddressesPresenter;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    addButton: {
      margin: 16,
    },
  });
