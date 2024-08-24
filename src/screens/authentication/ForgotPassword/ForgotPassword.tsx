import { useFormik } from "formik";
import React, { useState } from "react";
import { Keyboard, Platform, Text, TouchableOpacity, View } from "react-native";
import {
  CountryCode,
  TranslationLanguageCodeMap,
} from "react-native-country-picker-modal";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ReactNativePhoneInput from "react-native-phone-input";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { AppImage } from "../../../components/AppImage/AppImage";
import CountryPickerModal from "../../../components/ui/CountryPickerModal";
import CustomButton from "../../../components/ui/CustomButton";
import Loading from "../../../components/ui/Loading";
import { PhoneNumberInput } from "../../../components/ui/PhoneNumberInput";
import LeftIcon from "../../../components/ui/svg/LeftIcon";
import { HAS_NOTCH, HIT_SLOP } from "../../../constant";
import { ForgotPasswordScreenSchema } from "../../../constant/formValidations";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { selectAuthenticationLoading } from "../../../store/authentication/authentication.selectors";
import { userForgotPassword } from "../../../store/authentication/authentication.thunks";
import { setSuccess } from "../../../store/global/global.slice";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import { AuthNavigationProps } from "../../../types/navigation";
import Scale from "../../../utils/Scale";
import { ForgotPasswordFormProps } from "../../../types/authentication.types";

const ForgotPassword: React.FC<
  AuthNavigationProps<Route.navForgotPassword>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const phoneRef = React.useRef<ReactNativePhoneInput>(null);

  const loading = useSelector(selectAuthenticationLoading);

  const [visibleCountryPicker, setVisibleCountryPicker] =
    useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("RW");
  const [country, setCountry] = useState<string | TranslationLanguageCodeMap>(
    ""
  );

  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressSignin = () => {
    navigation.navigate(Route.navLogin);
  };
  const onPressFlag = () => {
    setFieldValue("phoneNumber", "");
    setVisibleCountryPicker(true);
  };

  const onPhoneInputChange = (value: string, iso2: string) => {
    setCountryCode(iso2 as CountryCode);
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

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setFieldValue,
  } = useFormik<ForgotPasswordFormProps>({
    validationSchema: ForgotPasswordScreenSchema(countryCode),
    initialValues: { phoneNumber: "" },
    onSubmit: async ({ phoneNumber }) => {
      let phone_number = phoneNumber.replace(/ /g, "").replace("-", "");
      const result = await dispatch(
        userForgotPassword({
          phone_number: phone_number.replace("-", ""),
        })
      );
      if (userForgotPassword.fulfilled.match(result)) {
        console.log("result userForgotPassword --->", result.payload);
        if (result.payload.status === 1) {
          dispatch(setSuccess(result.payload.message));
          navigation.navigate(Route.navEnterOTP, {
            phone: phoneNumber,
            type: "forget_password",
          });
        }
      } else {
        console.log("errror userForgotPassword --->", result.payload);
      }
    },
  });

  return (
    <KeyboardAwareScrollView
      bounces={false}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <TouchableOpacity
        onPress={onPressBack}
        hitSlop={HIT_SLOP}
        style={style.backBtnCont}
      >
        <LeftIcon color={theme.colors?.black} />
      </TouchableOpacity>
      <View style={style.iconCont}>
        <AppImage
          source={require("../../../assets/images/roundedLogo.png")}
          resizeMode="contain"
          style={style.appIcon}
        />
      </View>
      <Text style={style.txtVerificationCode}>Forgot password?</Text>
      <Text style={style.txtVerificationCode1}>Let’s help you reset it!</Text>
      <Text style={style.txtVerificationSentCode}>
        Please enter your mobile number that is linked to your account.
      </Text>
      <View style={style.otpInputCont}>
        <PhoneNumberInput
          ref={phoneRef}
          textInputTitle="Phone Number"
          onPressFlag={onPressFlag}
          onChangePhoneNumber={(value, iso2) => onPhoneInputChange(value, iso2)}
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
        {/* <CustomTxtInput
          textInputTitle="Email"
          placeholder="Enter Email"
          returnKeyType="done"
          returnKeyLabel="done"
          keyboardType={"email-address"}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          error={errors.email}
          touched={touched.email}
        /> */}
      </View>
      <View style={style.bottomCont}>
        <CustomButton
          onPress={() => {
            Keyboard.dismiss();
            handleSubmit();
          }}
          title={"Request code "}
          buttonWidth="full"
          variant="primary"
          type="solid"
          disabled={!isValid || loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
    paddingHorizontal: 20,
  },
  txtVerificationCode: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    textAlign: "center",
    lineHeight: 24,
  },
  txtVerificationCode1: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 5,
  },
  backBtnCont: {
    marginTop: 30,
  },
  txtVerificationSentCode: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginTop: 20,
    lineHeight: 20,
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
    marginBottom: 20,
  },
  txtResendCode: {
    color: theme.colors?.black,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    textDecorationLine: "underline",
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
  },
  iconCont: {
    alignSelf: "center",
    marginBottom: 30,
  },
  txtInStyle: {
    flex: 1,
    height: Scale(50),
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs16,
    marginLeft: 5,
  },
  appIcon: {
    height: Scale(96),
    width: Scale(96),
  },
}));
