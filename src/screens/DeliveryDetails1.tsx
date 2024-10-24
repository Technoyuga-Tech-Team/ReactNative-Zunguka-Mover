import { CommonActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Linking,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FullTheme, makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { MainNavigationProps } from "../types/navigation";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectMoverBookingLoading } from "../store/MoverBooking/moverBooking.selectors";
import { getIsPackageDelivered } from "../store/settings/settings.selectors";
import { DeliveryDetailsData } from "../types/delivery.types";
import {
  deliveryDetailsWithOTP,
  orderDetails,
} from "../store/MoverBooking/moverBooking.thunk";
import CustomHeader from "../components/ui/CustomHeader";
import { LoadingState, ThemeProps } from "../types/global.types";
import Loading from "../components/ui/Loading";
import PredefineOTPCodeView from "../components/ui/PredefineOTPCodeView";
import MoverItem from "../components/Mover/MoverItem";
import BorderBottomItem from "../components/DeliveryDetails/BorderBottomItem";
import RatingPopup from "../components/ui/popups/RatingPopup";
import { RWF } from "../constant";
import moment from "moment";
import NavigationIcon from "../components/ui/svg/NavigationIcon";
import Geolocation from "react-native-geolocation-service";

const DeliveryDetails1: React.FC<
  MainNavigationProps<Route.navDeliveryDetails1>
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const package_details_id = route.params?.package_details_id;
  const from_mover = route.params?.from == "mover";
  const from_mover_home = route.params?.fromHome == "home";
  const is_from_completed = route.params?.isCompleted || false;

  const loading = useSelector(selectMoverBookingLoading);
  const isPackageDeliverd = useSelector(getIsPackageDelivered);

  const [locationEnabled, setLocationEnabled] = useState(false);

  const [distance, setDistance] = useState<string>("");
  const [currentToPickupDistance, setCurrentToPickupDistance] =
    useState<string>("");
  const [visibleRatePopup, setVisibleRatePopup] = useState<boolean>(false);
  const [deliveryDetailsData, setDeliveryDetailsData] =
    useState<DeliveryDetailsData>({});

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "ios") {
        await Geolocation.requestAuthorization("whenInUse");
        setLocationEnabled(true);
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Required",
              message: "This App needs to Access your location",
              buttonPositive: "ok",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            setLocationEnabled(true);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      // Geolocation.clearWatch();
    };
  }, []);

  useEffect(() => {
    if (locationEnabled) {
      Geolocation.getCurrentPosition(
        (position) => {
          const currentLatitude = position.coords.latitude;
          const currentLongitude = position.coords.longitude;
          let distance = calculateDistance(
            currentLatitude,
            currentLongitude,
            Number(deliveryDetailsData.pickup_point_lat),
            Number(deliveryDetailsData.pickup_point_lng)
          );
          setCurrentToPickupDistance(`${distance.toFixed(2)}`);
        },
        (error) => {
          console.log("error", error);
        }
        // Update at least every 2 seconds
      );
    }
  }, [
    locationEnabled,
    deliveryDetailsData.pickup_point_lat,
    deliveryDetailsData.pickup_point_lng,
  ]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      getDeliveryDetails();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getDeliveryDetails = async () => {
    if (from_mover) {
      const result = await dispatch(
        orderDetails({
          package_details_id,
        })
      );
      if (orderDetails.fulfilled.match(result)) {
        if (result.payload.status == 1) {
          setDeliveryDetailsData(result.payload.data);
        }
      } else {
        if (result.payload?.status == 0) {
          setDeliveryDetailsData({});
        }
        console.log("errror orderDetails --->", result.payload);
      }
    } else {
      const result = await dispatch(
        deliveryDetailsWithOTP({
          package_details_id,
        })
      );
      if (deliveryDetailsWithOTP.fulfilled.match(result)) {
        if (result.payload.status == 1) {
          setDeliveryDetailsData(result.payload.data);
        }
      } else {
        if (result.payload?.status == 0) {
          setDeliveryDetailsData({});
        }
        console.log("errror deliveryDetailsWithOTP --->", result.payload);
      }
    }
  };
  const calculateDistance = (
    currentLatitude: number,
    currentLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
  ) => {
    var R = 6371; // km
    var dLat = toRad(destinationLatitude - currentLatitude);
    var dLon = toRad(destinationLongitude - currentLongitude);
    var lat1 = toRad(currentLatitude);
    var lat2 = toRad(destinationLatitude);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  function toRad(Value: number) {
    return (Value * Math.PI) / 180;
  }

  useEffect(() => {
    let distance = calculateDistance(
      Number(deliveryDetailsData.pickup_point_lat),
      Number(deliveryDetailsData.pickup_point_lng),
      Number(deliveryDetailsData.delivery_point_lat),
      Number(deliveryDetailsData.delivery_point_lng)
    );
    setDistance(`${distance.toFixed(2)}`);
    console.log("distance - - - ", distance);
  }, [
    deliveryDetailsData.pickup_point_lat,
    deliveryDetailsData.pickup_point_lng,
    deliveryDetailsData.delivery_point_lat,
    deliveryDetailsData.delivery_point_lng,
  ]);

  const onPress = () => {
    setVisibleRatePopup(true);
  };
  const togglePopup = () => {
    setVisibleRatePopup(!visibleRatePopup);
  };
  const onPressConfirmSendReview = (rate: number, comment: string) => {
    togglePopup();
  };

  const onPressBackBtn = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: Route.navBuyerSellerStack,
              state: {
                routes: [
                  { name: Route.navDashboard },
                  { name: Route.navRequestToMover },
                ],
              },
            },
          ],
        })
      );
    }
  };

  const onRefresh = () => {
    getDeliveryDetails();
  };

  const getColorFromStatus = (status: string, theme: Partial<FullTheme>) => {
    console.log("status", status);
    return status === "confirmed"
      ? theme.colors?.primary
      : status === "startjob"
      ? theme.colors?.green
      : status === "completed"
      ? theme.colors?.secondaryText
      : theme.colors?.pinkDark;
  };

  const getStatusStrings = (status: string) => {
    return status === "pending"
      ? "Request Pending"
      : status === "startjob"
      ? "Ongoing Job"
      : status === "completed"
      ? "At Delivery Location"
      : status === "confirmed"
      ? "Start job"
      : status;
  };

  const title =
    isPackageDeliverd == 1 ? "Package Delivered" : "Delivery Details";

  const date_Time = moment(deliveryDetailsData?.createdAt).format("DD/MM/YYYY");

  console.log("deliveryDetailsData", deliveryDetailsData);

  const googleMapOpenUrl = ({
    latitude,
    longitude,
  }: {
    latitude: any;
    longitude: any;
  }) => {
    const latLng = `${latitude},${longitude}`;
    return `google.navigation:q=${latLng}`;
  };

  const onPressOpenMap = () => {
    Linking.openURL(
      googleMapOpenUrl({
        latitude: deliveryDetailsData?.pickup_point_lat,
        longitude: deliveryDetailsData?.pickup_point_lng,
      })
    );
  };

  return (
    <View style={style.container}>
      <CustomHeader
        title={from_mover ? "Order Details" : title}
        isOutsideBack={true}
        onPressBackBtn={onPressBackBtn}
      />
      {loading && loading === LoadingState.CREATE && <Loading />}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollcont}
        refreshControl={
          <RefreshControl
            refreshing={loading === LoadingState.CREATE}
            onRefresh={onRefresh}
            tintColor={theme?.colors?.primary}
          />
        }
      >
        {!from_mover && (
          <PredefineOTPCodeView OTP={`${deliveryDetailsData?.otp}`} />
        )}
        {deliveryDetailsData?.profile_image && (
          <MoverItem
            item={{
              profile_image: deliveryDetailsData?.profile_image,
              first_name: deliveryDetailsData?.first_name,
              last_name: deliveryDetailsData?.last_name,
              email: deliveryDetailsData?.email,
              phone_number: deliveryDetailsData?.phone_number,
              vehicle_type: deliveryDetailsData?.vehicle_type,
              rate: deliveryDetailsData?.rate,
              address: deliveryDetailsData?.city,
              avg_rate: deliveryDetailsData?.avg_rate,
            }}
          />
        )}
        <View style={{ flex: 1, marginTop: 10 }}>
          <BorderBottomItem
            title="Receiver"
            value={deliveryDetailsData?.receiver_name}
            from_mover={false}
            showblur={from_mover && !from_mover_home ? true : false}
          />
          <BorderBottomItem
            title="Pickup point"
            value={deliveryDetailsData?.pickup_point_address}
            from_mover={false}
            numberOfLines={3}
            showblur={from_mover && !from_mover_home ? true : false}
          />
          <BorderBottomItem
            title="Delivery point"
            value={deliveryDetailsData?.delivery_point_address}
            from_mover={false}
            numberOfLines={3}
            showblur={from_mover && !from_mover_home ? true : false}
          />
          {date_Time && (
            <BorderBottomItem
              title="Date"
              value={date_Time}
              from_mover={false}
              numberOfLines={3}
              showblur={from_mover && !from_mover_home ? true : false}
            />
          )}
          {distance !== "" && (
            <BorderBottomItem
              title="Distance"
              value={`${distance} KM`}
              from_mover={false}
              numberOfLines={3}
              showblur={from_mover && !from_mover_home ? true : false}
            />
          )}
          {/* <BorderBottomItem
            title="Item name"
            value={deliveryDetailsData?.item_name}
            from_mover={false}
          /> */}
          {deliveryDetailsData?.item_size && (
            <BorderBottomItem
              title="Size"
              value={deliveryDetailsData?.item_size}
              from_mover={false}
            />
          )}
          {deliveryDetailsData?.package_delivery_date && (
            <BorderBottomItem
              title="Date"
              value={deliveryDetailsData?.package_delivery_date}
              from_mover={false}
            />
          )}
          {deliveryDetailsData?.package_delivery_time && (
            <BorderBottomItem
              title="Time"
              value={deliveryDetailsData?.package_delivery_time}
              from_mover={false}
            />
          )}
          {from_mover && (
            <BorderBottomItem
              title="Price"
              value={`${RWF} ${
                Number(deliveryDetailsData?.price).toFixed(2) || ""
              }`}
              from_mover={false}
            />
          )}
          {from_mover && (
            <BorderBottomItem
              title="Status"
              value={getStatusStrings(deliveryDetailsData?.status)}
              from_mover={false}
              txtColor={getColorFromStatus(deliveryDetailsData?.status, theme)}
            />
          )}
          {!is_from_completed && (
            <TouchableOpacity
              onPress={onPressOpenMap}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderColor: "#F5F7FA",
                borderWidth: 2,
                borderRadius: 8,
                backgroundColor: theme?.colors?.white,
                paddingHorizontal: 5,
                marginTop: 5,
              }}
            >
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <NavigationIcon
                  color={theme.colors?.black}
                  height={18}
                  width={18}
                />
                <Text
                  style={{
                    width: "80%",
                    marginLeft: 10,
                    fontSize: theme.fontSize?.fs14,
                    fontFamily: theme.fontFamily?.medium,
                    color: theme.colors?.black,
                  }}
                >
                  Current location to Pickup location distance
                </Text>
              </View>
              <Text
                style={{
                  fontSize: theme.fontSize?.fs14,
                  fontFamily: theme.fontFamily?.medium,
                  color: theme.colors?.secondaryText,
                }}
              >{`${currentToPickupDistance} KM`}</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <View style={{ marginVertical: 10 }}>
          <CustomButton
            onPress={onPress}
            title={"Rate the mover"}
            buttonWidth="full"
            variant="primary"
            type="solid"
          />
        </View> */}
      </KeyboardAwareScrollView>
      <RatingPopup
        visiblePopup={visibleRatePopup}
        togglePopup={togglePopup}
        onPressConfirmSendReview={onPressConfirmSendReview}
        isLoading={false}
      />
    </View>
  );
};

export default DeliveryDetails1;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    paddingTop: props.insets.top,
    paddingBottom: props.insets.bottom,
    backgroundColor: theme.colors?.background,
  },
  scrollcont: { paddingHorizontal: 20, flexGrow: 1 },
  shadow: {
    shadowColor: theme.colors?.blackTrans,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: Platform.OS === "ios" ? 0.8 : 0.1,
    shadowRadius: 50,
  },
}));
