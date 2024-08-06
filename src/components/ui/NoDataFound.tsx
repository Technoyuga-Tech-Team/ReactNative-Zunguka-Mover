import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../types/global.types";
import EmptyBoxIcon from "./svg/EmptyBoxIcon";

const NoDataFound = ({
  title,
  isLoading = false,
}: {
  title: string;
  isLoading?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  if (!isLoading) {
    return (
      <View style={style.container}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <EmptyBoxIcon height={100} width={100} />
          <Text style={style.txtMessage}>{title}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <ActivityIndicator size={"large"} color={theme.colors?.primary} />
    </View>
  );
};

export default NoDataFound;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.transparent,
    alignItems: "center",
    justifyContent: "center",
  },
  txtMessage: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginTop: 10,
  },
}));
