import * as React from "react";
import { makeStyles } from "react-native-elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
// relative path
import { Route } from "../constant/navigationConstants";
import { AppRoutes } from "../types/navigation";
import Splash from "../screens/Splash";
import Onboard from "../screens/onboard/Onboard";
import Authentication from "./Authentication";
import Bottombar from "./Bottombar/Bottombar";
import AddKyc from "../screens/authentication/Add kyc/AddKyc";
import EditProfile from "../screens/profile/EditProfile";
import ResetPassword from "../screens/authentication/ResetPassword";
import ChangePassword from "../screens/profile/ChangePassword";
import TakeSelfie from "../screens/authentication/TakeSelfie";
import PayoutHistory from "../screens/PayoutHistory";
import RatingAndReviews from "../screens/RatingAndReviews";
import Withdraw from "../screens/Withdraw";
import Notification from "../screens/Notification/Notification";
import DeliveryDetails1 from "../screens/DeliveryDetails1";
import PackageDetails from "../screens/Packages/PackageDetails";
import Chatroom from "../screens/chat/Chatroom";
import TransactionHistory from "../screens/profile/TransactionHistory";

const Stack = createNativeStackNavigator<AppRoutes>();

const MainStack = () => {
  const styles = useStyles();

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={Route.navSplash}
      >
        <Stack.Screen name={Route.navSplash} component={Splash} />
        <Stack.Screen name={Route.navOnboard} component={Onboard} />
        <Stack.Screen
          name={Route.navAuthentication}
          component={Authentication}
        />
        <Stack.Screen name={Route.navDashboard} component={Bottombar} />
        <Stack.Screen name={Route.navAddKyc} component={AddKyc} />
        <Stack.Screen name={Route.navEditProfile} component={EditProfile} />
        <Stack.Screen name={Route.navTakeSelfie} component={TakeSelfie} />

        <Stack.Screen
          name={Route.navChangePassword}
          component={ChangePassword}
        />
        <Stack.Screen name={Route.navResetPassword} component={ResetPassword} />
        <Stack.Screen name={Route.navPayoutHistory} component={PayoutHistory} />
        <Stack.Screen
          name={Route.navReviewAndRating}
          component={RatingAndReviews}
        />
        <Stack.Screen name={Route.navWithdraw} component={Withdraw} />
        <Stack.Screen name={Route.navNotification} component={Notification} />
        <Stack.Screen
          name={Route.navDeliveryDetails1}
          component={DeliveryDetails1}
        />
        <Stack.Screen
          name={Route.navPackageDetails}
          component={PackageDetails}
        />
        <Stack.Screen name={Route.navChatroom} component={Chatroom} />
        <Stack.Screen
          name={Route.navTransactionHistory}
          component={TransactionHistory}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainStack;

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
}));
