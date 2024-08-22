import { UserData } from "./user.types";

export interface SettingsStateProps {
  isDark: boolean;
  userData: UserData;
  errorFromSocial: boolean;
  address: string;
  notificationCount: number;
}
