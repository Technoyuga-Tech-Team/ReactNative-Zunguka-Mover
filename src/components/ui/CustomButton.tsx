import React, { ReactElement } from "react";
import { Platform, View } from "react-native";
import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
  makeStyles,
  useTheme,
} from "react-native-elements";
import Scale from "../../utils/Scale";
import { SCREEN_WIDTH } from "../../constant";

interface CustomButtonProps extends RNEButtonProps {
  variant?: "primary" | "secondary";
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  rightIcon?: ReactElement;
  icon?: ReactElement;
  buttonWidth: "half" | "full";
  width?: number;
  marginTop?: number;
  backgroundColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = (props) => {
  const {
    variant = "secondary",
    iconColor,
    buttonStyle,
    titleStyle,
    containerStyle,
    type,
    rightIcon,
    icon,
    buttonWidth,
    width,
    marginTop,
    backgroundColor,
    ...otherProps
  } = props;
  const styles = useStyles(props);
  const { theme } = useTheme();
  return (
    <View
      style={[
        variant === "primary"
          ? styles.primaryContainer
          : styles.secondaryContainer,
        containerStyle,
        { justifyContent: "center", marginTop: marginTop },
      ]}
    >
      <RNEButton
        type={type}
        containerStyle={[
          variant === "primary"
            ? styles.primaryContainer
            : styles.secondaryContainer,
          containerStyle,
        ]}
        buttonStyle={[
          variant === "primary" ? styles.primary : styles.secondary,
          buttonStyle,
          type === "outline" &&
            variant === "secondary" &&
            styles.secondaryOutline,
          {
            backgroundColor:
              variant === "primary" && type !== "outline"
                ? backgroundColor
                : theme?.colors?.transparent,
          },
        ]}
        titleStyle={[
          variant === "primary" ? styles.primaryTitle : styles.secondaryTitle,
          titleStyle,
          type === "outline" &&
            variant === "secondary" &&
            styles.txtSecondaryOutline,
        ]}
        icon={icon}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
      />

      {buttonWidth === "half" && rightIcon && (
        <View
          style={{
            position: "absolute",
            right: 10,
          }}
        >
          {rightIcon}
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles((theme, props: CustomButtonProps) => ({
  shadow: {
    shadowColor: "rgba(111, 126, 201, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: Platform.OS === "ios" ? 0.8 : 0.4,
    shadowRadius: 50,
  },
  primaryContainer: {
    height: Scale(56),
    alignSelf: "center",
    borderRadius: Scale(32),
    backgroundColor: theme.colors?.primary,
  },
  secondaryContainer: {
    height: Scale(56),
    alignSelf: "center",
    borderRadius: Scale(32),
  },
  primary: {
    borderRadius: Scale(32),
    height: Scale(56),
    width: props.buttonWidth === "half" ? props.width : SCREEN_WIDTH - 40,
    backgroundColor: theme.colors?.primary,
  },
  secondary: {
    backgroundColor:
      props.type === "outline" || props.type === "clear"
        ? "transparent"
        : theme.colors?.secondary,
  },
  primaryTitle: {
    fontFamily: theme.fontFamily?.medium,
    fontSize: theme.fontSize?.fs16,
  },
  secondaryTitle: {
    color: theme.colors?.buttonText,
    fontFamily: theme.fontFamily?.medium,
    fontSize: theme.fontSize?.fs16,
  },
  txtSecondaryOutline: {
    color: theme.colors?.primary,
    fontFamily: theme.fontFamily?.medium,
    fontSize: theme.fontSize?.fs16,
  },
  secondaryOutline: {
    borderColor: theme?.colors?.primary,
    borderWidth: 1,
    borderRadius: Scale(32),
    height: Scale(56),
    width: props.buttonWidth === "half" ? props.width : SCREEN_WIDTH - 40,
  },
  icon: {
    marginHorizontal: 3,
  },
}));

export default CustomButton;
