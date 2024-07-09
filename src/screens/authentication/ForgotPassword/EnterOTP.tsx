import { CommonActions } from "@react-navigation/native";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { AuthNavigationProps } from "../../../types/navigation";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { OTPScreenSchema } from "../../../constant/formValidations";
import { HAS_NOTCH, HIT_SLOP } from "../../../constant";
import Scale from "../../../utils/Scale";
import CustomButton from "../../../components/ui/CustomButton";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import SmoothOtpInput from "../../../components/SmoothOtpInput";
import { AppImage } from "../../../components/AppImage/AppImage";
import LeftIcon from "../../../components/ui/svg/LeftIcon";
import {
  userOTPCode,
  userResendOTP,
} from "../../../store/authentication/authentication.thunks";
import { setSuccess } from "../../../store/global/global.slice";
import { selectAuthenticationLoading } from "../../../store/authentication/authentication.selectors";
import Loading from "../../../components/ui/Loading";
import { saveAddress } from "../../../store/settings/settings.slice";
import { OTPFormProps } from "../../../types/authentication.types";
import { setNavigation } from "../../../utils/setNavigation";

const EnterOTP: React.FC<AuthNavigationProps<Route.navEnterOTP>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectAuthenticationLoading);

  const phone = route?.params?.phone;
  const type = route?.params?.type;

  const [time, setTime] = useState({ minutes: 1, seconds: 0 });

  useEffect(() => {
    startInterval();
    return () => {
      setTime({ seconds: 0, minutes: 0 });
    };
  }, []);

  useEffect(() => {
    if (time.minutes <= 2 && (time.seconds > 0 || time.minutes > 0)) {
      startInterval();
    }
  }, [time.seconds, time.minutes]);

  const startInterval = () => {
    setTimeout(() => {
      if (time.seconds > 0) {
        setTime({ seconds: time.seconds - 1, minutes: time.minutes });
      } else if (time.seconds === 0) {
        if (time.minutes > 0) {
          setTime({ minutes: time.minutes - 1, seconds: 59 });
        }
      }
    }, 1000);
  };

  const onPressResendCode = async () => {
    let phone_number = phone && phone.replace(/ /g, "").replace("-", "");

    let obj = {
      phone_number: phone_number && phone_number.replace("-", ""),
    };

    const result = await dispatch(userResendOTP(obj));
    console.log("result", result);
    if (userResendOTP.fulfilled.match(result)) {
      if (result?.payload?.status === 1) {
        setTime({ seconds: 0, minutes: 1 });
        dispatch(setSuccess(result.payload.message));
      }
    } else {
      console.log("errror userOTPCode --->", result.payload);
    }
  };
  const onPressBack = () => {
    navigation.goBack();
  };

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
  } = useFormik<OTPFormProps>({
    validationSchema: OTPScreenSchema,
    initialValues: { otp: "" },
    onSubmit: async ({ otp }) => {
      let phone_number = phone && phone.replace(/ /g, "").replace("-", "");

      let obj = {
        phone_number: phone_number && phone_number.replace("-", ""),
        action_type: type,
        code: otp,
      };

      const result = await dispatch(userOTPCode(obj));
      if (userOTPCode.fulfilled.match(result)) {
        if (result?.payload?.status === 1) {
          dispatch(setSuccess(result.payload.message));
          if (type === "otp_verification") {
            let steps = result.payload?.data?.step;
            console.log("steps", steps);
            if (steps !== 2) {
              if (steps == 0) {
                navigation.navigate(Route.navAddKyc);
              }
            } else {
              setNavigation(result.payload?.user, navigation);
            }
          } else {
            navigation.navigate(Route.navResetPassword, {
              phone: phone_number && phone_number.replace("-", ""),
            });
          }
        }
      } else {
        console.log("errror userOTPCode --->", result.payload);
      }
    },
  });

  useEffect(() => {
    if (values.otp) {
      if (values.otp.length === 6) {
        Keyboard.dismiss();
        handleSubmit();
      }
    }
  }, [values.otp]);

  return (
    <KeyboardAwareScrollView
      bounces={false}
      keyboardShouldPersistTaps={"handled"}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={onPressBack}
          hitSlop={HIT_SLOP}
          style={style.backBtnCont}
        >
          <LeftIcon color={theme.colors?.black} />
        </TouchableOpacity>
        <Text style={style.txtOtpVerification}>Otp verification</Text>
        <TouchableOpacity style={style.backBtnCont}>
          <LeftIcon color={theme.colors?.transparent} />
        </TouchableOpacity>
      </View>

      <Text style={style.txtDigitCode1}>Almost done!</Text>

      <Text style={style.txtDigitCode1}>We've sent a code to {phone}.</Text>

      <AppImage
        source={require("../../../assets/images/MessagesOTP.png")}
        resizeMode="contain"
        style={style.icon}
      />

      <View style={style.otpInputCont}>
        <SmoothOtpInput
          animated={false}
          cellSize={Scale(50)}
          cellSpacing={10}
          onChangeText={handleChange("otp")}
          onTextChange={handleChange("otp")}
          //   onBlur={handleBlur("otp")}
          value={values.otp}
          error={errors.otp}
          touched={touched.otp}
          codeLength={6}
        />

        <Text style={style.txtDidntReceiveCode}>
          {time.minutes === 0 && time.seconds === 0 ? (
            <Text onPress={onPressResendCode} style={style.txtResendCode}>
              Resend code
            </Text>
          ) : (
            <Text style={{ color: theme.colors?.pinkDark }}>
              {time.minutes}:
              {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
            </Text>
          )}
        </Text>
      </View>
      <View style={style.bottomCont}>
        <CustomButton
          disabled={!isValid}
          onPress={() => {
            Keyboard.dismiss();
            handleSubmit();
          }}
          title={"Verify Now"}
          buttonWidth="full"
          variant="primary"
          type="solid"
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EnterOTP;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
    paddingHorizontal: 20,
  },
  txtVerificationCode: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
  },
  backBtnCont: {
    marginVertical: 30,
  },
  txtVerificationSentCode: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginTop: 20,
  },
  otpInputCont: {
    flex: 1,
    marginTop: 20,
  },
  bottomCont: {
    paddingBottom:
      Platform.OS === "ios"
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
  },
  txtDidntReceiveCode: {
    color: theme.colors?.secondaryText,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    alignSelf: "center",
    marginVertical: 20,
  },
  txtResendCode: {
    color: theme.colors?.primary,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
  },
  txtDigitCode: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: "#444444",
  },
  txtDigitCode1: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme?.colors?.lightGrey,
    lineHeight: 16,
    textAlign: "center",
  },
  txtPhone: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
  },
  txtOtpVerification: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primaryText,
    alignSelf: "center",
  },
  icon: {
    height: Scale(230),
    width: Scale(230),
    alignSelf: "center",
  },
}));
