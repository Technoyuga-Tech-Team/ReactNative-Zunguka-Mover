import React from "react";
import { Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../types/global.types";
import Scale from "../utils/Scale";
import LocationIcon from "./ui/svg/LocationIcon";
import PickupLocationIcon from "./ui/svg/PickupLocationIcon";
import VerticlePathDotsIcon from "./ui/svg/VerticlePathDotsIcon";

interface PickupDeliveryContProps {
  pickupAddress: string;
  deliveryAddress: string;
}

const PickupDeliveryCont: React.FC<PickupDeliveryContProps> = ({
  pickupAddress,
  deliveryAddress,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={style.addrCont}>
      <View style={style.iconAddrCont}>
        <View style={style.iconCont}>
          <PickupLocationIcon />
        </View>
        <Text numberOfLines={2} style={style.txtAddresses}>
          {pickupAddress}
        </Text>
      </View>
      <View style={style.iconAddrCont}>
        <View style={style.iconCont}>
          <VerticlePathDotsIcon />
        </View>
        <View />
      </View>
      <View style={style.iconAddrCont}>
        <View style={style.iconCont}>
          <LocationIcon color={theme.colors?.primary} height={22} width={22} />
        </View>
        <Text numberOfLines={2} style={style.txtAddresses}>
          {deliveryAddress}
        </Text>
      </View>
    </View>
  );
};

export default PickupDeliveryCont;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  txtAddresses: {
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    letterSpacing: 0.08,
    width: "80%",
  },
  addrCont: {
    borderBottomColor: theme.colors?.borderButtonColor,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  iconCont: {
    width: Scale(40),
    height: Scale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  iconAddrCont: {
    flexDirection: "row",
    alignItems: "center",
  },
}));
