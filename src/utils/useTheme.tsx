import { useColorScheme } from "react-native";
import { darkTheme } from "../theme/darkTheme";
import { lightTheme } from "../theme/lightTheme";

export const useAppTheme = () => {
  const scheme = useColorScheme();

  return scheme === "dark" ? darkTheme : lightTheme;
};
