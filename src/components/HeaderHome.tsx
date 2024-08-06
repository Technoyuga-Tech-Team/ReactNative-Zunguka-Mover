import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { Images } from "../assets/images";
import { makeStyles, useTheme } from "react-native-elements";
import { ThemeProps } from "../types/global.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Scale from "../utils/Scale";
import { HIT_SLOP2, SCREEN_WIDTH } from "../constant";
import MarqueeText from "react-native-marquee";
import BellIcon from "./ui/svg/BellIcon";
import StarWithRate from "./StarWithRate";

interface HeaderHomeProps {
  name: string;
  onPressNotification: () => void;
  avgRate: number;
  totalUserRate: number;
}

const HeaderHome: React.FC<HeaderHomeProps> = ({
  name,
  onPressNotification,
  avgRate,
  totalUserRate,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={Images.HEADER_HOME_IMAGE}
      resizeMode="cover"
      style={style.imageHeader}
    >
      <View style={style.InnerCont}>
        <View style={style.nameCont}>
          <View style={style.nameInnerCont}>
            {/* <Text numberOfLines={1} style={style.txtName}>{`Hi ${name}!`}</Text> */}
            <MarqueeText
              style={style.txtName}
              speed={1}
              marqueeOnStart={true}
              loop={true}
              delay={1000}
            >
              {`Hi ${name}!`}
            </MarqueeText>
            <Text style={style.txtTitle}>Stay safe on the road!</Text>
          </View>
          <TouchableOpacity
            hitSlop={HIT_SLOP2}
            activeOpacity={0.8}
            style={style.notificationCont}
            onPress={onPressNotification}
          >
            <BellIcon color={theme?.colors?.primaryVibrant} />
          </TouchableOpacity>
        </View>
        <View>
          <StarWithRate
            rate={Number(avgRate).toFixed(1)}
            totalRateCount={totalUserRate}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default HeaderHome;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  imageHeader: {
    height: Scale(164),
    width: SCREEN_WIDTH,
  },
  InnerCont: {
    flex: 1,
    paddingTop: props.insets.top,
    margin: 15,
    justifyContent: "flex-end",
  },
  notificationCont: {
    height: Scale(32),
    width: Scale(32),
    borderRadius: Scale(32 / 2),
    backgroundColor: theme?.colors?.borderButtonColor,
    alignItems: "center",
    justifyContent: "center",
  },
  txtName: {
    fontSize: theme.fontSize?.fs28,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.white,
    letterSpacing: 0.36,
    lineHeight: 34,
    width: "90%",
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
    lineHeight: 18,
    textTransform: "capitalize",
  },
  nameCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameInnerCont: { flex: 1 },
  txtSearch: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.grey11,
    height: Scale(18),
  },
  searchCont: {
    height: Scale(50),
    width: "100%",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: theme?.colors?.white,
    marginTop: 10,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
}));
