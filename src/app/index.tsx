import { AppRoutes } from "@/constants/AppConstants";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href={AppRoutes.home} />;
}
