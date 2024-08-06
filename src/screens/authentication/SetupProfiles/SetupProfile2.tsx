import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { AuthNavigationProps } from "../../../types/navigation";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useMeQuery } from "../../../hooks/useMeQuery";
import { selectUserProfileLoading } from "../../../store/userprofile/userprofile.selectors";
import { getUrlExtension } from "../../../utils";
import {
  getImageFromCamera,
  getImageFromGallary,
  requestCameraPermission,
} from "../../../utils/ImagePickerCameraGallary";
import { SetupProfile2FormProps } from "../../../types/setupProfile.types";
import { SetupProfile2ScreenSchema } from "../../../constant/formValidations";
import { userSetupProfile } from "../../../store/userprofile/userprofile.thunk";
import { setErrors } from "../../../store/global/global.slice";
import { imagePickerProps } from "../../../types/common.types";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import Loading from "../../../components/ui/Loading";
import SetupProfileHeader from "../../../components/SetupProfileHeader";
import { CustomTxtInput } from "../../../components/ui/CustomTextInput";
import UploadProofPhotos from "../../../components/UploadProofPhotos";
import RenderSelectedImage from "../../../components/RenderSelectedImage/RenderSelectedImage";
import PrevNextCont from "../../../components/PrevNextCont";
import ImagePickerPopup from "../../../components/ui/ImagePickerPopup";
import { CURRENT_COUNTRY_CODE } from "../../../constant";
import GooglePlaceAutoCompleteModal from "../../../components/GooglePlaceAutoCompleteModel";
import Scale from "../../../utils/Scale";
import LocationCrossIcon from "../../../components/ui/svg/LocationCrossIcon";
import { UserRoleType } from "../../../types/user.types";
import { setAdjustPan, setAdjustResize } from "rn-android-keyboard-adjust";

const SetupProfile2: React.FC<AuthNavigationProps<Route.navSetupProfile2>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { refetch } = useMeQuery({ enabled: false });

  const loading = useSelector(selectUserProfileLoading);

  const [selectedImage, setSelectedImage] = useState<any[]>([]);
  const [image, setImage] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [visibleAddress, setVisibleAddress] = useState<boolean>(false);
  const [selectedImageForDelete, setSelectedImageForDelete] =
    useState<string>("");

  useEffect(() => {
    setAdjustResize();
    return () => {
      setAdjustPan();
    };
  }, []);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        console.log("currentUser", currentUser?.data?.user?.address_proofs);
        if (currentUser?.data?.user) {
          currentUser?.data?.user?.address_proofs?.length > 0 &&
            setSelectedImage(
              currentUser?.data?.user?.address_proofs as string[]
            );
          let arr: any = [];
          if (currentUser?.data?.user?.address_proofs?.length > 0) {
            currentUser?.data?.user?.address_proofs.map((ele: string) => {
              arr.push({
                name: `IMG-${new Date()}.${getUrlExtension(ele)}`,
                type: `image/${getUrlExtension(ele)}`,
                uri: Platform.OS === "ios" ? ele.replace("file://", "") : ele,
              });
            });
            setImage(arr);
          }
          setFieldValue("address", currentUser?.data?.user?.address);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedImageForDelete !== "") {
      const filterArr = image.filter((ele) => {
        return ele.name !== selectedImageForDelete;
      });
      setImage(filterArr);
      setSelectedImageForDelete("");
    }
  }, [selectedImageForDelete]);

  const onPressPrev = () => {
    navigation.goBack();
  };

  const onPressCurrentLocation = () => {
    setVisibleAddress(true);
  };
  const onPressUploadImages = () => {
    setVisible(true);
  };

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
      const imageObject = await getImageFromCamera();
      setSelectedImage([...selectedImage, imageObject.uri]);
      setImage([...image, imageObject]);
    } catch (error) {
      // Handle errors here if needed (e.g., display a user-friendly message)
      console.error("Error using getImageFromCamera:", error);
    }
  };

  const onPressFromGallary = async () => {
    togglePopup();
    setTimeout(async () => {
      try {
        const imageObject = await getImageFromGallary({ multiple: true });
        setSelectedImage([
          ...selectedImage,
          ...imageObject.map((image: { uri: any }) => image.uri),
        ]);
        setImage([...image, ...imageObject]);
      } catch (error) {
        // Handle errors here if needed (e.g., display a user-friendly message)
        console.error("Error using getImageFromGallary:", error);
      }
    }, 1000);
  };

  const togglePopup = () => {
    setVisible(!visible);
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
  } = useFormik<SetupProfile2FormProps>({
    validationSchema: SetupProfile2ScreenSchema,
    initialValues: { address: "" },
    onSubmit: async ({ address }) => {
      if (image.length > 0) {
        const formData = new FormData();

        Object.entries(image).forEach(([_key, val]) => {
          formData.append(`address_proofs[${_key}]`, {
            name: val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
            type: val.type,
            uri:
              Platform.OS === "ios" ? val.uri.replace("file://", "") : val.uri,
          });
        });

        formData.append("address", address);
        formData.append("step", 2);
        formData.append("type", UserRoleType.MOVER);

        const result = await dispatch(
          userSetupProfile({
            formData: formData,
          })
        );
        if (userSetupProfile.fulfilled.match(result)) {
          if (result.payload?.data) {
            if (result.payload?.data?.mover_setup_step == 2) {
              navigation.navigate(Route.navSetupProfile3);
            }
          }
        } else {
          console.log("errror userSetupProfile --->", result.payload);
        }
      } else {
        dispatch(
          setErrors({
            message: "Please attach address proof",
            status: 0,
            statusCode: null,
          })
        );
      }
    },
  });

  const toggleAddressModal = () => {
    setVisibleAddress(false);
  };

  const onPressGetAddress = (
    data: GooglePlaceData | GooglePlaceDetail,
    details: GooglePlaceDetail
  ) => {
    const location_address =
      // @ts-ignore
      data.description !== undefined
        ? // @ts-ignore
          data.description
        : // @ts-ignore
          data?.formatted_address;
    console.log("location_address", location_address);
    setFieldValue("address", location_address);
    toggleAddressModal();
    Keyboard.dismiss();
  };

  const onPressCloseIcon = (item: imagePickerProps) => {
    setSelectedImageForDelete(item.name);
  };

  console.log("image", image);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <SetupProfileHeader
        title={"Add Address and Attach Document"}
        percent={2}
      />
      <KeyboardAvoidingView behavior="padding" style={style.innerCont}>
        <CustomTxtInput
          textInputTitle="Address"
          placeholder="Enter your Address"
          keyboardType={"default"}
          onChangeText={handleChange("address")}
          onBlur={handleBlur("address")}
          value={values.address}
          error={errors.address}
          touched={touched.address}
          returnKeyType="done"
          returnKeyLabel="done"
        />
        <TouchableOpacity
          style={style.locationCont}
          activeOpacity={0.8}
          onPress={onPressCurrentLocation}
        >
          <LocationCrossIcon color={theme?.colors?.primary} />
          <Text style={style.txtChooseLocation}>Choose current location</Text>
        </TouchableOpacity>
        <View style={style.uploadPhotoCont}>
          <UploadProofPhotos
            title="Attach Address Proof"
            onPressUploadImages={onPressUploadImages}
          />
        </View>
        {image && image.length > 0 && (
          <RenderSelectedImage
            data={image}
            onPressCloseIcon={onPressCloseIcon}
          />
        )}
      </KeyboardAvoidingView>
      <PrevNextCont onPressNext={handleSubmit} onPressPrev={onPressPrev} />

      <ImagePickerPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressFromCamera={onPressFromCamera}
        onPressFromGallary={onPressFromGallary}
      />
      {visibleAddress && (
        <GooglePlaceAutoCompleteModal
          countryCode={CURRENT_COUNTRY_CODE}
          onPressAddress={(
            data: GooglePlaceData,
            details: GooglePlaceDetail
          ) => {
            console.log("data, details", data, details);
            onPressGetAddress(data, details);
          }}
          visiblePopup={visibleAddress}
          togglePopup={toggleAddressModal}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default SetupProfile2;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
  innerCont: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  txtCurrentLocation: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
    marginLeft: 10,
  },
  locationCont: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  uploadPhotoCont: {
    marginTop: 20,
  },
  closeCont: {
    height: Scale(20),
    width: Scale(20),
    borderRadius: Scale(10),
    backgroundColor: theme.colors?.white,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 8,
    right: 17,
  },
  txtChooseLocation: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.primary,
    marginLeft: 10,
  },
}));
