import type { StyleProp, ViewStyle } from "react-native";

import AppHeader from "@/components/common/AppHeader";

interface ShopKartHeaderProps {
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function ShopKartHeader({
  onBack,
  style,
}: ShopKartHeaderProps) {
  return <AppHeader onBack={onBack} style={style} title="ShopKart" />;
}
