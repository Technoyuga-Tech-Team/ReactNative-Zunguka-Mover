import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthNavigationProps } from "../../../types/navigation";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useMeQuery } from "../../../hooks/useMeQuery";
import { useSelector } from "react-redux";
import { selectUserProfileLoading } from "../../../store/userprofile/userprofile.selectors";
import { userSetupProfile } from "../../../store/userprofile/userprofile.thunk";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import Loading from "../../../components/ui/Loading";
import SetupProfileHeader from "../../../components/SetupProfileHeader";
import CustomDropdown from "../../../components/Dropdown/CustomDropdown";
import { VEHICLE_TYPE_DATA } from "../../../constant";
import PrevNextCont from "../../../components/PrevNextCont";
import { UserRoleType } from "../../../types/user.types";
import { CommonActions } from "@react-navigation/native";

const SetupProfile6: React.FC<AuthNavigationProps<Route.navSetupProfile6>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { refetch } = useMeQuery({ enabled: false });

  const loading = useSelector(selectUserProfileLoading);

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleError, setVehicleError] = useState("");

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        if (currentUser?.data?.user) {
          currentUser?.data?.user?.vehicle_type &&
            setSelectedVehicle(currentUser?.data?.user?.vehicle_type);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onPressPrev = () => {
    navigation.goBack();
  };
  const onPressNext = async () => {
    if (selectedVehicle !== "") {
      const formData = new FormData();

      formData.append("vehicle_type", selectedVehicle);
      formData.append("step", 6);
      formData.append("type", UserRoleType.MOVER);

      const result = await dispatch(
        userSetupProfile({
          formData: formData,
        })
      );
      if (userSetupProfile.fulfilled.match(result)) {
        if (result.payload?.data) {
          if (result.payload?.data?.mover_setup_step == 6) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navDashboard,
                  },
                ],
              })
            );
          }
        }
      } else {
        console.log("errror userSetupProfile --->", result.payload);
      }
    } else {
      if (selectedVehicle == "") {
        setVehicleError("Please select the vehicle type.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <SetupProfileHeader title={"Vehicle Type"} percent={9} />
      <View style={style.innerCont}>
        <CustomDropdown
          dropDownData={VEHICLE_TYPE_DATA}
          placeHolder={"Select Vehicle"}
          value={selectedVehicle}
          topMargin={10}
          onSelect={(val) => {
            setSelectedVehicle(val.title);
            setVehicleError("");
          }}
          error={vehicleError}
        />
      </View>
      <PrevNextCont onPressNext={onPressNext} onPressPrev={onPressPrev} />
    </KeyboardAwareScrollView>
  );
};

export default SetupProfile6;

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
}));
