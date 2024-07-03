// import appleAuth from "@invertase/react-native-apple-authentication";
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Platform, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../../hooks/useAppDispatch';
// import { selectOAuthLoading } from "../../../store/authentication/authentication.selectors";
// import { setOAuthLoading } from "../../../store/authentication/authentication.slice";
// import { oAuthLogin } from "../../../store/authentication/authentication.thunks";
import {setErrors, setSuccess} from '../../../store/global/global.slice';
// import { setErrorFromSocial } from "../../../store/settings/settings.slice";
import {AuthLoadingState} from '../../../types/global.types';
import {AuthenticationRoutes} from '../../../types/navigation';
import SocialIconBlock from './SocialIconBlock';
import GoogleIcon from '../svg/GoogleIcon';
import AppleIcon from '../svg/AppleIcon';
import FacebookIcon from '../svg/FacebookIcon';
import {GOOGLE_WEB_CLIENT_ID} from '../../../constant';
import {
  saveAddress,
  setErrorFromSocial,
} from '../../../store/settings/settings.slice';
// import { setOAuthLoading } from "../../../store/authentication/authentication.slice";
// import { selectOAuthLoading } from "../../../store/authentication/authentication.selectors";
// import { oAuthLogin } from "../../../store/authentication/authentication.thunks";
import {Route} from '../../../constant/navigationConstants';

interface SocialAuthenticationViewProps {
  fromLogin: boolean;
  userRole: string;
  fcmToken: string;
}

const SocialAuthenticationView: React.FC<SocialAuthenticationViewProps> = ({
  fromLogin,
  userRole,
  fcmToken,
}) => {
  const Style = useStyle();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthenticationRoutes>>();
  // const loading = useSelector(selectOAuthLoading);

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: GOOGLE_WEB_CLIENT_ID,
  //     offlineAccess: true,
  //     // scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
  //   });
  // }, []);

  // const onPressGoogleLogin = async () => {
  //   dispatch(setErrorFromSocial(true));
  //   dispatch(setOAuthLoading(AuthLoadingState.GOOGLE));
  //   try {
  //     const userInfo = await GoogleSignin.signIn();
  //     const googleCredential = auth.GoogleAuthProvider.credential(
  //       userInfo.idToken
  //     );

  //     let param = {
  //       first_name: userInfo.user.name,
  //       last_name: userInfo.user.name,
  //       username: userInfo.user.givenName,
  //       profile_image: userInfo?.user?.photo || "",
  //       email: userInfo.user.email,
  //       social_id: googleCredential.token,
  //       is_social: 1,
  //       social_type: "google",
  //       iso: "RW",
  //       device_type: Platform.OS === "ios" ? "iOS" : "Android",
  //       device_token: fcmToken || null,
  //       credential: googleCredential,
  //     };

  //     const result = await dispatch(oAuthLogin(param));
  //     if (oAuthLogin.fulfilled.match(result)) {
  //       if (result.payload.status == 1) {
  //         console.log("result.payload", result.payload);
  //         let steps = result.payload?.user?.step;

  //         if (steps !== 2) {
  //           if (steps == 0) {
  //             dispatch(saveAddress(""));
  //             navigation.navigate(Route.navYourAddress);
  //           } else if (steps == 1) {
  //             navigation.navigate(Route.navAddKyc);
  //           }
  //         } else {
  //           navigation.dispatch(
  //             CommonActions.reset({
  //               index: 0,
  //               routes: [{ name: Route.navDashboard }],
  //             })
  //           );
  //           dispatch(setSuccess(result.payload.message));
  //         }
  //         dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //       }
  //     } else {
  //       dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //   }
  // };

  // const handleFacebookSignIn = useCallback(async () => {
  //   try {
  //     dispatch(setOAuthLoading(AuthLoadingState.FACEBOOK));
  //     // Attempt login with permissions
  //     const loginResult = await LoginManager.logInWithPermissions([
  //       "public_profile",
  //     ]);

  //     if (loginResult.isCancelled) {
  //       throw new Error("Couldn't complete the auth flow");
  //     }

  //     // Once signed in, get the users AccessToken
  //     const data = await AccessToken.getCurrentAccessToken();

  //     if (!data) {
  //       throw new Error("Something went wrong obtaining access token");
  //     }

  //     // Create a Firebase credential with the AccessToken
  //     const facebookCredential = auth.FacebookAuthProvider.credential(
  //       data.accessToken
  //     );

  //     const fbUSerData = await Profile.getCurrentProfile();

  //     let param = {
  //       name: fbUSerData?.name,
  //       user_type: userLoginType.key,
  //       social_login: "facebook",
  //       social_login_id: fbUSerData?.userID,
  //     };

  //     fbUSerData?.email ? (param.email = fbUSerData?.email) : null;

  //     const result = await dispatch(oAuth(param));

  //     if (oAuth.fulfilled.match(result)) {
  //       dispatch(setOAuthLoading(AuthLoadingState.NULL));

  //       if (result?.payload?.is_social_login === 0) {
  //         navigation.navigate(Route.navSignup, { fromSocialLogin: true });
  //       } else {
  //         dispatch(setIsUserLogin(true));
  //         navigation.navigate(Route.navDashboard);
  //       }
  //     } else {
  //       dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //     }
  //   } catch (error) {
  //     dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //     console.log("ERROR", error);
  //     dispatch(
  //       setErrors({
  //         status: false,
  //         statusCode: 400,
  //         errorMessage: error?.message || "Something went wrong",
  //       })
  //     );
  //   }
  // }, [dispatch, navigation]);

  // const onPressAppleLogin = async () => {
  //   try {
  //     dispatch(setOAuthLoading(AuthLoadingState.APPLE));
  //     // Attempt login with permissions
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });

  //     // Ensure Apple returned a user identityToken
  //     if (!appleAuthRequestResponse.identityToken) {
  //       throw new Error("Apple Sign-In failed - no identify token returned");
  //     }

  //     // Create a Firebase credential from the response
  //     const { identityToken, nonce, email, fullName } =
  //       appleAuthRequestResponse;
  //     const appleCredential = auth.AppleAuthProvider.credential(
  //       identityToken,
  //       nonce
  //     );

  //     let param = {
  //       first_name: fullName?.givenName,
  //       last_name: fullName?.givenName,
  //       type: userRole,
  //       is_social: 1,
  //       social_type: "apple",
  //       iso: "US",
  //       device_type: Platform.OS === "ios" ? "iOS" : "Android",
  //       device_token: fcmToken || null,
  //       credential: appleCredential,
  //     };

  //     const result = await dispatch(oAuthLogin(param));

  //     if (oAuthLogin.fulfilled.match(result)) {
  //       dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [
  //             {
  //               name: Route.navBuyerSellerStack,
  //               state: {
  //                 routes: [{ name: Route.navDashboard }],
  //               },
  //             },
  //           ],
  //         })
  //       );
  //     } else {
  //       dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //     }
  //   } catch (error) {
  //     dispatch(setOAuthLoading(AuthLoadingState.NULL));
  //     dispatch(
  //       setErrors({
  //         message: error?.message || "Something went wrong",
  //         status: 0,
  //         statusCode: 500,
  //       })
  //     );
  //   }
  // };

  return (
    <View style={Style.container}>
      <SocialIconBlock
        // loading={loading === "google"}
        icon={<GoogleIcon />}
        // onPress={onPressGoogleLogin}
      />
      {Platform.OS === 'ios' && (
        <SocialIconBlock
          // loading={loading === "apple"}
          icon={<AppleIcon />}
          onPress={() => {}}
        />
      )}
      <SocialIconBlock
        // loading={loading === "facebook"}
        icon={<FacebookIcon />}
        onPress={() => {}}

        // onPress={handleFacebookSignIn} this will work after upload to play store
      />
    </View>
  );
};

export default SocialAuthenticationView;

const useStyle = makeStyles(theme => ({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
}));
