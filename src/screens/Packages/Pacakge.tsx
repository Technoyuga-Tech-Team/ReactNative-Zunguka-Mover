import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StatusBar, Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CompletedPackages from "./CompletedPackages";
import MyTabBar from "./MyTabBar";
import OngoingPackages from "./OngoingPackages";
import UpcommingPackages from "./UpcommingPackages";
import { TopPackageRoutes } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import { ThemeProps } from "../../types/global.types";

const Pacakge = () => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const Tab = createMaterialTopTabNavigator<TopPackageRoutes>();
  return (
    <View style={style.scrollCont}>
      <StatusBar
        backgroundColor={theme.colors?.white}
        barStyle={"dark-content"}
      />
      <Text style={style.txtTitle}>{"Packages"}</Text>
      <Tab.Navigator tabBar={(props: any) => <MyTabBar {...props} />}>
        <Tab.Screen
          name={Route.navUpcomingPackages}
          component={UpcommingPackages}
        />
        <Tab.Screen
          name={Route.navOngoingPackages}
          component={OngoingPackages}
        />
        <Tab.Screen
          name={Route.navCompletedPackages}
          component={CompletedPackages}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Pacakge;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  scrollCont: {
    flex: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs20,
    color: theme.colors?.black,
    fontFamily: theme.fontFamily?.medium,
    alignSelf: "center",
    marginTop: 10,
  },
}));
