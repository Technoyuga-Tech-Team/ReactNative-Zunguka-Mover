import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
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
import BorderedItem from "../../components/ui/BorderedItem";
import CountryPickerModal from "../../components/ui/CountryPickerModal";
import CustomButton from "../../components/ui/CustomButton";
import { CustomTxtInput } from "../../components/ui/CustomTextInput";
import ImagePickerPopup from "../../components/ui/ImagePickerPopup";
import Loading from "../../components/ui/Loading";
import { PhoneNumberInput } from "../../components/ui/PhoneNumberInput";
import ProfileImage from "../../components/ui/Profile/ProfileImage";
import BackIcon from "../../components/ui/svg/BackIcon";
import { HAS_NOTCH, MAX_CHAR_LENGTH, USER_DATA } from "../../constant";
import { EditProfileScreenSchema } from "../../constant/formValidations";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSuccess } from "../../store/global/global.slice";
import { selectUserData } from "../../store/settings/settings.selectors";
import { setUserData } from "../../store/settings/settings.slice";
import { selectUserProfileLoading } from "../../store/userprofile/userprofile.selectors";
import {
  userUpdateProfile,
  userUpdateProfilePicture,
} from "../../store/userprofile/userprofile.thunk";
import { EditProfileFormProps } from "../../types/authentication.types";
import { imagePickerProps } from "../../types/common.types";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { MainNavigationProps } from "../../types/navigation";
import { getUrlExtension, keepSingleSpace } from "../../utils";
import {
  getImageFromCamera,
  getImageFromGallary,
  requestCameraPermission,
} from "../../utils/ImagePickerCameraGallary";
import Scale from "../../utils/Scale";
import { setData } from "../../utils/asyncStorage";
import InputFieldInfo from "../../components/ui/InputFieldInfo";

const EditProfile: React.FC<MainNavigationProps<Route.navEditProfile>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const userData = useSelector(selectUserData);
  const userLoading = useSelector(selectUserProfileLoading);

  const dispatch = useAppDispatch();

  const lastnameRef = React.useRef<TextInput>(null);
  const usernameRef = React.useRef<TextInput>(null);
  const emaiRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<ReactNativePhoneInput>(null);

  const [visible, setVisible] = useState(false);

  const [tamp_phone, setTamp_phone] = useState<string>(userData?.phone_number);
  const [profilePicture, setProfilePicture] = useState<string>(
    userData?.profile_image
  );

  const [profileImage, setProfileImage] = useState<imagePickerProps>({
    name: "",
    type: "",
    uri: "",
  });
  const [visibleCountryPicker, setVisibleCountryPicker] =
    useState<boolean>(false);
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
      if (userData) {
        userData?.first_name &&
          setFieldValue("firstName", userData?.first_name);
        userData?.last_name && setFieldValue("lastName", userData?.last_name);
        userData?.username && setFieldValue("username", userData?.username);
        userData?.email && setFieldValue("email", userData?.email);
        phoneRef.current?.selectCountry(userData?.iso);
        userData?.phone_number &&
          setFieldValue("phoneNumber", userData?.phone_number);
        setTamp_phone(userData?.phone_number);
        setProfilePicture(userData?.profile_image);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userData]);

  const togglePopup = () => {
    setVisible(!visible);
  };

  const onPressUpdateProfile = () => {};

  const onPressFlag = () => {
    // setFieldValue("phoneNumber", "");
    // setVisibleCountryPicker(true);
  };

  const onPhoneInputChange = (value: string, iso2: string) => {
    setCountryCode(iso2?.toUpperCase() as CountryCode);
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
    navigation.goBack();
  };
  const onPressCamera = () => {
    setVisible(true);
  };
  const onPressChangePassword = () => {
    navigation.navigate(Route.navChangePassword);
  };

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setErrors,
    setFieldValue,
    setValues,
  } = useFormik<EditProfileFormProps>({
    validationSchema: EditProfileScreenSchema(countryCode),
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
    },
    validateOnBlur: false,
    onSubmit: async ({ firstName, lastName, username, email, phoneNumber }) => {
      const result = await dispatch(
        userUpdateProfile({
          first_name: keepSingleSpace(firstName.trim()),
          last_name: keepSingleSpace(lastName.trim()),
          username: username,
          email,
          phone_number: phoneNumber,
        })
      );
      if (userUpdateProfile.fulfilled.match(result)) {
        if (result.payload.status === 1) {
          setFieldValue("firstName", keepSingleSpace(firstName));
          setFieldValue("lastName", keepSingleSpace(lastName));
          dispatch(setUserData(result?.payload?.data));
          await setData(USER_DATA, result?.payload?.data);
          dispatch(setSuccess(result?.payload?.message));
        }
        if (result.payload) {
        }
      } else {
        console.log("errror userUpdateProfile --->", result.payload);
      }
    },
  });

  const onPressFromCamera = async () => {
    togglePopup();
    setTimeout(async () => {
      if (Platform.OS === "android") {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          openPickerCameraImage();
        }
      } else {
        openPickerCameraImage();
      }
    }, 100);
  };

  const openPickerCameraImage = async () => {
    try {
      const imageObject = await getImageFromCamera({ cropping: true });
      setProfilePicture(imageObject.uri);
      setProfileImage(imageObject);
      uploadProfilePicture(imageObject);
    } catch (error) {
      // Handle errors here if needed (e.g., display a user-friendly message)
      console.error("Error using getImageFromCamera:", error);
    }
  };

  const onPressFromGallary = async () => {
    togglePopup();
    setTimeout(async () => {
      try {
        const imageObject = await getImageFromGallary({ cropping: true });
        setProfilePicture(imageObject.uri);
        setProfileImage(imageObject);
        uploadProfilePicture(imageObject);
      } catch (error) {
        // Handle errors here if needed (e.g., display a user-friendly message)
        console.error("Error using getImageFromGallary:", error);
      }
    }, 100);
  };

  const uploadProfilePicture = async (obj: imagePickerProps) => {
    const formData = new FormData();
    formData.append("profile_image", {
      name: obj.name || `${new Date().getTime()}.${getUrlExtension(obj.uri)}`,
      type: obj.type,
      uri: Platform.OS === "ios" ? obj.uri.replace("file://", "") : obj.uri,
    });

    const result = await dispatch(
      userUpdateProfilePicture({ formData: formData })
    );

    if (userUpdateProfilePicture.fulfilled.match(result)) {
      console.log("userUpdateProfilePicture  - - - ", result.payload);
      if (result?.payload?.status === 1) {
        dispatch(setUserData(result?.payload?.data));
        await setData(USER_DATA, result?.payload?.data);
      }
    } else {
      console.log("userUpdateProfilePicture error - - - ", result.payload);
    }
  };

  let phone_initial =
    tamp_phone === "" ? values.phoneNumber : userData?.phone_number;

  return (
    <View style={style.container}>
      {userLoading === LoadingState.CREATE && <Loading />}
      <TouchableOpacity
        onPress={onPressBack}
        activeOpacity={0.8}
        style={style.backCont}
      >
        <BackIcon color={theme.colors?.black} />
      </TouchableOpacity>
      <View style={style.innerCont}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={style.scrollCont}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={style.profileCont}>
            <ProfileImage
              profileImage={profilePicture}
              onPressCamera={onPressCamera}
            />
          </View>

          <View style={style.txtInCont}>
            <CustomTxtInput
              textInputTitle="First Name"
              placeholder="Enter your first name"
              returnKeyType="next"
              returnKeyLabel="next"
              keyboardType={"default"}
              maxLength={MAX_CHAR_LENGTH}
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
              editable={userData?.acc_verified ? false : true}
              error={errors.firstName}
              touched={touched.firstName}
              onSubmitEditing={() => lastnameRef.current?.focus()}
            />
            <CustomTxtInput
              textInputTitle="Last Name"
              ref={lastnameRef}
              placeholder="Enter your last name"
              returnKeyType="next"
              returnKeyLabel="next"
              keyboardType={"default"}
              maxLength={MAX_CHAR_LENGTH}
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              value={values.lastName}
              error={errors.lastName}
              editable={userData?.acc_verified ? false : true}
              touched={touched.lastName}
              onSubmitEditing={() => usernameRef.current?.focus()}
            />
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
              editable={false}
              value={values.username}
              error={errors.username}
              touched={touched.username}
              onSubmitEditing={() => emaiRef.current?.focus()}
            />
            <CustomTxtInput
              textInputTitle="Email Address"
              ref={emaiRef}
              placeholder="Enter email"
              returnKeyType="next"
              returnKeyLabel="next"
              keyboardType={"email-address"}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              editable={false}
              value={values.email}
              error={errors.email}
              touched={touched.email}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            <TouchableOpacity
              onPress={() => {
                setTamp_phone("");
              }}
              activeOpacity={1}
            >
              <PhoneNumberInput
                ref={phoneRef}
                textInputTitle="Phone Number"
                onPressFlag={onPressFlag}
                onChangePhoneNumber={(value, iso2) =>
                  onPhoneInputChange(value, iso2)
                }
                initialValue={phone_initial}
                textProps={{
                  placeholder: "Enter your phone number",
                  placeholderTextColor: theme.colors?.iconColor,
                  style: style.txtInStyle,
                  editable: false,
                  returnKeyLabel: "done",
                  returnKeyType: "done",
                  onPressIn: () => {
                    setTamp_phone("");
                  },
                }}
                error={errors.phoneNumber}
              />
            </TouchableOpacity>

            <CountryPickerModal
              country={country}
              countryCode={countryCode}
              visible={visibleCountryPicker}
              onPressCountryPicker={onPressCountryPicker}
              onClosePickerModal={onClosePickerModal}
              onSelect={(country, cca2) => onSelect(country, cca2)}
            />
          </View>
          {userData?.is_social === 0 && (
            <BorderedItem
              title="Change Password"
              onPressItem={onPressChangePassword}
            />
          )}
        </KeyboardAwareScrollView>
        <View style={style.btnCont}>
          <CustomButton
            onPress={() => {
              Keyboard.dismiss();
              handleSubmit();
            }}
            title={"Update Profile"}
            buttonWidth="full"
            variant="primary"
            type="solid"
          />
        </View>
      </View>
      <ImagePickerPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressFromCamera={onPressFromCamera}
        onPressFromGallary={onPressFromGallary}
      />
    </View>
  );
};

export default EditProfile;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
  innerCont: {
    flex: 1,
  },
  btnCont: {
    paddingBottom:
      Platform.OS === "ios"
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
  },
  profileCont: {
    marginVertical: 20,
  },
  txtInCont: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  txtInStyle: {
    flex: 1,
    height: Scale(50),
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs16,
  },
  scrollCont: {
    flexGrow: 1,
    backgroundColor: theme.colors?.background,
    paddingBottom: 10,
  },
  backCont: {
    height: Scale(48),
    width: Scale(48),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
}));
