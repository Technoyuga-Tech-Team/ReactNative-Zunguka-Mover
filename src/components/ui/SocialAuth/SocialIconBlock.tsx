import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { makeStyles } from "react-native-elements";
import DropShadow from "react-native-drop-shadow";
import { useTheme } from "react-native-elements";
import Scale from "../../../utils/Scale";
import { Platform } from "react-native";

interface SocialIconBlockProps {
  icon: React.ReactElement;
  onPress?: () => void;
  loading?: boolean;
}

const SocialIconBlock: React.FC<SocialIconBlockProps> = ({
  icon,
  onPress,
  loading,
}) => {
  const { theme } = useTheme();
  const style = useStyle();
  return (
    <DropShadow style={style.shadow}>
      <TouchableOpacity
        disabled={loading}
        onPress={onPress}
        activeOpacity={0.6}
        style={style.container}
      >
        {loading ? <ActivityIndicator color={theme.colors?.primary} /> : icon}
      </TouchableOpacity>
    </DropShadow>
  );
};

export default SocialIconBlock;

const useStyle = makeStyles((theme) => ({
  container: {
    height: Scale(61),
    width: Scale(61),
    backgroundColor: theme.colors?.white,
    borderRadius: Scale(15),
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: theme.colors?.borderButtonColor,
  },
  shadow: {
    shadowColor: "rgba(111, 126, 201, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: Platform.OS === "ios" ? 0.8 : 0.4,
    shadowRadius: 50,
  },
}));
