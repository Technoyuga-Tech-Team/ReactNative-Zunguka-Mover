import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { USER_DATA, secureStoreKeys } from "../constant";
import { API } from "../constant/apiEndpoints";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetch } from "../store/fetch";
import { setUserData } from "../store/settings/settings.slice";
import { getUserData } from "../types/user.types";
import { appAlreadyOpen, getData } from "../utils/asyncStorage";
import Scale from "../utils/Scale";
import { setNavigation } from "../utils/setNavigation";
import { AppRoutes } from "../types/navigation";

interface SplashScreenProps {}

const Splash: React.FC<SplashScreenProps> = () => {
  const navigation = useNavigation<NavigationProp<AppRoutes>>();
  const styles = useStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const token = await getData(secureStoreKeys.JWT_TOKEN);
      console.log("Login Token -- ", token);
      if (token) {
        const user_data = await getData(USER_DATA);
        dispatch(setUserData(user_data));
        let steps = user_data.step;
        console.log("steps", steps);
        let isStepCompleted = user_data.is_profile_completed;
        console.log("isStepCompleted", isStepCompleted);

        let isVerify_by_Admin = user_data.is_kyc_verified_by_admin;
        console.log("isVerify_by_Admin", isVerify_by_Admin);

        setTimeout(() => {
          if (isStepCompleted == 1) {
            if (isVerify_by_Admin == 1) {
              setUpNavigation();
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: Route.navTakeSelfie, params: { fromflow: false } },
                  ],
                })
              );
            }
          } else {
            if (steps == 0) {
              // @ts-ignore
              // navigation.navigate(Route.navAddKyc);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Route.navAddKyc }],
                })
              );
            } else if (steps == 2) {
              setUpNavigation();
            }
          }
          // setUpNavigation();
        }, 2000);
      } else {
        if (await appAlreadyOpen()) {
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navAuthentication }],
              })
            );
          }, 2000);
        } else {
          setTimeout(async () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navOnboard }],
              })
            );
          }, 2000);
        }
      }
    };
    init();
  }, []);

  const setUpNavigation = async () => {
    const { data: currentUser } = await fetch<getUserData>({
      url: API.ME,
      method: "GET",
    });

    if (currentUser && currentUser?.status === 1) {
      setNavigation(currentUser.user, navigation);
    } else {
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

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme?.colors?.primary}
        barStyle={"light-content"}
      />
      <FastImage
        source={require("../assets/images/splash_black_logo.png")}
        style={{
          height: 224.74,
          width: Scale(195),
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme?.colors?.primary,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
}));
