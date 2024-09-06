import React from "react";
import { Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../types/global.types";
import StarIcon from "./ui/svg/StarIcon";

interface StarWithRateProps {
  totalRateCount: number;
  rate: string;
  starColor: string | undefined;
  textColor: string | undefined;
}

const StarWithRate: React.FC<StarWithRateProps> = ({
  totalRateCount,
  rate,
  starColor,
  textColor,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={style.innerCont}>
      <StarIcon color={starColor} height={18} width={18} />

      <Text style={[style.txtRating, { marginLeft: 10, color: textColor }]}>
        {rate}{" "}
        <Text
          style={[style.txtRating, { color: textColor }]}
        >{`(${totalRateCount})`}</Text>
      </Text>
    </View>
  );
};

export default StarWithRate;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  innerCont: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  txtRating: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
  },
}));
