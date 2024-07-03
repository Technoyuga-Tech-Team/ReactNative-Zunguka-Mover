import React, { ReactElement } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles, useTheme } from "react-native-elements";
import { ThemeProps } from "../../../types/global.types";
import Scale from "../../../utils/Scale";
import RightIcon from "../svg/RightIcon";

interface ProfileItemProps {
  icon?: ReactElement;
  name: string;
  onPress?: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, name, onPress }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={style.container}
    >
      <View style={style.innerCont}>
        {icon}
        <Text style={style.txtName}>{name}</Text>
      </View>
      <RightIcon color={"#B8B5B5"} />
    </TouchableOpacity>
  );
};

export default ProfileItem;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    height: Scale(48),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors?.border,
    marginTop: 20,
  },
  innerCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  txtName: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    lineHeight: 16,
    color: theme.colors?.black,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
}));
