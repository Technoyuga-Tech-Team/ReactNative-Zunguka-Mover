import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {USER_DATA, secureStoreKeys} from '../constant';
import {Route} from '../constant/navigationConstants';
import Scale from '../utils/Scale';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {appAlreadyOpen, getData} from '../utils/asyncStorage';
import {setUserData} from '../store/settings/settings.slice';

interface SplashScreenProps {}

const Splash: React.FC<SplashScreenProps> = () => {
  const navigation = useNavigation();
  const styles = useStyles();
  const {theme} = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const token = await getData(secureStoreKeys.JWT_TOKEN);
      console.log('Login Token -- ', token);
      if (token) {
        const user_data = await getData(USER_DATA);
        dispatch(setUserData(user_data));
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: Route.navDashboard}],
            }),
          );
        }, 2000);
      } else {
        if (await appAlreadyOpen()) {
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: Route.navAuthentication}],
              }),
            );
          }, 2000);
        } else {
          setTimeout(async () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: Route.navOnboard}],
              }),
            );
          }, 2000);
        }
      }
    };
    init();
  }, []);

  //   const setUpNavigation = async () => {
  //     const {data: currentUser} = await fetch({
  //       url: API.ME,
  //       method: 'GET',
  //     });

  //     if (currentUser && currentUser?.status === 1) {
  //       // setNavigation(currentUser.user, navigation);
  //     } else {
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [
  //             {
  //               name: Route.navAuthentication,
  //               state: {
  //                 routes: [{name: Route.navLogin}],
  //               },
  //             },
  //           ],
  //         }),
  //       );
  //     }
  //   };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme?.colors?.primary}
        barStyle={'light-content'}
      />
      <FastImage
        source={require('../assets/images/splash_black_logo.png')}
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

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme?.colors?.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
}));
