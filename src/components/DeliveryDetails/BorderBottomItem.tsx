import React from "react";
import { Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../types/global.types";
import BlurView from "react-native-blur-effect";

interface BorderBottomItemProps {
  title: string;
  value: string;
  from_mover: boolean;
  txtColor?: string;
  numberOfLines?: number;
  showblur?: boolean;
}

const BorderBottomItem: React.FC<BorderBottomItemProps> = ({
  title,
  value,
  from_mover,
  txtColor,
  numberOfLines = 1,
  showblur = false,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  if (from_mover) {
    return (
      <View style={style.container}>
        <View style={style.titleCont}>
          <Text style={style.txt}>{title}</Text>
        </View>
        <View style={style.valueCont}>
          <Text
            numberOfLines={numberOfLines}
            style={[
              style.txt,
              {
                color: txtColor ? txtColor : theme.colors?.textSecondary,
                fontSize: theme.fontSize?.fs12,
              },
            ]}
          >
            {value}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <>
        <View style={[style.container, { flexDirection: "row" }]}>
          <View style={style.titleCont}>
            <Text style={style.txt}>{title}</Text>
          </View>
          <View
            style={[
              style.valueCont,
              { alignItems: "flex-end", justifyContent: "center" },
            ]}
          >
            <Text numberOfLines={numberOfLines} style={[style.txt]}>
              {value}
            </Text>
          </View>
        </View>
        {showblur && <BlurView style={style.absolute} blurRadius={3} />}
      </>
    );
  }
};

export default BorderBottomItem;
const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    height: "auto",
    borderBottomColor: "#F5F7FA",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  titleCont: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  valueCont: {
    flex: 1,
  },
  txt: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
  absolute: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}));
