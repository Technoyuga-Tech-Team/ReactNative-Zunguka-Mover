import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles, useTheme } from "react-native-elements";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";

interface PredefineOTPCodeViewProps {
  OTP: string;
}

const PredefineOTPCodeView: React.FC<PredefineOTPCodeViewProps> = ({ OTP }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={style.container}>
      <Text style={style.txtTitle}>
        Use the below code to collect the package from the mover.
      </Text>
      <View style={style.otpCont}>
        <Text style={style.txtOTP}>{OTP}</Text>
      </View>
    </View>
  );
};

export default PredefineOTPCodeView;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  otpCont: {
    height: Scale(55),
    width: Scale(255),
    backgroundColor: theme.colors?.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  txtOTP: {
    fontSize: theme.fontSize?.fs28,
    lineHeight: 34,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
    lineHeight: 16,
  },
}));
