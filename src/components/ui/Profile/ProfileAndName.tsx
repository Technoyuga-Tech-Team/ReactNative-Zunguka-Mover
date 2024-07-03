import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../../types/global.types";
import Scale from "../../../utils/Scale";
import { AppImage } from "../../AppImage/AppImage";

interface ProfileAndNameProps {
  name: string;
  email: string;
  profileImage: string;
}

const ProfileAndName: React.FC<ProfileAndNameProps> = ({
  name,
  email,
  profileImage,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const Profile =
    profileImage || require("../../../assets/images/placeholder.jpg");
  return (
    <TouchableOpacity activeOpacity={0.8} style={style.container}>
      <AppImage style={style.profile} source={Profile} resizeMode="cover" />
      <View style={style.txtCont}>
        <Text style={style.txtName}>{name}</Text>
        <Text numberOfLines={2} style={style.txtViewProfile}>
          {email}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileAndName;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollCont: {
    flex: 1,
  },
  profile: {
    height: Scale(64),
    width: Scale(64),
    borderRadius: Scale(64 / 2),
  },
  txtName: {
    fontSize: theme.fontSize?.fs22,
    lineHeight: 28,
    color: theme.colors?.black,
    fontFamily: theme.fontFamily?.bold,
  },
  txtViewProfile: {
    fontSize: theme.fontSize?.fs16,
    color: theme.colors?.black,
    fontFamily: theme.fontFamily?.regular,
    lineHeight: 21,
    marginTop: 2,
    width: "100%",
  },
  txtCont: {
    flex: 1,
    marginLeft: 20,
  },
}));
