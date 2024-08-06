import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
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
import { SetupProfile4FormProps } from "../../../types/setupProfile.types";
import { SetupProfile4ScreenSchema } from "../../../constant/formValidations";
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
import Scale from "../../../utils/Scale";
import { UserRoleType } from "../../../types/user.types";

const SetupProfile4: React.FC<AuthNavigationProps<Route.navSetupProfile4>> = ({
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

  const [selectedImageForDelete, setSelectedImageForDelete] =
    useState<string>("");

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        if (currentUser?.data?.user) {
          currentUser?.data?.user?.insurance_copies.length > 0 &&
            setSelectedImage(currentUser?.data?.user?.insurance_copies as any);
          let arr: any = [];
          if (currentUser?.data?.user?.insurance_copies.length > 0) {
            currentUser?.data?.user?.insurance_copies.map((ele: string) => {
              arr.push({
                name: `IMG-${new Date()}.${getUrlExtension(ele)}`,
                type: `image/${getUrlExtension(ele)}`,
                uri: Platform.OS === "ios" ? ele?.replace("file://", "") : ele,
              });
            });
            setImage(arr);
          }

          setFieldValue("insurance", currentUser?.data?.user?.insurance_number);
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
  } = useFormik<SetupProfile4FormProps>({
    validationSchema: SetupProfile4ScreenSchema,
    initialValues: { insurance: "" },
    onSubmit: async ({ insurance }) => {
      if (image.length > 0) {
        const formData = new FormData();

        Object.entries(image).forEach(([_key, val]) => {
          formData.append(`insurance_copies[${_key}]`, {
            name: val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
            type: val.type,
            uri:
              Platform.OS === "ios" ? val.uri.replace("file://", "") : val.uri,
          });
        });
        formData.append("insurance_number", insurance);
        formData.append("step", 4);
        formData.append("type", UserRoleType.MOVER);

        const result = await dispatch(
          userSetupProfile({
            formData: formData,
          })
        );
        if (userSetupProfile.fulfilled.match(result)) {
          if (result.payload?.data) {
            if (result.payload?.data?.mover_setup_step == 4) {
              navigation.navigate(Route.navSetupProfile5);
            }
          }
        } else {
          console.log("errror userSetupProfile --->", result.payload);
        }
      } else {
        dispatch(
          setErrors({
            message: "Please attach insurance copies",
            status: 0,
            statusCode: null,
          })
        );
      }
    },
  });

  const onPressCloseIcon = (item: imagePickerProps) => {
    setSelectedImageForDelete(item.name);
  };

  const onPressSkip = () => {
    navigation.navigate(Route.navSetupProfile5);
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <SetupProfileHeader title={"Insurance Details"} percent={6} />
      <KeyboardAvoidingView behavior="padding" style={style.innerCont}>
        <CustomTxtInput
          textInputTitle="Insurance Number"
          placeholder="Enter your insurance number"
          keyboardType={"default"}
          onChangeText={handleChange("insurance")}
          onBlur={handleBlur("insurance")}
          value={values.insurance}
          error={errors.insurance}
          touched={touched.insurance}
          returnKeyType="next"
          returnKeyLabel="next"
        />

        <View style={style.uploadPhotoCont}>
          <UploadProofPhotos
            title="Attach copies of your insurance"
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
      <PrevNextCont
        onPressNext={handleSubmit}
        onPressSkip={onPressSkip}
        onPressPrev={onPressPrev}
        isSkipEnabled={true}
      />
      <ImagePickerPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressFromCamera={onPressFromCamera}
        onPressFromGallary={onPressFromGallary}
      />
    </KeyboardAwareScrollView>
  );
};

export default SetupProfile4;

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
}));
