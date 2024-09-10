import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Platform,
  RefreshControl,
  StatusBar,
  View,
} from "react-native";
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
import {
  getNotificationCount,
  selectMoverRequestData,
  selectUserData,
} from "../store/settings/settings.selectors";
import { setUserData } from "../store/settings/settings.slice";
import { LoadingState, ThemeProps } from "../types/global.types";
import { MoverHomeNavigationProps } from "../types/navigation";
import CancelRequestWithReason from "../components/ui/popups/CancelRequestWithReason";
import { socket, socketEvent } from "../utils/socket";

const Home: React.FC<MoverHomeNavigationProps<Route.navHome>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const moverRequestData = useSelector(selectMoverRequestData);
  const userData = useSelector(selectUserData);
  const loading = useSelector(selectMoverBookingLoading);
  const notificationCount = useSelector(getNotificationCount);

  const appState = useRef(AppState.currentState);

  const [name, setName] = useState(userData?.username);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [visibleCodeVerification, setVisibleCodeVerification] = useState(false);
  const [visibleAcceptedPopup, setVisibleAcceptedPopup] = useState(false);
  const [openCancelRequestPopup, setOpenCancelRequestPopup] = useState(false);

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
    if (currentUser?.user) {
      socket.connect();
      const user_id = currentUser?.user?.id;
      socket.on(socketEvent.CONNECT, () => {
        console.log(" - - Connected to the server - - ");
        console.log("connected", socket.connected);
        console.log("Activate", socket.active);
        console.log("socket.id", socket.id);
        console.log("user_id - - - -", user_id);
        socket.emit("conn", user_id);
      });
      dispatch(setUserData(currentUser?.user));
    }
  }, [currentUser, socket]);

  useEffect(() => {
    if (moverRequestData?.length > 0) {
      setRequestData(moverRequestData);
    }
  }, [moverRequestData]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        refetch().then();
        console.log("App has come to the foreground!");
        socket.connect();
        const user_id = userData?.id;
        socket.on(socketEvent.CONNECT, () => {
          console.log("Connected to the server");
          console.log("connected", socket.connected);
          console.log("Activate", socket.active);
          console.log("socket.id", socket.id);
          console.log("user_id - - - -", user_id);
          socket.emit("conn", userData?.id);
        });
      } else {
        console.log("disconnected - - - userData?.id", userData?.id);
        socket.emit("disconnected", userData?.id);
        socket.emit("offline");
        socket.disconnect();
      }

      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [socket, userData]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     StatusBar.setBarStyle("dark-content");
  //     Platform.OS === "android" && StatusBar.setTranslucent(true);
  //     Platform.OS === "android" && StatusBar.setBackgroundColor("transparent");
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then();
      getMoverRequestedData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onPressNotification = () => {
    navigation.navigate(Route.navNotification);
  };

  const onRefresh = () => {
    refetch().then();
    getMoverRequestedData();
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
    if (
      item.status === "confirmed" ||
      item.status === "startjob" ||
      item.status === "completed"
    ) {
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
        product_id: item.product_id,
        isJobStarted: item.status === "startjob",
        canStartJob: item.status === "confirmed",
        canEndJob: item.status === "startjob" || item.status === "completed",
        buyerSellerId: item.userid,
        seller_id: item.seller_id,
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
      fromHome: "home",
    });
  };

  const togglePopup = () => {
    setVisible(!visible);
  };

  const onPressStartJob = async () => {
    const result = await dispatch(
      approveRejectMoverRequeste({
        package_details_id: selectedItem?.id,
        status: "startjob",
      })
    );
    if (approveRejectMoverRequeste.fulfilled.match(result)) {
      console.log("data Start job --->", result.payload);
      if (result.payload.status == 1) {
        getMoverRequestedData();
        togglePopup();
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
        package_details_id: selectedItem?.id,
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
    togglePopup();
    setTimeout(() => {
      setOpenCancelRequestPopup(true);
    }, 500);
  };

  const toggleDevliveryCodePopup = () => {
    getMoverRequestedData();
    setVisibleCodeVerification(!visibleCodeVerification);
  };

  const toggleAcceptedPopup = () => {
    setVisibleAcceptedPopup(!visibleAcceptedPopup);
  };
  const toggleCencelRequestPopup = () => {
    setOpenCancelRequestPopup(!openCancelRequestPopup);
  };

  const onPressOk = () => {
    setVisibleAcceptedPopup(false);
  };

  const onPressSubmitCancelRequest = async (reason: string) => {
    const result = await dispatch(
      approveRejectMoverRequeste({
        package_details_id: selectedItem?.id,
        status: "cancelled",
        reason: reason,
      })
    );
    if (approveRejectMoverRequeste.fulfilled.match(result)) {
      console.log("data approveRejectMoverRequeste --->", result.payload);
      if (result.payload.status == 1) {
        getMoverRequestedData();
        toggleCencelRequestPopup();
        // setRequestData(result.payload.data);
      }
    } else {
      console.log("errror approveRejectMoverRequeste --->", result.payload);
    }
  };

  return (
    <View style={style.container}>
      <StatusBar
        translucent
        backgroundColor={theme.colors?.primary}
        barStyle={"dark-content"}
      />
      <HeaderHome
        name={name}
        onPressNotification={onPressNotification}
        avgRate={userData?.avg_rate}
        totalUserRate={userData?.total_user_rate}
        notificationCount={notificationCount}
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
      <CancelRequestWithReason
        visiblePopup={openCancelRequestPopup}
        togglePopup={toggleCencelRequestPopup}
        onPressOk={(reason) => onPressSubmitCancelRequest(reason)}
      />
    </View>
  );
};

export default Home;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.lightBg,
  },
  scrollCont: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  innerCont: {
    paddingHorizontal: 20,
  },
}));
