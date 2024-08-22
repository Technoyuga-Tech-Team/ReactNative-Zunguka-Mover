import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";

const MyTabBar = ({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={style.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        let txtLabel =
          label === "OngoingPackages"
            ? "Ongoing"
            : label === "UpcomingPackages"
            ? "Upcoming"
            : "Completed";
        const isLeftSelected = state.index == 0;
        const isCenteredSelected = state.index == 1;
        const isRightSelected = state.index == 2;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={`${index}`}
            disabled={isFocused}
            activeOpacity={0.8}
            onPress={onPress}
            style={[
              style.btnContainer,
              isLeftSelected &&
                (isFocused
                  ? style.leftFocusedBtn
                  : index == 1
                  ? style.centeredUnfocusBtn
                  : style.rightUnfocusedBtn),

              isCenteredSelected &&
                (isFocused
                  ? style.centeredFocusBtn
                  : index == 0
                  ? style.leftUnfocusedBtn
                  : style.rightUnfocusedBtn),

              isRightSelected &&
                (isFocused
                  ? style.rightFocusedBtn
                  : index == 0
                  ? style.leftUnfocusedBtn
                  : style.centeredUnfocusBtn),
            ]}
          >
            <Text
              style={[
                style.txtLabel,
                {
                  color: isFocused
                    ? theme.colors?.white
                    : theme.colors?.primary,
                },
              ]}
            >
              {txtLabel as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MyTabBar;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexDirection: "row",
    paddingTop: 20,
    marginHorizontal: 20,
  },
  btnContainer: {
    flex: 1,
    height: Scale(48),
    alignItems: "center",
    justifyContent: "center",
  },
  leftFocusedBtn: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.colors?.primary,
  },
  centeredFocusBtn: {
    backgroundColor: theme.colors?.primary,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  centeredUnfocusBtn: {
    backgroundColor: theme.colors?.primaryLightest,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  rightUnfocusedBtn: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: theme.colors?.primaryLightest,
  },
  rightFocusedBtn: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: theme.colors?.primary,
  },
  leftUnfocusedBtn: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.colors?.primaryLightest,
  },
  txtLabel: {
    fontSize: theme.fontSize?.fs15,
    lineHeight: 20,
    fontFamily: theme.fontFamily?.medium,
  },
}));
