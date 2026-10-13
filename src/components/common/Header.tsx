import type { StyleProp, ViewStyle } from "react-native";

import AppHeader from "@/components/common/AppHeader";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function Header({ title, onBack, style }: HeaderProps) {
  return <AppHeader onBack={onBack} style={style} title={title} />;
}
