import { CommonActions, useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CountryCode,
  TranslationLanguageCodeMap,
} from "react-native-country-picker-modal";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setAdjustPan, setAdjustResize } from "rn-android-keyboard-adjust";
// Relative paths
import { AppImage } from "../../components/AppImage/AppImage";
import CountryPickerModal from "../../components/ui/CountryPickerModal";
import CustomButton from "../../components/ui/CustomButton";
import { CustomTxtInput } from "../../components/ui/CustomTextInput";
import { PhoneNumberInput } from "../../components/ui/PhoneNumberInput";
import SocialAuthenticationView from "../../components/ui/SocialAuth/SocialAuthenticationView";
import { USER_ROLE } from "../../constant";
import { LoginScreenSchema } from "../../constant/formValidations";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { AuthNavigationProps } from "../../types/navigation";
import Scale from "../../utils/Scale";
import { getData } from "../../utils/asyncStorage";
import ReactNativePhoneInput from "react-native-phone-input";
import { userLogin } from "../../store/authentication/authentication.thunks";
import Loading from "../../components/ui/Loading";
import { useSelector } from "react-redux";
import { selectAuthenticationLoading } from "../../store/authentication/authentication.selectors";
import { saveAddress } from "../../store/settings/settings.slice";
import { LoginFormProps } from "../../types/authentication.types";
import { setNavigation } from "../../utils/setNavigation";

const Login: React.FC<AuthNavigationProps<Route.navLogin>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const dispatch = useAppDispatch();
  const navigationRoute = useNavigation();
  const loading = useSelector(selectAuthenticationLoading);

  const emaiRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<ReactNativePhoneInput>(null);

  const [fcmToken, setFcmToken] = useState<string>("");
  const [visibleCountryPicker, setVisibleCountryPicker] =
    useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [countryCode, setCountryCode] = useState<CountryCode>("RW");
  const [country, setCountry] = useState<string | TranslationLanguageCodeMap>(
    ""
  );

  useEffect(() => {
    setAdjustResize();
    return () => {
      setAdjustPan();
    };
  }, []);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      const u_role = await getData(USER_ROLE);
      setUserRole(u_role);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   const Init = async () => {
  //     useGetFCMToken()
  //       .then((token) => {
  //         console.log(" - - - - - - FCM token - - - - - - ", token);
  //         setFcmToken(token);
  //       })
  //       .catch((err) => {
  //         console.log(" - - - - - - FCM token error- - - - - - ", err);
  //       });
  //   };
  //   Init();
  // }, []);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setFieldValue,
  } = useFormik<LoginFormProps>({
    validationSchema: LoginScreenSchema(countryCode),
    initialValues: { phoneNumber: "", password: "" },
    onSubmit: async ({ phoneNumber, password }) => {
      let phone_number = phoneNumber.replace(/ /g, "").replace("-", "");

      const result = await dispatch(
        userLogin({
          phone_number: phone_number.replace("-", ""),
          password,
          is_social: 0,
          device_type: Platform.OS === "ios" ? "iOS" : "Android",
          device_token: fcmToken,
        })
      );
      if (userLogin.fulfilled.match(result)) {
        console.log("result.payload", result.payload);

        if (result.payload?.status == 1) {
          let steps = result.payload?.user?.step;
          let isStepCompleted = result.payload?.user?.is_profile_completed;
          let isVerify_by_Admin =
            result.payload?.user?.is_kyc_verified_by_admin;
          if (isStepCompleted == 1 && isVerify_by_Admin == 1) {
            setNavigation(result.payload?.user, navigationRoute);
          } else {
            if (steps == 0 || steps == 1) {
              navigation.navigate(Route.navAddKyc);
            } else if (steps == 2) {
              navigation.navigate(Route.navTakeSelfie);
            }
          }
          // if (steps !== 2) {
          //   if (steps == 0) {
          //     navigation.navigate(Route.navAddKyc);
          //   }
          // } else {
          //   setNavigation(result.payload?.user, navigationRoute);
          // }
        }
      } else {
        console.log("errror userLogin --->", result.payload);
        if (result.payload?.statusCode === 403) {
          if (result.payload?.status === 2) {
            navigation.navigate(Route.navEnterOTP, {
              phone: phoneNumber,
              type: "otp_verification",
            });
          }
        }
      }
    },
  });

  const onPressSignup = () => {
    navigation.navigate(Route.navSignup);
  };

  const onPressForgotPassword = () => {
    navigation.navigate(Route.navForgotPassword);
  };

  const onPressFlag = () => {
    setFieldValue("phoneNumber", "");
    setVisibleCountryPicker(true);
  };

  const onPhoneInputChange = (value: string, iso2: string) => {
    setCountryCode(iso2);
    setFieldValue("phoneNumber", value);
  };

  const onSelect = (
    country: string | TranslationLanguageCodeMap,
    cca2: CountryCode
  ) => {
    phoneRef?.current?.selectCountry(cca2.toLowerCase());
    setCountryCode(cca2);
    setCountry(country);
    setVisibleCountryPicker(false);
  };

  const onPressCountryPicker = () => {
    setVisibleCountryPicker(true);
  };
  const onClosePickerModal = () => {
    setVisibleCountryPicker(false);
  };

  const onPressBack = () => {
    navigation.navigate(Route.navSelectRoll);
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={style.scrollCont}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={theme.colors?.white}
      />
      {loading === LoadingState.CREATE && <Loading />}
      <View style={style.iconCont}>
        <AppImage
          source={require("../../assets/images/roundedLogo.png")}
          resizeMode="contain"
          style={style.appIcon}
        />
      </View>
      <View style={style.innerCont}>
        <Text style={style.title}>Sign into your zunguka account</Text>
        <Text style={style.title1}>FIll up your details below</Text>
        <View style={style.txtInCont}>
          <PhoneNumberInput
            textInputTitle="Phone Number"
            onPressFlag={onPressFlag}
            onChangePhoneNumber={(value, iso2) =>
              onPhoneInputChange(value, iso2)
            }
            initialValue={values.phoneNumber}
            textProps={{
              placeholder: "Enter your phone number",
              placeholderTextColor: theme.colors?.iconColor,
              style: style.txtInStyle,
              returnKeyLabel: "next",
              returnKeyType: "next",
              maxLength: 18,
            }}
            error={errors.phoneNumber}
          />

          <CountryPickerModal
            country={country}
            countryCode={countryCode}
            visible={visibleCountryPicker}
            onPressCountryPicker={onPressCountryPicker}
            onClosePickerModal={onClosePickerModal}
            onSelect={(country, cca2) => onSelect(country, cca2)}
          />

          <CustomTxtInput
            textInputTitle="Password"
            placeholder="Password"
            ref={passwordRef}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            error={errors.password}
            touched={touched.password}
            returnKeyLabel="done"
            returnKeyType="done"
            rightIcon={true}
          />
        </View>

        <View style={style.btnCont}>
          <CustomButton
            onPress={() => {
              Keyboard.dismiss();
              handleSubmit();
            }}
            title={"Login"}
            buttonWidth="full"
            variant="primary"
            type="solid"
            disabled={!isValid || loading === LoadingState.CREATE}
            loading={loading === LoadingState.CREATE}
          />
        </View>
        <Text onPress={onPressForgotPassword} style={style.txtForgotPassword}>
          Forgot Password?
        </Text>

        <Text style={[style.txtTandC, { marginTop: 20 }]}>
          By signing in, you agree to zunguka{" "}
          <Text style={[style.txtTandC, { color: theme?.colors?.primary }]}>
            terms and conditions
          </Text>{" "}
          and{" "}
          <Text style={[style.txtTandC, { color: theme?.colors?.primary }]}>
            privacy policy
          </Text>
        </Text>
      </View>
      <View style={style.socialLoginCont}>
        {/* <SocialAuthenticationView
            fromLogin={true}
            userRole={userRole}
            fcmToken={fcmToken}
          /> */}
        <Text style={style.txtAlreadyHaveAcc}>
          Don't have an account?{" "}
          <Text onPress={onPressSignup} style={style.txtSignup}>
            Create now!
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  scrollCont: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
  title: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.textPrimary,
    textAlign: "center",
  },
  title1: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
    marginTop: 5,
  },
  iconCont: {
    paddingVertical: 40,
    alignItems: "center",
  },
  txtInCont: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  txtForgotPassword: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
    alignSelf: "center",
    marginTop: 30,
  },
  btnCont: {
    marginTop: 40,
  },
  txtOr: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.textSecondary,
    marginTop: 20,
    alignSelf: "center",
  },
  innerCont: {
    flex: 1,
  },
  txtDontHaveAcc: {
    marginVertical: 10,
    textAlign: "center",
    color: theme.colors?.primaryText,
    paddingBottom: props.insets.bottom,
  },
  txtAlreadyHaveAcc: {
    color: theme.colors?.secondaryText,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    alignSelf: "center",
  },
  txtSignup: {
    color: theme.colors?.primary,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
  },
  socialLoginCont: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  btnBack: {
    marginHorizontal: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  txtInStyle: {
    flex: 1,
    height: Scale(50),
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs16,
    marginLeft: 5,
  },
  txtUserRoll: {
    color: theme.colors?.textPrimary,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    textTransform: "capitalize",
    marginTop: 5,
  },
  appIcon: {
    height: Scale(96),
    width: Scale(96),
  },
  txtTandC: {
    color: theme.colors?.lightGrey,
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    textAlign: "center",
    marginHorizontal: 20,
    lineHeight: 18,
  },
}));
