import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrevNextCont from "../../../components/PrevNextCont";
import SetupProfileHeader from "../../../components/SetupProfileHeader";
import Loading from "../../../components/ui/Loading";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useMeQuery } from "../../../hooks/useMeQuery";
import { selectUserProfileLoading } from "../../../store/userprofile/userprofile.selectors";
import { userSetupProfile } from "../../../store/userprofile/userprofile.thunk";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import { AuthNavigationProps } from "../../../types/navigation";
import { useSelector } from "react-redux";
import CustomDropdown from "../../../components/Dropdown/CustomDropdown";
import { USA_STATE, USA_STATES_CITY } from "../../../constant";
import { UserRoleType } from "../../../types/user.types";

const SetupProfile5: React.FC<AuthNavigationProps<Route.navSetupProfile5>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { refetch } = useMeQuery({ enabled: false });

  const loading = useSelector(selectUserProfileLoading);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  const [citiesData, setCitiesData] = useState(USA_STATES_CITY["New_York"]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        if (currentUser?.data?.user) {
          setSelectedState(currentUser?.data?.user?.state);
          setSelectedCity(currentUser?.data?.user?.city);
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
    if (selectedState !== "" && selectedCity !== "") {
      const formData = new FormData();

      formData.append("state", selectedState);
      formData.append("city", selectedCity);
      formData.append("step", 5);
      formData.append("type", UserRoleType.MOVER);

      const result = await dispatch(
        userSetupProfile({
          formData: formData,
        })
      );
      if (userSetupProfile.fulfilled.match(result)) {
        if (result.payload?.data) {
          if (result.payload?.data?.mover_setup_step == 5) {
            navigation.navigate(Route.navSetupProfile6);
          }
        }
      } else {
        console.log("errror userSetupProfile --->", result.payload);
      }
    } else {
      if (selectedState == "" && selectedCity == "") {
        setStateError("Please select the state.");
        setCityError("Please select the city.");
      } else if (selectedState == "") {
        setStateError("Please select the state.");
      } else if (selectedCity == "") {
        setCityError("Please select the city.");
      }
    }
  };

  const onSelectState = (val: { title: string; key: string; id: string }) => {
    setSelectedState(val.title);
    setStateError("");
    let getCity = USA_STATES_CITY[val.title];
    setCitiesData(getCity);
  };

  const onSelectCity = (val: { title: string; key: string; id: string }) => {
    setSelectedCity(val.title);
    setCityError("");
  };
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <SetupProfileHeader title={"Location You Can Drive"} percent={7} />
      <View style={style.innerCont}>
        <CustomDropdown
          dropDownData={USA_STATE}
          placeHolder={"State"}
          value={selectedState}
          topMargin={10}
          onSelect={onSelectState}
          error={stateError}
        />
        <CustomDropdown
          dropDownData={citiesData}
          placeHolder={"City"}
          value={selectedCity}
          topMargin={10}
          onSelect={onSelectCity}
          error={cityError}
        />
      </View>
      <PrevNextCont onPressNext={onPressNext} onPressPrev={onPressPrev} />
    </KeyboardAwareScrollView>
  );
};

export default SetupProfile5;

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
