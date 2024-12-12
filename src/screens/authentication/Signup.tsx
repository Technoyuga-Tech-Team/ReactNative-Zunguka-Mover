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
import ReactNativePhoneInput from "react-native-phone-input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { setAdjustPan, setAdjustResize } from "rn-android-keyboard-adjust";

import CountryPickerModal from "../../components/ui/CountryPickerModal";
import CustomButton from "../../components/ui/CustomButton";
import { CustomTxtInput } from "../../components/ui/CustomTextInput";
import InputFieldInfo from "../../components/ui/InputFieldInfo";
import Loading from "../../components/ui/Loading";
import { PhoneNumberInput } from "../../components/ui/PhoneNumberInput";
import TermsAndCondition from "../../components/ui/TermsAndCondition";
import { HAS_NOTCH, MAX_CHAR_LENGTH, USER_ROLE } from "../../constant";
import { SignupScreenSchema } from "../../constant/formValidations";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectAuthenticationLoading } from "../../store/authentication/authentication.selectors";
import { userRegistration } from "../../store/authentication/authentication.thunks";
import { setErrors } from "../../store/global/global.slice";
import { SignupFormProps } from "../../types/authentication.types";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { AuthNavigationProps } from "../../types/navigation";
import { keepSingleSpace } from "../../utils";
import { getData } from "../../utils/asyncStorage";
import Scale from "../../utils/Scale";
import { useGetFCMToken } from "../../hooks/useGetFCMToken";

const Signup: React.FC<AuthNavigationProps<Route.navSignup>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectAuthenticationLoading);

  const firstNameRef = React.useRef<TextInput>(null);
  const lastnameRef = React.useRef<TextInput>(null);
  const usernameRef = React.useRef<TextInput>(null);
  const emaiRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<ReactNativePhoneInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);

  const [visibleCountryPicker, setVisibleCountryPicker] =
    useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("RW");
  const [country, setCountry] = useState<string | TranslationLanguageCodeMap>(
    ""
  );

  const [checked, setChecked] = React.useState(false);
  const [fcmToken, setFcmToken] = React.useState<string>("");
  const toggleCheckbox = () => setChecked(!checked);

  const [userRole, setUserRole] = useState<string>("");

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

  useEffect(() => {
    const Init = async () => {
      useGetFCMToken().then((token) => {
        console.log(" - - - - - - FCM token - - - - - - ", token);
        token && setFcmToken(token);
      });
    };
    Init();
  }, []);

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
  } = useFormik<SignupFormProps>({
    validationSchema: SignupScreenSchema(countryCode),
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      createPassword: "",
      confirmPassword: "",
      username: "",
    },
    validateOnChange: true,
    onSubmit: async ({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      createPassword,
      confirmPassword,
    }) => {
      let phone_number = phoneNumber.replace(/ /g, "").replace("-", "");

      const result = await dispatch(
        userRegistration({
          first_name: keepSingleSpace(firstName.trim()),
          last_name: keepSingleSpace(lastName.trim()),
          username: username.trim(),
          email: email.trim(),
          password: createPassword.trim(),
          phone_number: phone_number.replace("-", ""),
          iso: countryCode.toLowerCase(),
          device_type: Platform.OS === "ios" ? "iOS" : "Android",
          device_token: fcmToken,
        })
      );
      if (userRegistration.fulfilled.match(result)) {
        if (result.payload) {
          console.log("result", result);
          navigation.navigate(Route.navEnterOTP, {
            phone: phoneNumber,
            type: "otp_verification",
          });
        }
      }
    },
  });

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
      <View style={style.innerCont}>
        <Text style={style.title}>Create an account</Text>
        <Text style={style.title1}>FIll up your details below</Text>
        <View style={style.txtInCont}>
          <CustomTxtInput
            textInputTitle="First Name"
            ref={firstNameRef}
            placeholder="First name"
            returnKeyType="next"
            returnKeyLabel="next"
            keyboardType={"default"}
            maxLength={MAX_CHAR_LENGTH}
            onChangeText={handleChange("firstName")}
            // onBlur={handleBlur("firstName")}
            value={values.firstName}
            error={errors.firstName}
            touched={touched.firstName}
            onSubmitEditing={() => lastnameRef.current?.focus()}
          />
          <InputFieldInfo text={"Name should match with your ID card."} />

          <CustomTxtInput
            textInputTitle="Last Name"
            ref={lastnameRef}
            placeholder="Last name"
            returnKeyType="next"
            returnKeyLabel="next"
            keyboardType={"default"}
            maxLength={MAX_CHAR_LENGTH}
            onChangeText={handleChange("lastName")}
            value={values.lastName}
            error={errors.lastName}
            touched={touched.lastName}
            onSubmitEditing={() => usernameRef.current?.focus()}
          />
          <InputFieldInfo text={"Name view only for admin."} />
          <InputFieldInfo
            text={
              "First name and last name cannot be changed after admin accepts the name as per the ID."
            }
          />

          <CustomTxtInput
            textInputTitle="Username"
            ref={usernameRef}
            placeholder="Username"
            returnKeyType="next"
            returnKeyLabel="next"
            keyboardType={"default"}
            maxLength={MAX_CHAR_LENGTH}
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            error={errors.username}
            touched={touched.username}
            onSubmitEditing={() => emaiRef.current?.focus()}
          />
          <InputFieldInfo text={"Username view for publicly"} />
          <CustomTxtInput
            textInputTitle="Email Address"
            ref={emaiRef}
            placeholder="Email Address"
            returnKeyType="next"
            returnKeyLabel="next"
            keyboardType={"email-address"}
            onChangeText={handleChange("email")}
            // onBlur={handleBlur("email")}
            value={values.email}
            error={errors.email}
            touched={touched.email}
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <PhoneNumberInput
            ref={phoneRef}
            textInputTitle="Phone Number"
            onPressFlag={onPressFlag}
            onChangePhoneNumber={(value, iso2) =>
              onPhoneInputChange(value, iso2)
            }
            initialValue={values.phoneNumber}
            textProps={{
              placeholder: "Phone Number",
              placeholderTextColor: theme.colors?.secondaryText,
              style: style.txtInStyle,
              returnKeyLabel: "next",
              returnKeyType: "next",
              maxLength: 18,
              onSubmitEditing: () => passwordRef.current?.focus(),
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
            textInputTitle="Create Password"
            placeholder="Password"
            ref={passwordRef}
            onChangeText={handleChange("createPassword")}
            onBlur={handleBlur("createPassword")}
            value={values.createPassword}
            error={errors.createPassword}
            touched={touched.createPassword}
            maxLength={MAX_CHAR_LENGTH}
            returnKeyLabel="next"
            returnKeyType="next"
            rightIcon={true}
            textContentType="oneTimeCode"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          {/* <InputFieldInfo
            text={
              "Password must be 1 capital letter, 1 numeric, 1 special character, 1 alphabet and at least 8 characters long."
            }
          /> */}

          <CustomTxtInput
            textInputTitle="Confirm Password"
            placeholder="Confirm password"
            ref={confirmPasswordRef}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            value={values.confirmPassword}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            maxLength={MAX_CHAR_LENGTH}
            returnKeyLabel="done"
            returnKeyType="done"
            textContentType="oneTimeCode"
            rightIcon={true}
          />
          <TermsAndCondition
            checked={checked}
            toggleCheckbox={toggleCheckbox}
            onPressTermsAndCondition={() => {}}
          />
        </View>

        <View style={style.btnCont}>
          <CustomButton
            onPress={() => {
              if (!checked) {
                dispatch(
                  setErrors({
                    message: "Please agree with terms & conditions",
                    status: 0,
                    statusCode: null,
                  })
                );
              } else {
                Keyboard.dismiss();
                handleSubmit();
              }
            }}
            disabled={loading === LoadingState.CREATE}
            loading={loading === LoadingState.CREATE}
            title={"Sign up"}
            buttonWidth="full"
            variant="primary"
            type="solid"
          />
        </View>

        <View style={style.socialLoginCont}>
          {/* <SocialAuthenticationView
            fromLogin={true}
            userRole={userRole}
            fcmToken={fcmToken}
          /> */}
          <View>
            <Text style={style.txtAlreadyHaveAcc}>
              Already have an account?{" "}
              <Text onPress={onPressSignin} style={style.txtSignup}>
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Signup;

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
    alignSelf: "center",
    marginTop: 10,
  },
  title1: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    alignSelf: "center",
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
    color: theme.colors?.textPrimary,
    alignSelf: "flex-end",
    marginRight: 20,
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
    paddingBottom:
      Platform.OS === "ios"
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
  },
  txtSignup: {
    color: theme.colors?.primary,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
  },
  txtInStyle: {
    flex: 1,
    height: Scale(50),
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs16,
    marginLeft: 5,
  },
  txtTC: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: "#777986",
  },
  txtTC1: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: "#212121",
  },
  tcContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  socialLoginCont: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
}));
