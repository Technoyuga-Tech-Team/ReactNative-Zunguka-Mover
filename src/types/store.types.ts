import { Action, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { GlobalState } from "./global.types";
import { SettingsStateProps } from "./settings.types";
import { AuthenticationState } from "./authentication.types";
import { UserProfileState } from "./user.types";
import { MoverBookingState } from "./moverBooking.types";
import { MyEarningState } from "./myEarning.types";
import { PackageStatusState } from "./packageStatus.types";
import { NotificationStatusState } from "./notification.types";

export interface RootReduxState {
  global: GlobalState;
  settings: SettingsStateProps;
  authentication: AuthenticationState;
  userProfile: UserProfileState;
  moverBooking: MoverBookingState;
  myEarning: MyEarningState;
  packageStatus: PackageStatusState;
  notification: NotificationStatusState;
}

export type AppDispatch = ThunkDispatch<
  RootReduxState,
  unknown,
  Action<string>
>;

export type AppThunk<T = Promise<void> | void> = ThunkAction<
  T,
  RootReduxState,
  unknown,
  Action<string>
>;
