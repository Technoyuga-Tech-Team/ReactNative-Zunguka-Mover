import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { makeStyles } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-elements";
import { ThemeProps } from "../types/global.types";
import PlusSquareIcon from "./ui/svg/PlusSquareIcon";
import Scale from "../utils/Scale";

interface UploadPhotosBorderProps {
  title: string;
  onPressUploadImages: () => void;
}

const UploadPhotosBorder: React.FC<UploadPhotosBorderProps> = ({
  title,
  onPressUploadImages,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPressUploadImages}
      activeOpacity={0.8}
      style={style.uploadCont}
    >
      <PlusSquareIcon color={theme?.colors?.black} />
      <Text style={style.txtUploadImg}>{title}</Text>
    </TouchableOpacity>
  );
};

export default UploadPhotosBorder;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  txtTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.primaryText,
  },
  uploadCont: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    height: Scale(108),
    width: Scale(227),
    borderStyle: "dashed",
  },
  txtUploadImg: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    marginTop: 10,
  },
}));
