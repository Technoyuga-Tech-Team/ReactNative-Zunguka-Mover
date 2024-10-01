import { UserData } from "./user.types";

export interface SettingsStateProps {
  isDark: boolean;
  userData: UserData;
  errorFromSocial: boolean;
  address: string;
  notificationCount: number;
  isNewPackageDelivered: number;
  moverInfo: UserData;
  moverRequestData: any[];
  unread_count: number;
  unread_alert_count: number;
}
