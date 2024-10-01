import moment from "moment";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "../../assets/images";
import { GetNotificationDataList } from "../../types/notification.types";
import Scale from "../../utils/Scale";
import { AppImage } from "../AppImage/AppImage";

interface NotificationItemProps {
  item: GetNotificationDataList;
  onPressItem: () => void;
}
const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onPressItem,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const time = moment(item?.created_at).fromNow();
  const is_unread = item.is_read == 0;

  return (
    <TouchableOpacity onPress={onPressItem}>
      <View
        style={[
          style.container,
          {
            backgroundColor: is_unread
              ? theme?.colors?.backgroundLight1
              : theme?.colors?.white,
          },
        ]}
      >
        <View style={style.imgCont}>
          <AppImage
            source={
              item.buyer_seller?.profile_image || Images.PLACEHOLDER_IMAGE
            }
            style={style.profile}
            resizeMode="cover"
          />
        </View>
        <View style={style.txtCont}>
          <Text style={style.txtTitle}>{item.message}</Text>
          <Text style={style.txtTime}>{time}</Text>
        </View>
        {is_unread && <View style={style.dot} />}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const useStyles = makeStyles((theme) => ({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  imgCont: {
    alignItems: "flex-start",
    marginRight: 10,
    minHeight: Scale(65),
  },
  txtCont: {
    paddingBottom: 10,
    borderBottomColor: theme.colors?.borderButtonColor,
    borderBottomWidth: 1,
    flex: 1,
  },
  profile: {
    height: Scale(48),
    width: Scale(48),
    borderRadius: Scale(48 / 2),
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
  },
  txtTime: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    marginTop: 10,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: theme?.colors?.primary,
  },
}));
