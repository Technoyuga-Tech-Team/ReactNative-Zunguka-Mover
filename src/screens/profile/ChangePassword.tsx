import {useFormik} from 'formik';
import React, {useEffect} from 'react';
import {Keyboard, Platform, TextInput, View} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {setAdjustPan, setAdjustResize} from 'rn-android-keyboard-adjust';
import {AuthNavigationProps} from '../../types/navigation';
import {Route} from '../../constant/navigationConstants';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {selectUserData} from '../../store/settings/settings.selectors';
import {selectAuthenticationLoading} from '../../store/authentication/authentication.selectors';
import {ChangePasswordFormProps} from '../../types/authentication.types';
import {ChangePasswordScreenSchema} from '../../constant/formValidations';
import {userChangePassword} from '../../store/authentication/authentication.thunks';
import {setSuccess} from '../../store/global/global.slice';
import {LoadingState, ThemeProps} from '../../types/global.types';
import Loading from '../../components/ui/Loading';
import CustomHeader from '../../components/ui/CustomHeader';
import {CustomTxtInput} from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import {HAS_NOTCH} from '../../constant';

const ChangePassword: React.FC<
  AuthNavigationProps<Route.navChangePassword>
> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  const passwordRef = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);

  const dispatch = useAppDispatch();

  const userData = useSelector(selectUserData);
  const loading = useSelector(selectAuthenticationLoading);

  useEffect(() => {
    setAdjustResize();
    return () => {
      setAdjustPan();
    };
  }, []);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setErrors,
    setFieldError,
  } = useFormik<ChangePasswordFormProps>({
    validationSchema: ChangePasswordScreenSchema,
    initialValues: {currentPassword: '', password: '', confirmPassword: ''},
    onSubmit: async ({currentPassword, password, confirmPassword}) => {
      const result = await dispatch(
        userChangePassword({
          old_password: currentPassword,
          password,
        }),
      );
      if (userChangePassword.fulfilled.match(result)) {
        if (result.payload.status === 1) {
          dispatch(setSuccess(result.payload.message));
          navigation.goBack();
        }
      } else {
        console.log('errror userChangePassword --->', result.payload);
        setFieldError('currentPassword', result.payload?.message);
      }
    },
  });

  return (
    <KeyboardAwareScrollView
      bounces={false}
      keyboardShouldPersistTaps={'handled'}
      contentContainerStyle={style.container}>
      {loading === LoadingState.CREATE && <Loading />}

      <CustomHeader title="Change Password" />

      <View style={style.otpInputCont}>
        <CustomTxtInput
          textInputTitle="Current Password"
          placeholder="Enter current password"
          onChangeText={handleChange('currentPassword')}
          onBlur={handleBlur('currentPassword')}
          value={values.currentPassword}
          error={errors.currentPassword}
          touched={touched.currentPassword}
          returnKeyLabel="next"
          returnKeyType="next"
          rightIcon={true}
          textContentType="oneTimeCode"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <CustomTxtInput
          textInputTitle="Create Password"
          placeholder="Enter password"
          ref={passwordRef}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
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
          textInputTitle="Confirm Password"
          placeholder="Enter confirm password"
          ref={confirmPasswordRef}
          onChangeText={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
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
          title={'Change Password'}
          buttonWidth="full"
          variant="primary"
          type="solid"
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ChangePassword;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
    paddingHorizontal: 20,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.regular,
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
      Platform.OS === 'ios'
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
  },
  txtDidntReceiveCode: {
    color: theme.colors?.secondaryText,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    alignSelf: 'center',
    marginBottom: 20,
  },
  txtResendCode: {
    color: theme.colors?.black,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    textDecorationLine: 'underline',
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
  },
  iconCont: {alignSelf: 'center', marginVertical: 30},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
