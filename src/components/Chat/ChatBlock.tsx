import moment from "moment";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { selectUserData } from "../../store/settings/settings.selectors";
import { ChatDataList } from "../../types/chat.types";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";
import { AppImage } from "../AppImage/AppImage";
import { Images } from "../../assets/images";

interface ChatBlockProps {
  item: ChatDataList;
  onPress: () => void;
}

const ChatBlock: React.FC<ChatBlockProps> = ({ item, onPress }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const profile = item?.profile_image || Images.PLACEHOLDER_IMAGE;
  const time = moment(item?.updated_at).fromNow();
  const userData = useSelector(selectUserData);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={style.container}
    >
      <View style={style.firstCont}>
        <AppImage source={profile} style={style.profile} resizeMode="cover" />
        <View style={style.centerCont}>
          <Text style={style.txtName}>{item?.username}</Text>
          {item?.is_image == 1 ? (
            <View style={style.lastImgCont}>
              <AppImage
                source={Images.PLACEHOLDER_IMAGE}
                style={{ height: 15, width: 15, borderRadius: 3 }}
                resizeMode="cover"
              />
              <Text style={[style.txtChat, { marginLeft: 5 }]}>Photo</Text>
            </View>
          ) : (
            <Text numberOfLines={2} style={style.txtChat}>
              {item?.message}
            </Text>
          )}
        </View>
      </View>
      <View style={style.lastCont}>
        <Text style={style.txtTime}>{time}</Text>
        {item?.sender_id !== userData.id && (
          <>
            {item.is_read == 0 && (
              <>
                {Number(item?.totalUnreadMessages) > 0 && (
                  <View style={style.unreadMessageCont}>
                    <Text style={style.txtUnreadMessage}>
                      {item.totalUnreadMessages}
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatBlock;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    height: Scale(90),
    borderBottomColor: theme.colors?.borderButtonColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  profile: {
    height: Scale(56),
    width: Scale(56),
    borderRadius: Scale(56 / 2),
  },
  firstCont: {
    flexDirection: "row",
    height: Scale(90),
    paddingVertical: 10,
    flex: 1,
  },
  centerCont: {
    marginLeft: 10,
    flex: 1,
  },
  lastCont: {
    height: Scale(90),
    paddingVertical: 10,
  },
  txtName: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
  txtChat: {
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.greyed,
  },
  txtLastMessage: {
    fontSize: theme.fontSize?.fs11,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.greyed,
    marginTop: 4,
  },
  txtTime: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.greyed,
  },
  txtUnreadMessage: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.white,
  },
  unreadMessageCont: {
    height: Scale(25),
    width: Scale(25),
    borderRadius: Scale(25 / 2),
    alignSelf: "flex-end",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors?.primary,
    overflow: "hidden",
  },
  lastImgCont: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
}));
