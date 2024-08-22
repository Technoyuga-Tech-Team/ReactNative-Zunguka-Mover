import { View, Text, Image } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles, useTheme } from "react-native-elements";
import Scale from "../../utils/Scale";
import { AppImage } from "../AppImage/AppImage";
import moment from "moment";
import { Images } from "../../assets/images";
import RatingBox from "../RatingBox";

interface RatingItemContProps {
  item: any;
}

const RatingItemCont: React.FC<RatingItemContProps> = ({ item }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const time = moment(item?.createdAt).startOf("hour").fromNow();
  return (
    <View style={style.container}>
      <AppImage
        source={item?.profile_image || Images.PLACEHOLDER_IMAGE}
        style={style.imgProfile}
        resizeMode="cover"
      />

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <Text numberOfLines={1} style={style.txtName}>
            {item?.first_name} {item?.last_name}
          </Text>
          <Text style={style.txtDate}>{time}</Text>
        </View>
        <RatingBox rating={item?.rate} onlyStar={true} />
        <Text style={style.txtComment}>{item?.comment}</Text>
      </View>
    </View>
  );
};

export default RatingItemCont;

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  imgProfile: {
    height: Scale(65),
    width: Scale(65),
    borderRadius: Scale(65 / 2),

    marginRight: 10,
  },
  txtName: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginBottom: 5,
    width: "70%",
  },
  txtComment: {
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    lineHeight: 18,
    marginTop: 5,
  },
  txtDate: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
  },
}));
