import * as React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { ViewStyleProps } from "../../types/common.types";
import { HIT_SLOP2, SCREEN_WIDTH } from "../../constant";
import Scale from "../../utils/Scale";

export interface CustomTxtInputProps extends TextInputProps {
  forgotPassword?: boolean;
  icon?: React.ReactElement;
  rightIcon?: boolean;
  onPress?: () => void;
  touched?: boolean;
  error?: string;
  textInputTitle?: string;
  textInputStyle?: ViewStyleProps;
  isBehindFields?: boolean;
  iconPosition?: "right" | "left";
}

export const CustomTxtInput = React.forwardRef<TextInput, CustomTxtInputProps>(
  ({ ...props }, ref) => {
    const styles = useStyles();
    const { theme } = useTheme();

    const [secureTextEntry, setSecureTextEntry] = React.useState<boolean>(true);
    const onPressRightIcon = () => {
      setSecureTextEntry(!secureTextEntry);
    };

    const isRight = props.iconPosition === "right";
    return (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={1}
        style={styles.textInCont}
      >
        {/* {props.textInputTitle && (
          <Text style={styles.txtTextInputTitle}>{props.textInputTitle}</Text>
        )} */}
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={-200}
          style={props.textInputStyle ? props.textInputStyle : styles.txtInCont}
        >
          <View style={styles.vTxtInCont}>
            <View style={styles.iconInputCont}>
              {!isRight && props.icon ? props.icon : null}
              <TextInput
                ref={ref}
                placeholderTextColor={theme?.colors?.secondaryText}
                style={styles.txtInStyle}
                onChangeText={props.onChangeText}
                value={props.value}
                selectionColor={theme?.colors?.primaryLight}
                secureTextEntry={props.rightIcon ? secureTextEntry : false}
                {...props}
              />
              {isRight && props.icon ? props.icon : null}
            </View>
            {props.rightIcon ? (
              <TouchableOpacity hitSlop={HIT_SLOP2} onPress={onPressRightIcon}>
                {secureTextEntry ? (
                  <Text style={styles.txtHideShow}>Show</Text>
                ) : (
                  <Text style={styles.txtHideShow}>Hide</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </KeyboardAvoidingView>
        {props.touched && props.error && (
          <Text
            style={[styles.error, props.isBehindFields && styles.widthError]}
          >
            {props.error}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

export const useStyles = makeStyles((theme) => ({
  txtInCont: {
    height: Scale(53),
    justifyContent: "center",
    backgroundColor: theme?.colors?.transparent,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme?.colors?.secondaryText,
  },
  vTxtInCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txtInStyle: {
    flex: 1,
    height: Scale(50),
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs15,
  },
  iconInputCont: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
    fontFamily: theme.fontFamily?.regular,
  },
  textInCont: {
    marginVertical: 10,
  },
  txtTextInputTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.iconColor,
    marginBottom: 5,
  },
  widthError: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
    width: SCREEN_WIDTH / 2 - 30,
  },
  txtHideShow: {
    fontSize: theme.fontSize?.fs11,
    color: theme.colors?.primary,
    fontFamily: theme?.fontFamily?.regular,
  },
}));
