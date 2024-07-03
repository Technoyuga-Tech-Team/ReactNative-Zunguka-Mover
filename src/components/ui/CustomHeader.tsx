import { useNavigation } from "@react-navigation/native";
import React, { ReactElement } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HIT_SLOP } from "../../constant";
import Scale from "../../utils/Scale";
import CloseIcon from "./svg/CloseIcon";
import RightIcon from "./svg/RightIcon";

interface CustomHeaderProps {
  title?: string;
  rightView?: ReactElement;
  isClosedIcon?: boolean;
  isOutsideBack?: boolean;
  onPressBackBtn?: () => void;
  backgroundColor?: string;
  textColor?: string;
  isBackVisible?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  rightView,
  isClosedIcon = false,
  isOutsideBack = false,
  onPressBackBtn,
  backgroundColor,
  textColor,
  isBackVisible = true,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <View>
      <View style={[style.container, { backgroundColor }]}>
        {isBackVisible && (
          <TouchableOpacity
            onPress={isOutsideBack ? onPressBackBtn : onPressBack}
            hitSlop={HIT_SLOP}
            style={style.backBtnCont}
          >
            {isClosedIcon ? (
              <CloseIcon color={theme.colors?.black} />
            ) : (
              <RightIcon
                color={textColor || theme.colors?.black}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            )}
          </TouchableOpacity>
        )}
        <View style={style.rightCont}>{rightView}</View>
      </View>
      {title && (
        <Text
          style={[
            style.txtTitle,
            textColor ? { color: textColor } : { color: theme.colors?.black },
          ]}
        >
          {title}
        </Text>
      )}
    </View>
  );
};

export default CustomHeader;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors?.background,
    height: Scale(50),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  backBtnCont: {
    height: Scale(50),
    width: Scale(50),
    alignItems: "center",
    justifyContent: "center",
  },
  rightCont: {
    height: Scale(50),
    minWidth: Scale(50),
    alignItems: "center",
    justifyContent: "center",
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    position: "absolute",
    alignSelf: "center",
    bottom: Scale(12),
  },
}));
