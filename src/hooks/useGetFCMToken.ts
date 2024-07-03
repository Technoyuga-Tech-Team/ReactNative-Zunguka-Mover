// import notifee from "@notifee/react-native";
// import messaging from "@react-native-firebase/messaging";

// // @ts-ignore
// export const useGetFCMToken = async () => {
//   const enabled = await notifee.requestPermission();
//   // await messaging().registerDeviceForRemoteMessages();
//   await messaging().setAutoInitEnabled(true);
//   if (enabled) {
//     const token = await messaging().getToken();
//     if (token) {
//       return token;
//     } else {
//       return null;
//     }
//   } else {
//     await notifee.requestPermission();
//   }

//   return null;
// };
