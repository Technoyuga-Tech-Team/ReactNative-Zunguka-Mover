import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { makeStyles, useTheme } from "react-native-elements";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserData } from "../../types/user.types";
import { HomeRoutes } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import { AppImage } from "../AppImage/AppImage";
import { Images } from "../../assets/images";
import StarOutlineIcon from "../ui/svg/StarOutlineIcon";
import StarIcon from "../ui/svg/StarIcon";
import { RWF } from "../../constant";
import LocationIcon from "../ui/svg/LocationIcon";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";

interface MoverItemProps {
  item: UserData;
  onPressHire?: () => void;
}

const MoverItem: React.FC<MoverItemProps> = ({ item, onPressHire }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        HomeRoutes,
        Route.navDeliveryCompleteAndRateDriver
      >
    >();

  // const onPressMail = () => {
  //   Linking.openURL(`mailto:${item?.email}`);
  // };
  // const onPressPhone = () => {
  //   Linking.openURL(`tel:${item?.phone_number}`);
  // };
  const onPressRate = () => {
    // navigation.navigate(Route.navDeliveryCompleteAndRateDriver);
  };

  const onPressChat = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          {
            name: Route.navBuyerSellerStack,
            state: {
              routes: [{ name: Route.navDashboard }],
            },
          },
          {
            name: Route.navMessaging,
          },
          {
            name: Route.navChatroom,
            params: { receiver_id: item?.id },
          },
        ],
      })
    );
  };

  return (
    <DropShadow style={style.shadow}>
      <TouchableOpacity
        onPress={onPressHire}
        activeOpacity={1}
        style={style.container}
      >
        <View style={style.innerCont}>
          <View style={style.innerCont1}>
            <AppImage
              source={item?.profile_image || Images.PLACEHOLDER_IMAGE}
              style={style.profile}
              resizeMode="cover"
            />
            <View style={style.namePhoneEmailCont}>
              <Text style={style.txtName}>
                {item?.first_name} {item?.last_name}
              </Text>
              <Text numberOfLines={1} style={style?.txtEmailPhone}>
                {item?.phone_number}
              </Text>
              <Text numberOfLines={1} style={style?.txtEmailPhone}>
                {item?.email}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <TouchableOpacity style={style.rateCont} onPress={onPressRate}>
              {item?.avg_rate == 0 ? (
                <StarOutlineIcon
                  color={theme.colors?.golden}
                  style={{ marginRight: 5 }}
                  height={10}
                  width={10}
                />
              ) : (
                <StarIcon
                  color={theme.colors?.golden}
                  style={{ marginRight: 5 }}
                  height={10}
                  width={10}
                />
              )}
              <Text style={style.txtRate}>
                {parseFloat(`${item?.avg_rate}`).toFixed(1)}
              </Text>
            </TouchableOpacity>
            <Text style={style.txtVehicalType}>{item.vehicle_type}</Text>
          </View>
        </View>

        <View style={style.txtCont}>
          <TouchableOpacity style={style.priceCont}>
            <Text numberOfLines={1} style={style?.txtLocationRate}>
              {RWF} {item?.rate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.addressCont}>
            <LocationIcon color={theme?.colors?.grey3} height={15} width={15} />
            <Text numberOfLines={1} style={style?.txtLocationRate}>
              {item?.address || item?.city}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </DropShadow>
  );
};

export default MoverItem;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: theme.colors?.white,
    padding: 10,
    borderRadius: 8,
  },
  profile: {
    height: Scale(56),
    width: Scale(56),
    borderRadius: Scale(56 / 2),
    resizeMode: "cover",
    alignSelf: "flex-start",
    borderWidth: 3,
    borderColor: "rgba(103, 194, 201, 1)",
  },
  txtName: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primaryText,
  },
  txtEmailPhone: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.greyed2Color,
    marginTop: 3,
    width: "80%",
  },
  txtLocationRate: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    marginLeft: 5,
  },
  txtCont: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  txtInnerCont: {
    flexDirection: "row",
    marginTop: 10,
  },
  txtHire: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.white,
  },
  btnHire: {
    height: Scale(40),
    backgroundColor: theme.colors?.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  shadow: {
    shadowColor: theme.colors?.blackTrans,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    height: Scale(150),
  },
  txtRate: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.greyed2Color,
  },
  rateCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txtVehicalType: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    marginTop: 5,
  },
  priceCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 0.5,
  },
  addressCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  innerCont: {
    flexDirection: "row",
  },
  innerCont1: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  namePhoneEmailCont: { marginLeft: 10, flex: 1 },
}));
