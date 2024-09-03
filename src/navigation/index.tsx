import {
  LinkingOptions,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Linking, PermissionsAndroid, Platform } from "react-native";
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
import {
  setErrorFromSocial,
  setSaveNotificationCount,
} from "../store/settings/settings.slice";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

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

  const [notificationCount, setNotificationCount] = useState(0);

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

  useEffect(() => {
    async function checkNotificationPermission() {
      const settings = await notifee.getNotificationSettings();
      if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
        console.log("Notification permissions has been authorized");
      } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
        console.log("Notification permissions has been denied");
        requestUserPermission();
      }
    }

    checkNotificationPermission().then();
  }, []);

  const requestUserPermission = async () => {
    if (Platform.OS === "ios") {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log("Permission settings:", settings);
      } else {
        console.log("User declined permissions");
        await notifee.requestPermission();
      }
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
  };

  const handleClickedNotitfaction = (
    notification: FirebaseMessagingTypes.RemoteMessage
  ): void => {
    // if (notification && notification.data && notification.data.type) {
    //   switch (notification.data.type) {
    //     case "Product":
    //       // set default type wise
    //       break;
    //     case "Category":
    //       // set default type wise
    //       break;
    //     case "Brand":
    //       // set default type wise
    //       break;
    //     default:
    //     // set default notification
    //   }
    // }
  };

  notifee.onBackgroundEvent(async (localMessage) => {
    console.log(
      "notifee setBackgroundMessageHandler localMessage",
      JSON.stringify(localMessage)
    );
  });

  const onNotifeeMessageReceived = async (message: any) => {
    console.log("message - - - ", message);
    dispatch(setSaveNotificationCount(notificationCount + 1));

    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    notifee.displayNotification({
      id: message.messageId,
      title: message.notification.title,
      // body: message.notification.body,
      data: message.data,
      android: {
        channelId: channelId,
        pressAction: {
          id: "default",
        },
      },
    });
  };

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification clicked when the app is in the background or terminated:",
          remoteMessage
        );
        handleClickedNotitfaction(remoteMessage);
        // Handle the notification click here
        // You can navigate to a specific screen or perform other actions
      }
    });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification clicked when the app is in the foreground:",
      remoteMessage
    );
    handleClickedNotitfaction(remoteMessage);
    // Handle the notification click here
    // You can navigate to a specific screen or perform other actions
  });

  // @todo - handle in-app notifications
  useEffect(() => {
    messaging().onMessage(onNotifeeMessageReceived);
    messaging().setBackgroundMessageHandler(async (message) => {
      console.log("in background message", message);
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <MainStack />
    </NavigationContainer>
  );
};

export default MainNavigator;
