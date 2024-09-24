import { combineReducers } from "@reduxjs/toolkit";
import { RootReduxState } from "../types/store.types";
import global from "../store/global/global.slice";
import settings from "../store/settings/settings.slice";
import authentication from "../store/authentication/authentication.slice";
import userProfile from "../store/userprofile/userprofile.slice";
import moverBooking from "../store/MoverBooking/moverBooking.slice";
import myEarning from "../store/MyEarning/myEarning.slice";
import packageStatus from "../store/PackageStatus/packageStatus.slice";

const rootReducer = combineReducers<RootReduxState>({
  global,
  settings,
  authentication,
  userProfile,
  moverBooking,
  myEarning,
  packageStatus,
});

export default rootReducer;
