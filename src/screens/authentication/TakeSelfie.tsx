import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { RNCamera } from "react-native-camera";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { AppImage } from "../../components/AppImage/AppImage";
import CustomButton from "../../components/ui/CustomButton";
import CustomHeader from "../../components/ui/CustomHeader";
import ProfileImage from "../../components/ui/Profile/ProfileImage";
import {
  HIT_SLOP2,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  USER_DATA,
} from "../../constant";
import { API } from "../../constant/apiEndpoints";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { userSelfieVerification } from "../../store/authentication/authentication.thunks";
import { fetch } from "../../store/fetch";
import { setErrors, setSuccess } from "../../store/global/global.slice";
import { selectUserData } from "../../store/settings/settings.selectors";
import { setUserData } from "../../store/settings/settings.slice";
import { imagePickerProps } from "../../types/common.types";
import { ThemeProps } from "../../types/global.types";
import { AuthNavigationProps } from "../../types/navigation";
import { getUserData } from "../../types/user.types";
import { getRandomFileName, getUrlExtension } from "../../utils";
import { setData } from "../../utils/asyncStorage";
import { notifyMessage } from "../../utils/notifyMessage";
import Scale from "../../utils/Scale";
import { setNavigation } from "../../utils/setNavigation";

const TakeSelfie: React.FC<AuthNavigationProps<Route.navTakeSelfie>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const navigationRoute = useNavigation();

  const dispatch = useAppDispatch();

  const userData = useSelector(selectUserData);

  const cameraRef = useRef<RNCamera>(null);
  const [capturing, setCapturing] = useState(false);
  const [newUploaded, setNewUploaded] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profileImage, setProfileImage] = useState<imagePickerProps>({
    name: "",
    type: "",
    uri: "",
  });

  useEffect(() => {
    const init = async () => {
      await RNBootSplash.hide();
    };
    init();
  }, []);

  useEffect(() => {
    if (userData) {
      setProfilePicture(userData?.selfie_image);
    }
  }, [userData]);

  const takePictureAsync = async () => {
    if (cameraRef.current && !capturing) {
      setCapturing(true);
      const options = { quality: 0.8 };
      const data = await cameraRef.current.takePictureAsync(options);
      if (data) {
        console.log("data", data);
        setProfilePicture(data.uri);

        const imageObject = {
          name: `${getRandomFileName()}.${getUrlExtension(data.uri)}`,
          type: "image/jpg",
          uri: data.uri,
        };
        setNewUploaded(true);
        setProfileImage(imageObject);
        notifyMessage("Captured!");
        setShowCamera(false);
      }
      setCapturing(false);
      // handle photo data
    }
  };

  const onPressCamera = () => {
    setShowCamera(true);
  };

  const onPressContinue = async () => {
    try {
      const formData = new FormData();

      formData.append("selfie_image", {
        name:
          profileImage.name ||
          `${new Date().getMilliseconds()}.${getUrlExtension(
            profileImage.uri
          )}`,
        type: `image/${getUrlExtension(profileImage.uri)}`,
        uri:
          Platform.OS === "ios"
            ? profileImage.uri.replace("file://", "")
            : profileImage.uri,
      });

      const result = await dispatch(
        userSelfieVerification({ formData: formData })
      );
      if (userSelfieVerification.fulfilled.match(result)) {
        if (result.payload.status === 1) {
          console.log("userSelfieVerification result - - - ", result.payload);
          dispatch(setSuccess(result.payload.message));
          setNewUploaded(false);
          if (result.payload.data?.is_kyc_verified_by_admin == 1) {
            setNavigation(result.payload?.data, navigationRoute);
          } else {
            if (result.payload.data?.is_kyc_verified_by_admin == 0) {
              dispatch(
                setErrors({
                  message: "Wait for the verify by Admin",
                  status: 0,
                  statusCode: null,
                })
              );
            } else {
              dispatch(
                setErrors({
                  message: "Your Profile is rejected by the Admin.",
                  status: 0,
                  statusCode: null,
                })
              );
            }
          }
        }
      } else {
        console.log("userSelfieVerification error - - - ", result.payload);
      }
    } catch (error) {
      console.log("catch error - - - ", error);
    }
  };

  console.log("profilePicture", profilePicture);

  return (
    <View style={style.container}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <CustomHeader title="Selfie Verification" />
      {showCamera ? (
        <View style={style.cameraCont}>
          <RNCamera
            ref={cameraRef}
            style={style.camera}
            type={RNCamera.Constants.Type.front}
          />
          <ImageBackground
            style={{
              height: SCREEN_HEIGHT,
              width: SCREEN_WIDTH,
              position: "absolute",
              // bottom: 0,
            }}
            source={Images.SELFIE_BG_IMAGE}
          />

          <View style={style.buttonContainer}>
            <Text style={style.txtFace}>Keep your face within the oval</Text>
            <TouchableOpacity
              hitSlop={HIT_SLOP2}
              onPress={takePictureAsync}
              disabled={capturing}
              activeOpacity={0.8}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppImage
                source={Images.CAPTURE_BTN_IMAGE}
                style={style.btnCapture}
              />
              {capturing && (
                <ActivityIndicator
                  color={theme?.colors?.black}
                  style={{ position: "absolute", alignSelf: "center" }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, paddingBottom: insets.bottom + 10 }}>
          <View style={{ marginTop: 50, flex: 1 }}>
            <ProfileImage
              profileImage={profilePicture}
              onPressCamera={onPressCamera}
              imageStyle={style.profileImage}
            />
            <Text style={[style.txtFace, { marginTop: 20 }]}>
              Kindly click picture of your face for verify with your documents
            </Text>
          </View>
          <CustomButton
            onPress={async () => {
              if (profilePicture !== "") {
                if (userData?.is_profile_completed == 1 && !newUploaded) {
                  const { data: currentUser } = await fetch<getUserData>({
                    url: API.ME,
                    method: "GET",
                  });
                  if (currentUser?.status == 1) {
                    if (currentUser?.user?.is_kyc_verified_by_admin == 1) {
                      dispatch(setUserData(currentUser?.user));
                      setData(USER_DATA, currentUser?.user);
                      setNavigation(currentUser?.user, navigationRoute);
                    } else {
                      if (currentUser?.user?.is_kyc_verified_by_admin == 0) {
                        dispatch(
                          setErrors({
                            message: "Wait for the verify by Admin",
                            status: 0,
                            statusCode: null,
                          })
                        );
                      } else {
                        dispatch(
                          setErrors({
                            message: "Your Profile is rejected by the Admin.",
                            status: 0,
                            statusCode: null,
                          })
                        );
                      }
                    }
                  }
                } else {
                  onPressContinue();
                }
              } else {
                dispatch(
                  setErrors({
                    message: "Please take the selfie",
                    status: 0,
                    statusCode: null,
                  })
                );
              }
            }}
            title={"Continue"}
            buttonWidth="full"
            variant="primary"
            type="solid"
            // disabled={!isValid || loading === LoadingState.CREATE}
            // loading={loading === LoadingState.CREATE}
          />
        </View>
      )}
    </View>
  );
};

export default TakeSelfie;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets?.top,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: props.insets.bottom + 10,
    alignSelf: "center",
    alignItems: "center",
  },
  btnCapture: {
    height: Scale(80),
    width: Scale(80),
  },
  cameraCont: {
    flex: 1,
  },
  txtFace: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginVertical: 10,
    textAlign: "center",
    marginHorizontal: 20,
  },
  profileImage: {
    height: Scale(180),
    width: Scale(180),
    borderRadius: Scale(180 / 2),
  },
}));
