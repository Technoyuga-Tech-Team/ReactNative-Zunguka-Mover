import { View, Text, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { AuthNavigationProps } from "../../../types/navigation";
import { Route } from "../../../constant/navigationConstants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles, useTheme } from "react-native-elements";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import CustomHeader from "../../../components/ui/CustomHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomButton from "../../../components/ui/CustomButton";
import KycIcon from "../../../components/ui/svg/KycIcon";
import CustomDropdown from "../../../components/Dropdown/CustomDropdown";
import { COUNTRIES, ID_TYPES } from "../../../constant";
import RenderSelectedImage from "../../../components/RenderSelectedImage/RenderSelectedImage";
import { imagePickerProps } from "../../../types/common.types";
import UploadProofPhotos from "../../../components/UploadProofPhotos";
import ImagePickerPopup from "../../../components/ui/ImagePickerPopup";
import {
  getImageFromCamera,
  getImageFromGallary,
  requestCameraPermission,
} from "../../../utils/ImagePickerCameraGallary";
import { getUrlExtension } from "../../../utils";
import { userVerifyId } from "../../../store/authentication/authentication.thunks";
import { setErrors, setSuccess } from "../../../store/global/global.slice";
import { selectAuthenticationLoading } from "../../../store/authentication/authentication.selectors";
import { useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";

const AddKyc: React.FC<AuthNavigationProps<Route.navAddKyc>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectAuthenticationLoading);

  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");

  const [IdType, setIdType] = useState("");
  const [IdTypeError, setIdTypeError] = useState("");

  const [selectedImage, setSelectedImage] = useState<any[]>([]);
  const [image, setImage] = useState<any[]>([]);
  const [selectedImageForDelete, setSelectedImageForDelete] =
    useState<string>("");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (selectedImageForDelete !== "") {
      const filterArr = image.filter((ele) => {
        return ele.name !== selectedImageForDelete;
      });
      setImage(filterArr);
      setSelectedImageForDelete("");
    }
  }, [selectedImageForDelete]);

  const onPressCloseIcon = (item: imagePickerProps) => {
    setSelectedImageForDelete(item.name);
  };

  const onPressUploadImages = () => {
    setVisible(true);
  };

  const togglePopup = () => {
    setVisible(!visible);
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

  const isValid = () => {
    if (country == "" && IdType == "") {
      setCountryError("Please select the country");
      setIdTypeError("Please select your ID type");
      return false;
    } else if (country == "") {
      setCountryError("Please select the country");
      return false;
    } else if (IdType == "") {
      setIdTypeError("Please select your ID type");
      return false;
    } else if (image.length == 0) {
      dispatch(
        setErrors({
          message: "Please add documents for kyc",
          status: 0,
          statusCode: null,
        })
      );
      return false;
    }
    return true;
  };

  const onPressContinue = async () => {
    if (isValid()) {
      try {
        const formData = new FormData();
        formData.append("country", `${country}`);
        formData.append("id_type", `${IdType}`);
        Object.entries(image).forEach(([_key, val]) => {
          formData.append(`kyc_documents[${_key}]`, {
            name:
              val.name ||
              `${new Date().getMilliseconds()}.${getUrlExtension(val.uri)}`,
            type: `image/${getUrlExtension(val.uri)}`,
            uri:
              Platform.OS === "ios" ? val.uri.replace("file://", "") : val.uri,
          });
        });
        const result = await dispatch(userVerifyId({ formData: formData }));
        if (userVerifyId.fulfilled.match(result)) {
          if (result.payload.status === 1) {
            console.log("userAddress result - - - ", result.payload);
            dispatch(setSuccess(result.payload.message));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navDashboard }],
              })
            );
          }
        } else {
          console.log("userAddress error - - - ", result.payload);
        }
      } catch (error) {
        console.log("catch error - - - ", error);
      }
    }
  };

  const onPressBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Route.navAuthentication }],
        })
      );
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader
        title="Verify your ID(KYC)"
        isOutsideBack={true}
        onPressBackBtn={onPressBack}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={style.scrollCont}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        <Text style={style.txtTitle}>
          kindly verify your account for security purposes
        </Text>
        <View
          style={{
            paddingVertical: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KycIcon />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <CustomDropdown
            dropDownData={COUNTRIES}
            placeHolder={"Country"}
            value={country}
            topMargin={20}
            onSelect={(val) => {
              console.log("val", val);
              setCountryError("");
              setCountry(val.key);
            }}
            error={countryError}
          />
          <CustomDropdown
            dropDownData={ID_TYPES}
            placeHolder={"ID Type"}
            value={IdType}
            topMargin={20}
            onSelect={(val) => {
              console.log("val", val);
              setIdTypeError("");
              setIdType(val.key);
            }}
            error={IdTypeError}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: image && image.length > 0 ? "flex-start" : "center",
            paddingHorizontal: 20,
          }}
        >
          {image && image.length > 0 ? (
            <RenderSelectedImage
              data={image}
              onPressCloseIcon={onPressCloseIcon}
            />
          ) : (
            <UploadProofPhotos
              title="Upload document"
              onPressUploadImages={onPressUploadImages}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <CustomButton
        onPress={() => onPressContinue()}
        title={"Continue"}
        buttonWidth="full"
        variant="primary"
        type="solid"
        disabled={loading === LoadingState.CREATE}
        loading={loading === LoadingState.CREATE}
      />
      <ImagePickerPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressFromCamera={onPressFromCamera}
        onPressFromGallary={onPressFromGallary}
      />
    </View>
  );
};

export default AddKyc;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme?.colors?.background,
    paddingTop: props.insets.top,
    paddingBottom: props.insets.bottom + 10,
  },
  scrollCont: {
    flexGrow: 1,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
  },
}));
