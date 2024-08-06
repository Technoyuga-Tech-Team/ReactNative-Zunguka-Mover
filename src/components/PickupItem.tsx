import moment from "moment";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../types/global.types";
import Scale from "../utils/Scale";
import PickupDeliveryCont from "./PickupDeliveryCont";

interface PickupItemProps {
  item: any;
  onPress: () => void;
  fromRequestPage?: boolean;
  isfromMover?: boolean;
  onPressShowDetails: () => void;
}

const getStatusStrings = (status: string, fromRequestPage: boolean) => {
  if (fromRequestPage) {
    return status === "pending"
      ? "Request Pending"
      : status === "startjob"
      ? "Ongoing Job"
      : status === "completed"
      ? "Wait For The Start Job"
      : status === "confirmed"
      ? "Pay To Mover"
      : "";
  } else {
    return status === "pending"
      ? "Request Pending"
      : status === "startjob"
      ? "Ongoing Job"
      : status === "completed"
      ? "Start This Job"
      : status === "confirmed"
      ? "Waiting For Payment"
      : "";
  }
};

const PickupItem: React.FC<PickupItemProps> = ({
  item,
  onPress,
  fromRequestPage,
  isfromMover,
  onPressShowDetails,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const time = moment(item?.createdAt).startOf("hour").fromNow();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={style.container}
    >
      <View style={style.topCont}>
        <Text style={style.txtDate}>{time}</Text>
        <Text style={style.txtDate}>${item?.price}</Text>
      </View>
      <PickupDeliveryCont
        pickupAddress={item.pickup_point_address}
        deliveryAddress={item.delivery_point_address}
      />
      <View style={style.bottomCont}>
        {isfromMover ? (
          <TouchableOpacity onPress={onPressShowDetails} activeOpacity={0.8}>
            <Text
              style={[
                style.txtProductType,
                {
                  color: theme?.colors?.black,
                  fontSize: theme?.fontSize?.fs14,
                  fontFamily: theme?.fontFamily?.bold,
                },
              ]}
            >
              {"View Order Details"}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={style.txtProductType}>{item.item_name}</Text>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              style.txtProductType,
              {
                color:
                  item.status === "confirmed" || item.status === "completed"
                    ? theme.colors?.primary
                    : item.status === "startjob"
                    ? theme.colors?.golden
                    : theme.colors?.golden,
              },
            ]}
          >
            {getStatusStrings(item.status, fromRequestPage)}
            {/* {item.status} */}
          </Text>
          {/* {isfromMover && (
            <TouchableOpacity
              style={{ marginLeft: 5 }}
              onPress={onPressShowDetails}
              activeOpacity={0.8}
              hitSlop={HIT_SLOP2}
            >
              <InfocircleIcon
                color={theme?.colors?.greyedColor}
                height={20}
                width={20}
              />
            </TouchableOpacity>
          )} */}
          {/* {fromRequestPage && item.status !== "pending" && (
            <TouchableOpacity
              style={{ marginLeft: 5 }}
              onPress={onPressMessage}
              activeOpacity={0.8}
              hitSlop={HIT_SLOP2}
            >
              <ChatFillIcon
                color={theme?.colors?.primary}
                height={28}
                width={28}
              />
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PickupItem;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: theme.colors?.white,
    overflow: "hidden",
  },
  topCont: {
    height: Scale(35),
    borderTopLeftRadius: Scale(8),
    borderTopRightRadius: Scale(8),
    backgroundColor: theme.colors?.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  txtDate: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
  txtProductType: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.grey0,
  },
  bottomCont: {
    height: Scale(35),
    borderBottomLeftRadius: Scale(8),
    borderBottomRightRadius: Scale(8),
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shadow: {
    shadowColor: theme.colors?.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // height: Scale(140),
  },
}));
