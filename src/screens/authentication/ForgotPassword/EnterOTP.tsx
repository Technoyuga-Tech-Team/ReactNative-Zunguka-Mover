import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { AppImage } from "../../../components/AppImage/AppImage";
import SmoothOtpInput from "../../../components/SmoothOtpInput";
import CustomButton from "../../../components/ui/CustomButton";
import Loading from "../../../components/ui/Loading";
import LeftIcon from "../../../components/ui/svg/LeftIcon";
import { HAS_NOTCH, HIT_SLOP } from "../../../constant";
import { OTPScreenSchema } from "../../../constant/formValidations";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { selectAuthenticationLoading } from "../../../store/authentication/authentication.selectors";
import {
  userOTPCode,
  userResendOTP,
} from "../../../store/authentication/authentication.thunks";
import { setSuccess } from "../../../store/global/global.slice";
import { OTPFormProps } from "../../../types/authentication.types";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import { AppRoutes, AuthNavigationProps } from "../../../types/navigation";
import { formatPhoneNumber } from "../../../utils";
import Scale from "../../../utils/Scale";
import { setNavigation } from "../../../utils/setNavigation";

const INITIAL_TIME = { minutes: 1, seconds: 0 };
let store_time = { minutes: 1, seconds: 0 };
const EnterOTP: React.FC<AuthNavigationProps<Route.navEnterOTP>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigationState = useNavigation<NavigationProp<AppRoutes>>();
  const loading = useSelector(selectAuthenticationLoading);

  const phone = route?.params?.phone || "";
  const type = route?.params?.type;

  const timerRef = useRef();

  const [time, setTime] = useState(INITIAL_TIME);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        storeTimerTime(); // Store time in AsyncStorage on background
      } else if (nextAppState === "active") {
        retrieveTimerTime(); // Retrieve time from AsyncStorage on foreground
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    startInterval();
    return () => {
      setTime({ seconds: 0, minutes: 0 });
      store_time = { seconds: 0, minutes: 0 };
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (time.minutes <= 2 && (time.seconds > 0 || time.minutes > 0)) {
      startInterval();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [time.seconds, time.minutes]);

  const startInterval = () => {
    // @ts-ignore
    timerRef.current = setTimeout(() => {
      if (time.seconds > 0) {
        setTime({ seconds: time.seconds - 1, minutes: time.minutes });
        store_time = { seconds: time.seconds - 1, minutes: time.minutes };
      } else if (time.seconds === 0) {
        if (time.minutes > 0) {
          setTime({ minutes: time.minutes - 1, seconds: 59 });
          store_time = { minutes: time.minutes - 1, seconds: 59 };
        }
      }
    }, 1000);
  };

  const storeTimerTime = async () => {
    try {
      const timestamp = Date.now(); // Get current timestamp
      const data = JSON.stringify({ timestamp, timerDuration: store_time });
      await AsyncStorage.setItem("timerData", data);
    } catch (error) {
      console.error("Error storing timer time:", error);
    }
  };

  const retrieveTimerTime = async () => {
    try {
      const data = await AsyncStorage.getItem("timerData");
      if (data !== null) {
        const parsedData = JSON.parse(data);
        const storedTimestamp = parsedData.timestamp;
        const elapsedTime = Date.now() - storedTimestamp;
        const remainingTime = Math.max(
          0,
          parsedData.timerDuration.minutes * 60 +
            parsedData.timerDuration.seconds -
            elapsedTime / 1000
        ); // Calculate remaining time in seconds
        const calculatedMinutes = Math.floor(remainingTime / 60);
        const calculatedSeconds = Math.floor(remainingTime % 60);
        setTime({ minutes: calculatedMinutes, seconds: calculatedSeconds });
        store_time = { minutes: calculatedMinutes, seconds: calculatedSeconds };
      } else {
        console.log("No timer data found, resetting timer.");
        setTime(INITIAL_TIME); // Reset timer if no data is found
        store_time = INITIAL_TIME;
      }
    } catch (error) {
      console.error("Error retrieving timer time:", error);
    }
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
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: Route.navAddKyc }],
                  })
                );
              }
            } else {
              setNavigation(result.payload?.user, navigationState);
            }
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAddKyc,
                    params: {
                      phone: phone_number && phone_number.replace("-", ""),
                    },
                  },
                ],
              })
            );
            // navigation.navigate(Route.navResetPassword, {
            //   phone: phone_number && phone_number.replace("-", ""),
            // });
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

      <Text style={style.txtDigitCode1}>
        We've sent a code to {formatPhoneNumber(phone)}.
      </Text>

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
