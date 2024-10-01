import notifee, { EventType, Notification } from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import {
  LinkingOptions,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { useTheme } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import { useSelector } from "react-redux";
import { BASE_PORT } from "../constant";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  selectGlobalErrors,
  selectGlobalSuccess,
} from "../store/global/global.selectors";
import { clearErrors, clearSuccess } from "../store/global/global.slice";
import { moverRequestedDetails } from "../store/MoverBooking/moverBooking.thunk";
import { selectSocialError } from "../store/settings/settings.selectors";
import {
  setErrorFromSocial,
  setMoverRequestList,
  setSaveNotificationCount,
  setTotalUnreadAlertCount,
  setTotalUnreadNotificationCount,
} from "../store/settings/settings.slice";
import MainStack from "./MainStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../store/store";

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

  const handleClickedNotitfaction = async (
    notification: FirebaseMessagingTypes.RemoteMessage | Notification
  ) => {
    await AsyncStorage.setItem("notificationHandled", "true");
    if (notification?.data?.is_notification == "1") {
      let unread_noti_count = notification?.data?.unread_notifications;
      dispatch(setTotalUnreadNotificationCount(Number(unread_noti_count)));
    }
    if (notification?.data?.is_alert == "1") {
      let unread_alerts = notification?.data?.unread_alerts;
      dispatch(setTotalUnreadAlertCount(Number(unread_alerts)));
    }
    setTimeout(() => {
      if (notification && notification.data && notification.data.type) {
        switch (notification.data.type) {
          case "new_message":
            const user = notification.data.user as string;
            let data = JSON.parse(user);
            let product_id = notification?.data?.chat_ref_id;
            // @ts-ignore
            navigationRef.navigate(Route.navChatroom, {
              receiver_id: data?.id,
              product_id: product_id,
            });
            break;
          case "Category":
            // set default type wise
            break;
          case "Brand":
            // set default type wise
            break;
          default:
            null;
          // set default notification
        }
      }
    }, 1000);
  };

  notifee.onBackgroundEvent(async (localMessage) => {
    console.log(
      "notifee setBackgroundMessageHandler localMessage",
      JSON.stringify(localMessage)
    );
    handleClickedNotitfaction(localMessage.detail.notification);
  });

  const onNotifeeMessageReceived = async (message: any) => {
    console.log("message - - - ", message);
    if (message.data.is_notification == "1") {
      let unread_noti_count = store.getState().settings.unread_count;
      console.log("unread_noti_count - - - -", unread_noti_count);
      dispatch(
        setTotalUnreadNotificationCount(message.data.unread_notifications)
      );
    }
    if (message.data.is_alert == "1") {
      let unread_alerts = store.getState().settings.unread_alert_count;
      console.log("unread_alerts - - - -", unread_alerts);
      dispatch(setTotalUnreadAlertCount(message.data.unread_alerts));
    }

    if (message?.data?.type === "nearby_request") {
      const result = await dispatch(
        moverRequestedDetails({
          status: "all",
        })
      );
      if (moverRequestedDetails.fulfilled.match(result)) {
        console.log("data moverRequestedDetails --->", result.payload);
        if (result.payload.status == 1) {
          dispatch(setMoverRequestList(result.payload.data));
          // setRequestData(result.payload.data);
        }
      } else {
        console.log("errror moverRequestedDetails --->", result.payload);
      }
    }

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
        sound: "default",
        pressAction: {
          id: "default",
        },
      },
    });
  };

  useEffect(() => {
    const checkInitialNotification = async () => {
      const isnotificationHandled = await AsyncStorage.getItem(
        "notificationHandled"
      );
      let notificationHandled = JSON.parse(isnotificationHandled);
      console.log("notificationHandled - - ", notificationHandled);
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            console.log(
              "Notification clicked when the app is in the background or terminated:",
              remoteMessage
            );
            if (remoteMessage && !notificationHandled) {
              handleClickedNotitfaction(remoteMessage);
            }

            // Handle the notification click here
            // You can navigate to a specific screen or perform other actions
          }
        });
    };
    checkInitialNotification();
  }, []);

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
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleClickedNotitfaction(detail?.notification);
      }
    });
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
