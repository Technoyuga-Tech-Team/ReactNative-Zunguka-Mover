import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RNBootSplash from "react-native-bootsplash";
// relative path
import { AuthenticationRoutes } from "../types/navigation";
import { Route } from "../constant/navigationConstants";
import Login from "../screens/authentication/Login";
import Signup from "../screens/authentication/Signup";
import ForgotPassword from "../screens/authentication/ForgotPassword/ForgotPassword";
import EnterOTP from "../screens/authentication/ForgotPassword/EnterOTP";
import SetupProfile1 from "../screens/authentication/SetupProfiles/SetupProfile1";
import SetupProfile2 from "../screens/authentication/SetupProfiles/SetupProfile2";
import SetupProfile3 from "../screens/authentication/SetupProfiles/SetupProfile3";
import SetupProfile4 from "../screens/authentication/SetupProfiles/SetupProfile4";
import SetupProfile5 from "../screens/authentication/SetupProfiles/SetupProfile5";
import SetupProfile6 from "../screens/authentication/SetupProfiles/SetupProfile6";
import SetupProfile7 from "../screens/authentication/SetupProfiles/SetupProfile7";

const Stack = createNativeStackNavigator<AuthenticationRoutes>();

const Authentication = () => {
  React.useEffect(() => {
    const init = async () => {
      await RNBootSplash.hide();
    };
    init();
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Route.navLogin} component={Login} />
      <Stack.Screen name={Route.navSignup} component={Signup} />
      <Stack.Screen name={Route.navForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={Route.navEnterOTP} component={EnterOTP} />
      <Stack.Screen name={Route.navSetupProfile1} component={SetupProfile1} />
      <Stack.Screen name={Route.navSetupProfile2} component={SetupProfile2} />
      <Stack.Screen name={Route.navSetupProfile3} component={SetupProfile3} />
      <Stack.Screen name={Route.navSetupProfile4} component={SetupProfile4} />
      <Stack.Screen name={Route.navSetupProfile5} component={SetupProfile5} />
      <Stack.Screen name={Route.navSetupProfile6} component={SetupProfile6} />
      {/* <Stack.Screen name={Route.navSetupProfile7} component={SetupProfile7} /> */}
    </Stack.Navigator>
  );
};

export default Authentication;
