import React, { useEffect, useState } from "react";
import { Platform, RefreshControl, StatusBar, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import DeliveryCodeVerificationPopup from "../components/DeliveryCodeVerificationPopup";
import HeaderHome from "../components/HeaderHome";
import PickupsListing from "../components/PickupsListing";
import NoDataFound from "../components/ui/NoDataFound";
import PickupAcceptedPopup from "../components/ui/popups/PickupAcceptedPopup";
import PickupPopup from "../components/ui/popups/PickupPopup";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useMeQuery } from "../hooks/useMeQuery";
import { selectMoverBookingLoading } from "../store/MoverBooking/moverBooking.selectors";
import {
  approveRejectMoverRequeste,
  moverRequestedDetails,
} from "../store/MoverBooking/moverBooking.thunk";
import { selectUserData } from "../store/settings/settings.selectors";
import { setUserData } from "../store/settings/settings.slice";
import { LoadingState, ThemeProps } from "../types/global.types";
import { MoverHomeNavigationProps } from "../types/navigation";

const Home: React.FC<MoverHomeNavigationProps<Route.navHomeMover>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const userData = useSelector(selectUserData);
  const loading = useSelector(selectMoverBookingLoading);

  const [name, setName] = useState(userData?.username);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState();
  const [visible, setVisible] = useState(false);
  const [visibleCodeVerification, setVisibleCodeVerification] = useState(false);
  const [visibleAcceptedPopup, setVisibleAcceptedPopup] = useState(false);

  const { data: currentUser, refetch } = useMeQuery({
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setName(userData?.username);
    });
    return () => {
      unsubscribe();
    };
  }, [userData]);

  useEffect(() => {
    if (currentUser?.user) {
      dispatch(setUserData(currentUser?.user));
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      StatusBar.setBarStyle("dark-content");
      Platform.OS === "android" && StatusBar.setTranslucent(true);
      Platform.OS === "android" && StatusBar.setBackgroundColor("transparent");
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onPressNotification = () => {
    navigation.navigate(Route.navInbox);
  };

  const onRefresh = () => {
    refetch().then();
    // getMoverRequestedData();
  };

  const getMoverRequestedData = async () => {
    const result = await dispatch(
      moverRequestedDetails({
        status: "all",
      })
    );
    if (moverRequestedDetails.fulfilled.match(result)) {
      console.log("data moverRequestedDetails --->", result.payload);
      if (result.payload.status == 1) {
        setRequestData(result.payload.data);
      }
    } else {
      if (result.payload?.status == 0) {
        setRequestData([]);
      }
      console.log("errror moverRequestedDetails --->", result.payload);
    }
  };

  const onPressItem = (item: any) => {
    if (item.status === "completed" || item.status === "startjob") {
      navigation.navigate(Route.navPackageDetails, {
        package_details_id: item?.id,
        pickupLatLng: {
          lat: item.pickup_point_lat,
          lng: item.pickup_point_lng,
        },
        destinationLatLng: {
          lat: item.delivery_point_lat,
          lng: item.delivery_point_lng,
        },
        canStartJob: item.status === "completed",
        canEndJob: item.status === "startjob",
        buyerSellerId: item.userid,
      });
    } else {
      setSelectedItem(item);
      setVisible(true);
    }
  };

  const showDetails = (item: { id: any }) => {
    navigation.navigate(Route.navDeliveryDetails1, {
      package_details_id: item.id,
      from: "mover",
    });
  };

  const togglePopup = () => {
    setVisible(!visible);
  };

  const onPressStartJob = async () => {
    const result = await dispatch(
      approveRejectMoverRequeste({
        id: selectedItem?.id,
        status: "startjob",
      })
    );
    if (approveRejectMoverRequeste.fulfilled.match(result)) {
      console.log("data Start job --->", result.payload);
      if (result.payload.status == 1) {
        getMoverRequestedData();
        togglePopup();
        // setTimeout(() => {
        //   navigation.navigate(Route.navPackageDetails, {
        //     package_details_id: selectedItem?.id,
        //     pickupLatLng: {
        //       lat: selectedItem?.pickup_point_lat,
        //       lng: selectedItem?.pickup_point_lng,
        //     },
        //     destinationLatLng: {
        //       lat: selectedItem?.delivery_point_lat,
        //       lng: selectedItem?.delivery_point_lng,
        //     },
        //   });
        // }, 1000);
      }
    } else {
      console.log("errror Start job --->", result.payload);
    }
  };
  const onPressEndJob = () => {
    setVisible(false);
    setTimeout(() => {
      setVisibleCodeVerification(true);
    }, 500);
  };

  const onPressConfirmPickup = async () => {
    setVisible(false);
    const result = await dispatch(
      approveRejectMoverRequeste({
        id: selectedItem?.id,
        status: "confirmed",
      })
    );
    if (approveRejectMoverRequeste.fulfilled.match(result)) {
      console.log("data approveRejectMoverRequeste --->", result.payload);
      if (result.payload.status == 1) {
        togglePopup();
        getMoverRequestedData();
        setVisibleAcceptedPopup(true);
        // setRequestData(result.payload.data);
      }
    } else {
      console.log("errror approveRejectMoverRequeste --->", result.payload);
    }
  };

  const onPressRejectRequest = async () => {
    const result = await dispatch(
      approveRejectMoverRequeste({
        id: selectedItem?.id,
        status: "cancelled",
      })
    );
    if (approveRejectMoverRequeste.fulfilled.match(result)) {
      console.log("data approveRejectMoverRequeste --->", result.payload);
      if (result.payload.status == 1) {
        getMoverRequestedData();

        togglePopup();

        // setRequestData(result.payload.data);
      }
    } else {
      console.log("errror approveRejectMoverRequeste --->", result.payload);
    }
  };

  const toggleDevliveryCodePopup = () => {
    getMoverRequestedData();
    setVisibleCodeVerification(!visibleCodeVerification);
  };

  const toggleAcceptedPopup = () => {
    setVisibleAcceptedPopup(!visibleAcceptedPopup);
  };

  const onPressOk = () => {
    setVisibleAcceptedPopup(false);
  };

  return (
    <View style={style.container}>
      <HeaderHome
        name={name}
        onPressNotification={onPressNotification}
        avgRate={userData?.avg_rate}
        totalUserRate={userData?.total_user_rate}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={loading === LoadingState.CREATE}
            onRefresh={onRefresh}
            tintColor={theme?.colors?.primary}
          />
        }
      >
        {requestData.length > 0 ? (
          <View style={[style.innerCont, { marginTop: 20 }]}>
            <PickupsListing
              data={requestData}
              onPress={onPressItem}
              onPressShowDetails={showDetails}
              isfromMover={true}
            />
          </View>
        ) : (
          <NoDataFound
            title="No request found!"
            isLoading={loading === LoadingState.CREATE}
          />
        )}
      </KeyboardAwareScrollView>
      <PickupPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        selectedItem={selectedItem}
        loading={loading}
        onPressConfirmPickup={onPressConfirmPickup}
        onPressReject={onPressRejectRequest}
        onPressStartJob={onPressStartJob}
        onPressEndJob={onPressEndJob}
      />
      <DeliveryCodeVerificationPopup
        visiblePopup={visibleCodeVerification}
        togglePopup={toggleDevliveryCodePopup}
        package_details_id={selectedItem?.id}
        isLoading={loading === LoadingState.CREATE}
      />
      <PickupAcceptedPopup
        visiblePopup={visibleAcceptedPopup}
        togglePopup={toggleAcceptedPopup}
        onPressOk={onPressOk}
      />
    </View>
  );
};

export default Home;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
  },
  scrollCont: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  innerCont: {
    paddingHorizontal: 20,
  },
}));
