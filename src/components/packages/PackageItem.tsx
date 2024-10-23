import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles, useTheme } from "react-native-elements";
import { ThemeProps } from "../../types/global.types";
import { HIT_SLOP2, RWF } from "../../constant";
import StarOutlineIcon from "../ui/svg/StarOutlineIcon";
import moment from "moment";
import RatingBox from "../RatingBox";

interface PackageItemProps {
  item: any;
  isCompleted?: boolean;
  onPress: () => void;
  onPressRating: () => void;
  isFromMover?: boolean;
  fromEarning?: boolean;
}

const PackageItem: React.FC<PackageItemProps> = ({
  item,
  isCompleted,
  onPress,
  onPressRating,
  isFromMover,
  fromEarning,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const isReviewPending = item.is_rating == 0;

  const date = moment.utc(item.createdAt).format("DD-MM-YYYY");
  const time = moment.utc(item.createdAt).format("HH:mm A");

  const orderNumber = fromEarning ? item?.order_id : item.order;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={style.container}
    >
      <View style={style.innerCont}>
        <Text numberOfLines={1} style={style.txtAddress}>
          {item?.delivery_point_address}
        </Text>
        <Text
          style={[
            style.txtOrder,
            {
              color: isCompleted
                ? theme.colors?.primary
                : theme.colors?.yellowStar,
            },
          ]}
        >
          order {orderNumber}
        </Text>
      </View>
      <View style={style.innerCont}>
        <Text style={style.txtDate}>
          {date} • {time}
        </Text>
        <Text style={style.txtPrice}>
          {RWF} {Number(item?.price).toFixed(2)}
        </Text>
      </View>
      {isCompleted && (
        <View style={{ marginTop: 5 }}>
          <RatingBox rating={item?.rating?.rate} onlyStar={true} />
        </View>
      )}
      {/* {isReviewPending && isFromMover && isCompleted && (
        <TouchableOpacity
          hitSlop={HIT_SLOP2}
          onPress={onPressRating}
          activeOpacity={0.6}
          style={style.ratingCont}
        >
          <StarOutlineIcon
            height={14}
            width={14}
            color={theme.colors?.primary}
          />
          <Text style={style.txtRating}>Leave your reviews & rating</Text>
        </TouchableOpacity>
      )} */}
    </TouchableOpacity>
  );
};

export default PackageItem;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    borderBottomColor: theme.colors?.borderButtonColor,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 10,
  },
  innerCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtAddress: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    width: "70%",
  },
  txtOrder: {
    fontSize: theme.fontSize?.fs11,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.yellowStar,
  },
  txtPrice: {
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
  },
  txtDate: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
  },
  ratingCont: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txtRating: { color: theme.colors?.primary, marginLeft: 5 },
}));
