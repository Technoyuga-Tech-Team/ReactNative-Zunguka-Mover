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
import {
  DISTRICT_AND_SECTORS,
  USA_STATE,
  USA_STATES_CITY,
} from "../../../constant";
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

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  const [district, setDistrict] = useState("");
  const [districtError, setDistrictError] = useState("");

  const [sector, setSector] = useState("");
  const [sectorError, setSectorError] = useState("");

  const [sectorData, setSectorData] = useState<
    { title: string; key: string }[]
  >([]);

  useEffect(() => {
    if (district) {
      DISTRICT_AND_SECTORS.map((ele) => {
        if (ele.key == district) {
          setSectorData(ele.sectors);
        }
      });
    }
  }, [district]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        if (currentUser?.data?.user) {
          console.log("currentUser?.data?.user", currentUser?.data?.user);
          currentUser?.data?.user?.state &&
            setSelectedDistrict(currentUser?.data?.user?.state);
          currentUser?.data?.user?.city &&
            setSelectedSector(currentUser?.data?.user?.city);
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
    if (
      selectedDistrict &&
      selectedDistrict !== "" &&
      selectedSector &&
      selectedSector !== ""
    ) {
      const formData = new FormData();

      formData.append("state", selectedDistrict);
      formData.append("sector", selectedSector);
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
      if (selectedDistrict == "" && selectedSector == "") {
        setDistrictError("Please select the district.");
        setSectorError("Please select the sector.");
      } else if (selectedDistrict == "") {
        setDistrictError("Please select the district.");
      } else if (selectedSector == "") {
        setSectorError("Please select the sector.");
      }
    }
  };

  const onSelectState = (val: { title: string; key: string; id: string }) => {
    setDistrictError("");
    setDistrict(val.key);
    setSelectedDistrict(val.key);
  };

  const onSelectCity = (val: { title: string; key: string; id: string }) => {
    setSectorError("");
    setSector(val.key);
    setSelectedSector(val.key);
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
          dropDownData={DISTRICT_AND_SECTORS}
          placeHolder={"District"}
          value={district}
          topMargin={10}
          onSelect={onSelectState}
          error={districtError}
        />
        <CustomDropdown
          dropDownData={sectorData}
          placeHolder={"Sector"}
          value={sector}
          topMargin={10}
          onSelect={onSelectCity}
          error={sectorError}
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
