import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles, useTheme } from "react-native-elements";
import { ThemeProps } from "../types/global.types";
import StarOutlineIcon from "./ui/svg/StarOutlineIcon";
import StarIcon from "./ui/svg/StarIcon";

interface StarWithRateProps {
  totalRateCount: number;
  rate: string;
}

const StarWithRate: React.FC<StarWithRateProps> = ({
  totalRateCount,
  rate,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={style.innerCont}>
      <StarIcon color={theme.colors?.white} height={18} width={18} />

      <Text style={[style.txtRating, { marginLeft: 10 }]}>
        {rate} <Text style={[style.txtRating]}>{`(${totalRateCount})`}</Text>
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
    color: theme.colors?.white,
  },
}));
