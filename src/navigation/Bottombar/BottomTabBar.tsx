import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AlertIcon from "../../components/ui/svg/AlertIcon";
import EarningIcon from "../../components/ui/svg/EarningIcon";
import HomeIcon from "../../components/ui/svg/HomeIcon";
import PackageIcon from "../../components/ui/svg/PackageIcon";
import UserIcon from "../../components/ui/svg/UserIcon";
import { HIT_SLOP, SCREEN_WIDTH } from "../../constant";
import { Route } from "../../constant/navigationConstants";
import {
  getNotificationCount,
  getUnreadAlertCount,
} from "../../store/settings/settings.selectors";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";

const BottomTabBar = ({ state, navigation }: any) => {
  const notificationCount = useSelector(getNotificationCount);
  const unread_alert_Count = useSelector(getUnreadAlertCount);

  const insets = useSafeAreaInsets();
  const Style = useStyle({ insets });

  const { theme } = useTheme();

  return (
    <>
      <View style={Style.mainCont}>
        <View style={Style.container}>
          {state?.routes.map(
            (route: { name: Route; key: string }, index: number) => {
              const isFocused = state.index === index;
              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  activeOpacity={0.8}
                  hitSlop={HIT_SLOP}
                  style={Style.iconCont}
                >
                  {route.name === Route.navHome ? (
                    <HomeIcon
                      color={
                        isFocused
                          ? theme.colors?.primary
                          : theme.colors?.unselectedIconColor
                      }
                      height={25}
                      width={25}
                    />
                  ) : route.name === Route.navEarnings ? (
                    <EarningIcon
                      color={
                        isFocused
                          ? theme.colors?.primary
                          : theme.colors?.unselectedIconColor
                      }
                      height={22}
                      width={22}
                    />
                  ) : route.name === Route.navPackage ? (
                    <PackageIcon
                      color={
                        isFocused
                          ? theme.colors?.primary
                          : theme.colors?.unselectedIconColor
                      }
                      height={25}
                      width={25}
                    />
                  ) : route.name === Route.navAlert ? (
                    <>
                      <AlertIcon
                        color={
                          isFocused
                            ? theme.colors?.primary
                            : theme.colors?.unselectedIconColor
                        }
                        height={22}
                        width={22}
                      />
                      {unread_alert_Count > 0 && (
                        <View style={Style.redDot}>
                          <Text style={Style.txtNotificationCount}>
                            {unread_alert_Count}
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <UserIcon
                      color={
                        isFocused
                          ? theme.colors?.primary
                          : theme.colors?.unselectedIconColor
                      }
                      height={25}
                      width={25}
                    />
                  )}

                  <Text
                    style={[
                      Style.txtRouteName,
                      {
                        color: isFocused
                          ? theme.colors?.primary
                          : theme.colors?.unselectedIconColor,
                      },
                    ]}
                  >
                    {route.name}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </View>
      <SafeAreaView style={Style.bottomFlex} />
    </>
  );
};

export default BottomTabBar;

const useStyle = makeStyles((theme, props: ThemeProps) => ({
  mainCont: {
    height: Scale(70),
    width: SCREEN_WIDTH,
    backgroundColor: theme.colors?.white,
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    borderTopColor: theme.colors?.border,
    borderTopWidth: 2,
    bottom: props.insets.bottom,
  },
  container: {
    height: Scale(60),
    width: SCREEN_WIDTH,
    backgroundColor: theme.colors?.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  iconCont: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
  },
  container2: {
    height: Scale(60),
    width: "100%",
    flexDirection: "row",
    backgroundColor: theme.colors?.white,
  },
  dividerCont: {
    height: Scale(60),
    width: 1,
    backgroundColor: theme.colors?.white,
  },
  jobSeekerCont: {
    flex: 1,
    height: Scale(60),
    borderTopLeftRadius: 20,
    backgroundColor: theme.colors?.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  recruterCont: {
    flex: 1,
    height: Scale(60),
    borderTopRightRadius: 20,
    backgroundColor: theme.colors?.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  txtlogin: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
  userIconContainer: {
    height: Scale(35),
    width: Scale(35),
    borderRadius: Scale(35) / 2,
    backgroundColor: theme.colors?.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    position: "absolute",
    top: -18,
  },
  bottomFlex: {
    flex: 0,
    backgroundColor: theme.colors?.background,
  },
  txtRouteName: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    marginTop: 5,
  },
  circlePlusCont: {
    marginBottom: 25,
  },
  redDot: {
    height: Scale(18),
    width: Scale(18),
    borderRadius: Scale(18 / 2),
    backgroundColor: theme.colors?.pinkDark,
    position: "absolute",
    right: 18,
    top: -8,
    alignItems: "center",
    justifyContent: "center",
  },
  txtNotificationCount: {
    fontSize: theme.fontSize?.fs10,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.white,
  },
}));
