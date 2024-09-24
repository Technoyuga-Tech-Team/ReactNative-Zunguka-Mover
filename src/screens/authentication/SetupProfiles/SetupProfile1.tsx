import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { AuthNavigationProps } from "../../../types/navigation";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useMeQuery } from "../../../hooks/useMeQuery";
import { selectUserProfileLoading } from "../../../store/userprofile/userprofile.selectors";
import { BASE_PORT, SCREEN_WIDTH } from "../../../constant";
import { getUrlExtension } from "../../../utils";
import { userSetupProfile } from "../../../store/userprofile/userprofile.thunk";
import { setErrors } from "../../../store/global/global.slice";
import {
  getImageFromCamera,
  getImageFromGallary,
  requestCameraPermission,
} from "../../../utils/ImagePickerCameraGallary";
import { AppImage } from "../../../components/AppImage/AppImage";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import Loading from "../../../components/ui/Loading";
import SetupProfileHeader from "../../../components/SetupProfileHeader";
import CustomButton from "../../../components/ui/CustomButton";
import UploadIcon from "../../../components/ui/svg/UploadIcon";
import PrevNextCont from "../../../components/PrevNextCont";
import ImagePickerPopup from "../../../components/ui/ImagePickerPopup";
import Scale from "../../../utils/Scale";
import { UserRoleType } from "../../../types/user.types";
import { CommonActions } from "@react-navigation/native";

const Profiles = [
  { image: `http://${BASE_PORT}/avtars/1.png` },
  { image: `http://${BASE_PORT}/avtars/2.png` },
  { image: `http://${BASE_PORT}/avtars/3.png` },
  { image: `http://${BASE_PORT}/avtars/4.png` },
  { image: `http://${BASE_PORT}/avtars/5.png` },
  { image: `http://${BASE_PORT}/avtars/6.png` },
  { image: `http://${BASE_PORT}/avtars/7.png` },
];

const SetupProfile1: React.FC<AuthNavigationProps<Route.navSetupProfile1>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { refetch } = useMeQuery({ enabled: false });

  const loading = useSelector(selectUserProfileLoading);

  const [selectedImage, setSelectedImage] = useState<
    ImageSourcePropType | string
  >();
  const [image, setImage] = useState<object>({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        console.log("currentUser", currentUser);
        if (currentUser?.data?.user) {
          currentUser?.data?.user?.profile_image &&
            setSelectedImage(currentUser?.data?.user?.profile_image);
          const img = currentUser?.data?.user?.profile_image;
          let obj = {
            name: `${new Date().getTime()}.${getUrlExtension(img)}`,
            type: `image/${getUrlExtension(img)}`,
            uri: Platform.OS === "ios" ? img.replace("file://", "") : img,
          };
          currentUser?.data?.user?.profile_image && setImage(obj);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onPressPrev = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Route.navAuthentication }],
      })
    );
  };
  const onPressNext = async () => {
    if (selectedImage) {
      const formData = new FormData();

      formData.append("profile_image", image);
      formData.append("step", 1);
      formData.append("type", UserRoleType.MOVER);

      const result = await dispatch(
        userSetupProfile({
          formData: formData,
        })
      );
      if (userSetupProfile.fulfilled.match(result)) {
        console.log("result.payload", result.payload);
        if (result.payload?.data) {
          if (result.payload?.data?.mover_setup_step == 1) {
            navigation.navigate(Route.navSetupProfile2);
          }
        }
      } else {
        console.log("errror userSetupProfile --->", result.payload);
      }
    } else {
      dispatch(
        setErrors({
          message: "Please upload or select the profile",
          status: 0,
          statusCode: null,
        })
      );
    }
  };
  const onPressUploadPhotos = () => {
    setVisible(true);
  };

  const profile = selectedImage
    ? typeof selectedImage === "number"
      ? selectedImage
      : { uri: selectedImage }
    : require("../../../assets/images/user-circle.png");

  const onPressImage = (img: string) => {
    setSelectedImage(img);
    let obj = {
      name: `${new Date().getTime()}.${getUrlExtension(img)}`,
      type: `image/${getUrlExtension(img)}`,
      uri: Platform.OS === "ios" ? img.replace("file://", "") : img,
    };
    setImage(obj);
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
      setSelectedImage(imageObject.uri); // Update selected image state (if applicable)
      setImage(imageObject); // Update image state (if applicable)
    } catch (error) {
      // Handle errors here if needed (e.g., display a user-friendly message)
      console.error("Error using getImageFromCamera:", error);
    }
  };

  const onPressFromGallary = async () => {
    togglePopup();
    setTimeout(async () => {
      try {
        const imageObject = await getImageFromGallary({ multiple: false });
        setSelectedImage(imageObject.uri); // Update selected image state (if applicable)
        setImage(imageObject); // Update image state (if applicable)
      } catch (error) {
        // Handle errors here if needed (e.g., display a user-friendly message)
        console.error("Error using getImageFromGallary:", error);
      }
    }, 100);
  };

  const togglePopup = () => {
    setVisible(!visible);
  };

  const renderItem = ({ item }: { item: { image: string } }) => {
    const isSelected = selectedImage == item.image;

    return (
      <TouchableOpacity onPress={() => onPressImage(item.image)}>
        <AppImage
          source={item.image}
          // @ts-ignore
          style={[
            style.profile1,
            {
              borderWidth: isSelected ? 2.5 : 0,
              borderColor: theme.colors?.primary,
            },
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <SetupProfileHeader title={"Upload Image"} percent={1} />
      <View style={style.innerCont}>
        <AppImage source={profile} style={style.profile} resizeMode="cover" />
        <View style={style.btnCont}>
          <CustomButton
            onPress={onPressUploadPhotos}
            title={`Upload Image`}
            buttonWidth="half"
            width={SCREEN_WIDTH - 100}
            type="clear"
            icon={
              <UploadIcon
                color={theme.colors?.primary}
                style={{ marginRight: 5 }}
              />
            }
            containerStyle={style.btnMessage}
            titleStyle={style.txtTitleStyle}
          />
        </View>
        {/* <View style={style.imagePickerCont}>
          <Text style={style.txtChoose}>or choose one:</Text>
          <FlatList
            data={Profiles}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View> */}
      </View>
      <PrevNextCont
        onPressNext={onPressNext}
        onPressPrev={onPressPrev}
        isDisable={false}
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

export default SetupProfile1;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
  innerCont: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  profile: {
    height: Scale(90),
    width: Scale(90),
    borderRadius: Scale(90 / 2),
  },
  profile1: {
    height: Scale(40),
    width: Scale(40),
    borderRadius: Scale(40 / 2),
    marginHorizontal: 5,
  },
  btnMessage: {
    backgroundColor: theme.colors?.white,
    width: "100%",
    height: Scale(50),
    borderRadius: 5,
    borderColor: theme.colors?.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txtTitleStyle: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
  },
  btnCont: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  txtChoose: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  imagePickerCont: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },
}));
