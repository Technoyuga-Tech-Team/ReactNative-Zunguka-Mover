import React from "react";
import {
  Image,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../../types/global.types";
import Scale from "../../../utils/Scale";
import { AppImage } from "../../AppImage/AppImage";
import { HIT_SLOP2 } from "../../../constant";
import CameraIcon from "../svg/CameraIcon";

interface ProfileImageProps {
  profileImage: string;
  onPressCamera?: () => void;
  showIcon?: boolean;
  imageStyle: StyleProp<ViewStyle>;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  profileImage,
  onPressCamera,
  showIcon = true,
  imageStyle,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const Profile =
    profileImage || require("../../../assets/images/placeholder.jpg");
  return (
    <View style={style.container}>
      <AppImage
        style={[style.profile, imageStyle]}
        source={Profile}
        resizeMode="cover"
      />
      {showIcon && (
        <TouchableOpacity
          onPress={onPressCamera && onPressCamera}
          hitSlop={HIT_SLOP2}
          activeOpacity={0.8}
          style={style.cameraCont}
        >
          <CameraIcon color={theme.colors?.primary} height={20} width={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileImage;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    alignSelf: "center",
  },
  innerCont: {
    flex: 1,
  },
  profile: {
    height: Scale(167),
    width: Scale(167),
    borderRadius: Scale(167 / 2),
  },
  cameraCont: {
    height: Scale(32),
    width: Scale(32),
    borderRadius: Scale(32 / 2),
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: theme.colors?.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
}));
