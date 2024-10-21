import { CommonActions } from "@react-navigation/native";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { setAdjustPan, setAdjustResize } from "rn-android-keyboard-adjust";
import { AppImage } from "../../components/AppImage/AppImage";
import CustomButton from "../../components/ui/CustomButton";
import { CustomTxtInput } from "../../components/ui/CustomTextInput";
import Loading from "../../components/ui/Loading";
import PasswordChangePopup from "../../components/ui/popups/PasswordChangePopup";
import LeftIcon from "../../components/ui/svg/LeftIcon";
import { HAS_NOTCH, HIT_SLOP, USER_ROLE } from "../../constant";
import { ResetPasswordScreenSchema } from "../../constant/formValidations";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectAuthenticationLoading } from "../../store/authentication/authentication.selectors";
import { userResetPassword } from "../../store/authentication/authentication.thunks";
import { ResetPasswordFormProps } from "../../types/authentication.types";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { MainNavigationProps } from "../../types/navigation";
import Scale from "../../utils/Scale";
import { getData } from "../../utils/asyncStorage";
import { Images } from "../../assets/images";

const ResetPassword: React.FC<MainNavigationProps<Route.navResetPassword>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const phone = route?.params?.phone || "";
  const dispatch = useAppDispatch();
  const loading = useSelector(selectAuthenticationLoading);

  const confirmPasswordRef = React.useRef<TextInput>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setAdjustResize();
    return () => {
      setAdjustPan();
    };
  }, []);

  const onPressBack = () => {
    navigation.goBack();
  };
  const togglePopup = () => {
    setVisible(!visible);
  };
  const onPressBackToLogin = () => {
    togglePopup();
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Route.navAuthentication }],
        })
      );
    }, 200);
  };

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
  } = useFormik<ResetPasswordFormProps>({
    validationSchema: ResetPasswordScreenSchema,
    initialValues: { password: "", confirmPassword: "" },
    onSubmit: async ({ password, confirmPassword }) => {
      const u_role = await getData(USER_ROLE);
      const result = await dispatch(
        userResetPassword({ phone_number: phone, password })
      );
      if (userResetPassword.fulfilled.match(result)) {
        if (result.payload.status === 1) {
          setVisible(true);
          // navigation.navigate(Route.navResetPassword, { email: mail });
        }
      } else {
        console.log("errror userResetPassword --->", result.payload);
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
          source={Images.ROUND_LOGO_APP}
          resizeMode="contain"
          style={style.appIcon}
        />
      </View>
      <Text style={style.txtVerificationCode}>Reset Password</Text>
      <Text style={style.txtVerificationSentCode}>
        Your new password must be unique.
      </Text>

      <View style={style.otpInputCont}>
        <CustomTxtInput
          textInputTitle="New Password"
          placeholder="New password"
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          value={values.password}
          error={errors.password}
          touched={touched.password}
          returnKeyLabel="next"
          returnKeyType="next"
          rightIcon={true}
          textContentType="oneTimeCode"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        <CustomTxtInput
          textInputTitle="Confirm New Password"
          placeholder="Confirm New Password"
          ref={confirmPasswordRef}
          onChangeText={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          returnKeyLabel="done"
          returnKeyType="done"
          textContentType="oneTimeCode"
          rightIcon={true}
        />
      </View>
      <View style={style.bottomCont}>
        <CustomButton
          disabled={!isValid}
          onPress={() => {
            Keyboard.dismiss();
            handleSubmit();
          }}
          title={"Continue"}
          buttonWidth="full"
          variant="primary"
          type="solid"
        />
      </View>
      <PasswordChangePopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressBackToLogin={onPressBackToLogin}
      />
    </KeyboardAwareScrollView>
  );
};

export default ResetPassword;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
    paddingHorizontal: 20,
  },
  txtVerificationCode: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
    textAlign: "center",
  },
  backBtnCont: {
    marginVertical: 10,
  },
  txtVerificationSentCode: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginTop: 10,
    textAlign: "center",
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
  iconCont: { alignSelf: "center", marginBottom: 20 },
  appIcon: {
    height: Scale(96),
    width: Scale(96),
  },
}));
