import { CommonActions, NavigationProp } from "@react-navigation/native";
import { UserData } from "../types/user.types";
import { Route } from "../constant/navigationConstants";
import { AppRoutes } from "../types/navigation";

export const setNavigation = async (
  currentUser: UserData,
  navigation: NavigationProp<AppRoutes>
) => {
  console.log("currentUser", currentUser);
  if (currentUser?.is_verified == 0) {
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
  } else {
    if (currentUser?.is_mover_setup_profile_done == 0) {
      currentUser?.mover_setup_step == 0
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                    ],
                  },
                },
              ],
            })
          )
        : currentUser?.mover_setup_step == 1
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                      { name: Route.navSetupProfile2 },
                    ],
                  },
                },
              ],
            })
          )
        : currentUser?.mover_setup_step == 2
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                      { name: Route.navSetupProfile2 },
                      { name: Route.navSetupProfile3 },
                    ],
                  },
                },
              ],
            })
          )
        : currentUser?.mover_setup_step == 3
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                      { name: Route.navSetupProfile2 },
                      { name: Route.navSetupProfile3 },
                      { name: Route.navSetupProfile4 },
                    ],
                  },
                },
              ],
            })
          )
        : currentUser?.mover_setup_step == 4
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                      { name: Route.navSetupProfile2 },
                      { name: Route.navSetupProfile3 },
                      { name: Route.navSetupProfile4 },
                      { name: Route.navSetupProfile5 },
                    ],
                  },
                },
              ],
            })
          )
        : currentUser?.mover_setup_step == 5
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                      { name: Route.navSetupProfile2 },
                      { name: Route.navSetupProfile3 },
                      { name: Route.navSetupProfile4 },
                      { name: Route.navSetupProfile5 },
                      { name: Route.navSetupProfile6 },
                    ],
                  },
                },
              ],
            })
          )
        : currentUser?.mover_setup_step == 6
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: Route.navAuthentication,
                  state: {
                    routes: [
                      { name: Route.navLogin },
                      { name: Route.navSetupProfile1 },
                      { name: Route.navSetupProfile2 },
                      { name: Route.navSetupProfile3 },
                      { name: Route.navSetupProfile4 },
                      { name: Route.navSetupProfile5 },
                      { name: Route.navSetupProfile6 },
                      { name: Route.navSetupProfile7 },
                    ],
                  },
                },
              ],
            })
          )
        : navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Route.navDashboard }],
            })
          );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Route.navDashboard }],
        })
      );
    }
  }
};
