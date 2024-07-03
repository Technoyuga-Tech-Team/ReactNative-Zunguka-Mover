import React from "react";
import {
  // eslint-disable-next-line no-restricted-imports
  Text as RNText,
  StyleProp,
  TextProps as TextProperties,
  TextStyle,
} from "react-native";
import { useTheme } from "react-native-elements";

export interface TextProps extends TextProperties {
  style?: StyleProp<TextStyle>;
  color?: string;
  textAlign?: "auto" | "left" | "right" | "center" | "justify";
  fontFamily?: string;
}

export const Text = ({ children, ...props }: TextProps) => {
  const {
    color,
    style: styleOverride,
    textAlign = "auto",
    fontFamily = "SFProDisplay-Regular",
    ...rest
  } = props;

  const { theme } = useTheme();

  return (
    <RNText
      {...rest}
      style={[
        {
          color: color ? color : theme?.colors?.textColor,
          textAlign: textAlign,
          fontFamily: fontFamily,
        },
        styleOverride,
      ]}
    >
      {children}
    </RNText>
  );
};
