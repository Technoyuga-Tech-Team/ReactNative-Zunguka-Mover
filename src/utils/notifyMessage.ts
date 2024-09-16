import { Alert, Platform, ToastAndroid } from "react-native";

export const notifyMessage = (msg: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  } else {
    Alert.alert(msg);
  }
};
