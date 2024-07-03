import {
  LinkingOptions,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { BASE_PORT } from "../constant";
import MainStack from "./MainStack";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import {
  selectGlobalErrors,
  selectGlobalSuccess,
} from "../store/global/global.selectors";
import { selectSocialError } from "../store/settings/settings.selectors";
import { useTheme } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import { clearErrors, clearSuccess } from "../store/global/global.slice";
import { setErrorFromSocial } from "../store/settings/settings.slice";

const linking: LinkingOptions<{}> = {
  prefixes: [`http://${BASE_PORT}/`, `zunguka://`],
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
  },

  config: {
    screens: {
      EmailVerify: "verify-email/:token/:email",
      NewPassword: "password-setup/:token",
      ChatRoom: "chat-box/:id/:sender_id/:chat_id/:fireConsole",
      BuyerSellerStack: {
        screens: {
          ProductDetails: "viewing-profile/:itemId",
        },
      },
    },
  },
};

const MainNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  const dispatch = useAppDispatch();
  const { errors, errorMessage } = useSelector(selectGlobalErrors);
  const { success, successMessage } = useSelector(selectGlobalSuccess);
  const isSocialError = useSelector(selectSocialError);
  const { theme } = useTheme();

  useEffect(() => {
    if (
      errors &&
      errors.errors?.findIndex(
        (err: { domain: string }) =>
          err.domain === "global" || err.domain === "nonFieldErrors"
      ) !== -1
    ) {
      if (!isSocialError) {
        if (errorMessage !== "") {
          Snackbar.show({
            text: errorMessage || "",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: theme.colors?.error,
            textColor: theme.colors?.white,
            fontFamily: theme.fontFamily?.medium,
          });
        }
      }

      dispatch(clearErrors());
      dispatch(setErrorFromSocial(false));
    }
  }, [
    dispatch,
    errorMessage,
    errors,
    theme.colors?.error,
    theme.colors?.white,
    isSocialError,
  ]);

  useEffect(() => {
    if (success && successMessage) {
      Snackbar.show({
        text: successMessage,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors?.primary,
        textColor: theme.colors?.black,
        fontFamily: theme.fontFamily?.medium,
      });
      dispatch(clearSuccess());
    }
  }, [
    dispatch,
    success,
    successMessage,
    theme.colors?.black,
    theme.colors?.grey5,
  ]);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <MainStack />
    </NavigationContainer>
  );
};

export default MainNavigator;
