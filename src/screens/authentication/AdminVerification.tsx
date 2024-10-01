import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "react-native-elements";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeNavigationProps } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import CustomHeader from "../../components/ui/CustomHeader";
import { AppImage } from "../../components/AppImage/AppImage";
import { Images } from "../../assets/images";
import Scale from "../../utils/Scale";
import CustomButton from "../../components/ui/CustomButton";
import { selectAuthenticationLoading } from "../../store/authentication/authentication.selectors";
import { useSelector } from "react-redux";
import { useMeQuery } from "../../hooks/useMeQuery";
import RNBootSplash from "react-native-bootsplash";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setUserData } from "../../store/settings/settings.slice";
import { selectUserData } from "../../store/settings/settings.selectors";
import { CommonActions } from "@react-navigation/native";
import { setErrors } from "../../store/global/global.slice";
import Loading from "../../components/ui/Loading";
import { setData } from "../../utils/asyncStorage";
import { USER_DATA } from "../../constant";

const AdminVerification: React.FC<
  HomeNavigationProps<Route.navAdminVerification>
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUserData);

  const loading = useSelector(selectAuthenticationLoading);

  const [isVerifiedByAdmin, setIsVerifiedByAdmin] = useState<number>(0);
  const [loader, setLoader] = useState(true);

  const { data: currentUser, refetch: refetchUser } = useMeQuery({
    staleTime: Infinity,
    refetchInterval: 5000,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (currentUser?.user) {
      setData(USER_DATA, currentUser?.user);
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
    if (userData) {
      setIsVerifiedByAdmin(userData?.all_documentation_approved_by_admin);
    }
  }, [userData]);

  const onPressContinue = () => {
    if (isVerifiedByAdmin == 1) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Route.navDashboard }],
        })
      );
    } else if (isVerifiedByAdmin == 0) {
      dispatch(
        setErrors({
          message: "Account verification is pending.",
          status: 0,
          statusCode: null,
        })
      );
    } else {
      dispatch(
        setErrors({
          message: "Account verification is rejected.",
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
  };

  const img =
    isVerifiedByAdmin == 0
      ? Images.LOADER
      : isVerifiedByAdmin == 1
      ? Images.CHEARS
      : Images.OOPS;

  // Images.CHEARS
  return (
    <View style={style.container}>
      <CustomHeader title="Admin Verification" />
      {loader && <Loading backgroundColor={theme?.colors?.white} />}

      <View style={style.innerCont}>
        <AppImage source={img} style={style.img} resizeMode="contain" />
        <Text style={style.txtTitle}>
          {isVerifiedByAdmin == 0
            ? "Profile under review"
            : isVerifiedByAdmin == 1
            ? "Profile verification Successfully"
            : "Profile is rejecetd"}
        </Text>
        <Text style={style.txtFace}>
          {isVerifiedByAdmin == 0
            ? "Your profile is under review, please wait for 24 hours admin will verify"
            : isVerifiedByAdmin == 1
            ? "Your profile is verified, you are good to go"
            : "Your profile is rejected by Admin"}
        </Text>
      </View>
      <CustomButton
        onPress={onPressContinue}
        title={"Continue"}
        buttonWidth="full"
        variant="primary"
        type="solid"
        disabled={loading === LoadingState.CREATE}
        loading={loading === LoadingState.CREATE}
      />
    </View>
  );
};

export default AdminVerification;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets?.top,
    paddingBottom: props.insets?.bottom + 10,
  },
  txtFace: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginVertical: 10,
    textAlign: "center",
    marginHorizontal: 20,
  },
  txtTitle: {
    fontSize: Scale(30),
    fontFamily: theme?.fontFamily?.bold,
    color: theme?.colors?.black,
    textAlign: "center",
  },
  img: { height: 70, width: 70, marginBottom: 20 },
  innerCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));
