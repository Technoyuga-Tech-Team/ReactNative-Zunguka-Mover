import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
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
import Loading from "../../components/ui/Loading";
import ProfileImage from "../../components/ui/Profile/ProfileImage";
import {
  HIT_SLOP2,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  USER_DATA,
} from "../../constant";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useMeQuery } from "../../hooks/useMeQuery";
import { selectAuthenticationLoading } from "../../store/authentication/authentication.selectors";
import { userSelfieVerification } from "../../store/authentication/authentication.thunks";
import { setErrors, setSuccess } from "../../store/global/global.slice";
import { selectUserData } from "../../store/settings/settings.selectors";
import { setUserData } from "../../store/settings/settings.slice";
import { imagePickerProps } from "../../types/common.types";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { AppRoutes, MainNavigationProps } from "../../types/navigation";
import { getRandomFileName, getUrlExtension } from "../../utils";
import Scale from "../../utils/Scale";
import { setData } from "../../utils/asyncStorage";
import { notifyMessage } from "../../utils/notifyMessage";
import { setNavigation } from "../../utils/setNavigation";

const TakeSelfie: React.FC<MainNavigationProps<Route.navTakeSelfie>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const { fromflow } = route.params;

  const dispatch = useAppDispatch();
  const navigationRoute = useNavigation<NavigationProp<AppRoutes>>();
  const userData = useSelector(selectUserData);

  const loading = useSelector(selectAuthenticationLoading);

  const cameraRef = useRef<RNCamera>(null);
  const [capturing, setCapturing] = useState(false);

  const [loader, setLoader] = useState(true);
  const [newUploaded, setNewUploaded] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [selfieUploaded, setSelfieUploded] = useState<number>(0);
  const [isVerifiedByAdmin, setIsVerifiedByAdmin] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<imagePickerProps>({
    name: "",
    type: "",
    uri: "",
  });

  const { data: currentUser, refetch: refetchUser } = useMeQuery({
    staleTime: Infinity,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (currentUser?.user) {
      dispatch(setUserData(currentUser?.user));
    }
  }, [currentUser]);

  useEffect(() => {
    refetchUser();
    const init = async () => {
      await RNBootSplash.hide();
    };
    init();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (userData) {
      setProfilePicture(userData?.selfie_image);
      setIsVerifiedByAdmin(userData?.is_kyc_verified_by_admin);
      setSelfieUploded(userData?.is_selfie_uploaded);
    }
  }, [userData]);

  useEffect(() => {
    // uploaded and rejected by admin
    if (selfieUploaded == 1 && isVerifiedByAdmin == 2) {
      setAccountStatus("Rejected");
    } else if (
      (selfieUploaded == 0 || selfieUploaded == 1) &&
      isVerifiedByAdmin == 0
    ) {
      setAccountStatus("Pending");
    } else if (selfieUploaded == 1 && isVerifiedByAdmin == 1) {
      setAccountStatus("Completed");
    }
  }, [selfieUploaded, isVerifiedByAdmin]);

  useEffect(() => {
    const onBackPress = () => {
      if (showCamera) {
        setShowCamera(false);
        return true;
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Route.navAuthentication }],
          })
        );
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [showCamera]);

  const takePictureAsync = async () => {
    if (cameraRef.current && !capturing) {
      setCapturing(true);
      const options = { quality: 0.8 };
      const data = await cameraRef.current.takePictureAsync(options);
      if (data) {
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
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: Route.navAuthentication,
                      state: {
                        routes: [{ name: Route.navLogin }],
                      },
                    },
                  ],
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

  const onPressBackBtn = () => {
    if (navigation?.canGoBack()) {
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
      <StatusBar translucent backgroundColor={"transparent"} />
      <CustomHeader
        title="Selfie Verification"
        isBackVisible={fromflow}
        isOutsideBack={true}
        onPressBackBtn={onPressBackBtn}
      />
      {loader && <Loading backgroundColor={theme?.colors?.white} />}
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
          {selfieUploaded == 1 && accountStatus == "Pending" ? (
            <>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppImage
                  source={Images.LOADER}
                  style={{ height: 70, width: 70, marginBottom: 20 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: Scale(30),
                    fontFamily: theme?.fontFamily?.bold,
                    color: theme?.colors?.black,
                  }}
                >
                  Profile under review
                </Text>
                <Text style={style.txtFace}>
                  Your profile is under review, Admin will verify soon
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={{ marginTop: 50, flex: 1 }}>
                <ProfileImage
                  profileImage={profilePicture}
                  onPressCamera={onPressCamera}
                  imageStyle={style.profileImage}
                  showIcon={
                    accountStatus == "Pending" || accountStatus == "Rejected"
                  }
                />

                {accountStatus == "Pending" && (
                  <Text style={[style.txtFace, { marginTop: 20 }]}>
                    Kindly click picture of your face for verify with your
                    documents
                  </Text>
                )}
                {accountStatus == "Rejected" && (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 50,
                    }}
                  >
                    <AppImage
                      source={Images.OOPS}
                      style={{ height: 80, width: 80 }}
                      resizeMode="contain"
                    />
                    <Text style={[style.txtFace, { marginTop: 20 }]}>
                      Your Profile is Rejeceted by Admin, please upload new
                      selfie!
                    </Text>
                  </View>
                )}
                {accountStatus == "Completed" && (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 50,
                    }}
                  >
                    <AppImage
                      source={Images.CHEARS}
                      style={{ height: 100, width: 100 }}
                      resizeMode="contain"
                    />
                    <Text style={[style.txtFace, { marginTop: 20 }]}>
                      Your Profile is Verified by Admin, You are good to go!
                    </Text>
                  </View>
                )}
              </View>
              <CustomButton
                onPress={async () => {
                  if (profilePicture && profilePicture !== "") {
                    if (userData?.is_profile_completed == 1 && !newUploaded) {
                      if (accountStatus == "Completed") {
                        setData(USER_DATA, userData);
                        setNavigation(userData, navigationRoute);
                      } else {
                        if (accountStatus == "Pending") {
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
                disabled={loading === LoadingState.CREATE}
                loading={loading === LoadingState.CREATE}
              />
            </>
          )}
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
    height: Scale(300),
    width: Scale(300),
    borderRadius: 20,
  },
}));
