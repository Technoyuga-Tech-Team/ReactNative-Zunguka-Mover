import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import BottomTabBar from "./BottomTabBar";
import RNBootSplash from "react-native-bootsplash";
import { BottomRoutes } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import Home from "../../screens/Home";
import Inbox from "../../screens/Inbox/Inbox";
import Profile from "../../screens/profile/Profile";
import Earnings from "../../screens/Earnings";
import Pacakge from "../../screens/Packages/Pacakge";

const Bottombar = () => {
  const Tab = createBottomTabNavigator<BottomRoutes>();
  useEffect(() => {
    const init = async () => {
      await RNBootSplash.hide();
    };
    init();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={Route.navHome}
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name={Route.navHome} component={Home} />
      <Tab.Screen name={Route.navEarnings} component={Earnings} />
      <Tab.Screen name={Route.navPackage} component={Pacakge} />
      <Tab.Screen name={Route.navInbox} component={Inbox} />
      <Tab.Screen name={Route.navProfile} component={Profile} />
    </Tab.Navigator>
  );
};

export default Bottombar;
