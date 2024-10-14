import { decode } from "@mapbox/polyline";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropShadow from "react-native-drop-shadow";
import { makeStyles, useTheme } from "react-native-elements";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import DeliveryCodeVerificationPopup from "../../components/DeliveryCodeVerificationPopup";
import CustomHeader from "../../components/ui/CustomHeader";
import Loading from "../../components/ui/Loading";
import ChatFillIcon from "../../components/ui/svg/ChatFillIcon";
import ProductLocation from "../../components/ui/svg/ProductLocation";
import {
  GOOGLE_MAP_API_KEY,
  HIT_SLOP,
  HIT_SLOP2,
  secureStoreKeys,
} from "../../constant";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectMoverBookingLoading } from "../../store/MoverBooking/moverBooking.selectors";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { MainNavigationProps } from "../../types/navigation";
import { getData } from "../../utils/asyncStorage";
import Scale from "../../utils/Scale";
import { socket, socketEvent } from "../../utils/socket";
import { Images } from "../../assets/images";

const PackageDetails: React.FC<
  MainNavigationProps<Route.navPackageDetails>
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);

  const package_details_id = route?.params?.package_details_id;
  const destination_lat_lng = route?.params?.destinationLatLng;
  const pickup_lat_lng = route?.params?.pickupLatLng;
  const buyerSellerId = route?.params?.buyerSellerId;
  const sellerId = route?.params?.seller_id;
  const product_id = route?.params?.product_id;

  const loading = useSelector(selectMoverBookingLoading);
  const dispatch = useAppDispatch();

  const [coords, setCoords] = useState<any[]>([]);
  const [visibleCodeVerification, setVisibleCodeVerification] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [stopFetchingLocation, setStopFetchingLocation] = useState(true);
  const [showStartBtn, setShowStartBtn] = useState(false);
  const [showEndBtn, setShowEndBtn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [jobType, setJobType] = useState("");
  const [currentLatLng, setCurrentLatLng] = useState({ lat: 0, lng: 0 });

  const [canJobStartJob, setCanStartJob] = useState(route?.params?.canStartJob);
  const [canJobEndJob, setCanEndJob] = useState(route?.params?.canEndJob);
  const [isJobStared, setIsJobStarted] = useState(route?.params?.isJobStarted);

  console.log("route?.params?.canEndJob", route?.params?.canEndJob);
  console.log("canJobStartJob", canJobStartJob);
  console.log("canJobEndJob", canJobEndJob);

  useEffect(() => {
    const init = async () => {
      const token = await getData(secureStoreKeys.JWT_TOKEN);
      setAuthToken(token);
    };
    init();
  }, []);

  const getDirections = async (startLoc: string, destinationLoc: string) => {
    try {
      const KEY = GOOGLE_MAP_API_KEY; //put your API key here.
      //otherwise, you'll have an 'unauthorized' error.
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
      );
      let respJson = await resp.json();
      let points = decode(respJson?.routes[0]?.overview_polyline?.points);
      let coords = points.map((point: any[], index: any) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      return coords;
    } catch (error) {
      console.log("error = = = ", error);
      return error;
    }
  };

  useEffect(() => {
    //fetch the coordinates and then store its value into the coords Hook.
    getDirections(
      `${pickup_lat_lng?.lat},${pickup_lat_lng?.lng}`,
      `${destination_lat_lng?.lat},${destination_lat_lng?.lng}`
    )
      .then((coords: any) => setCoords(coords))
      .catch((err) => console.log("Something went wrong", err));
  }, []);

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
    if (locationEnabled) {
      const watchId = Geolocation.watchPosition(
        async (position) => {
          const currentLatitude = position.coords.latitude;
          const currentLongitude = position.coords.longitude;
          mapRef.current?.animateToRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.007,
          });
          setCurrentLatLng({ lat: currentLatitude, lng: currentLongitude });
        },
        (error) => console.log("error", error),
        { enableHighAccuracy: true, interval: 5000 } // Update at least every 5 seconds
      );

      return () => Geolocation.clearWatch(watchId);
    }
  }, [locationEnabled]);

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressEndJob = () => {
    setJobType("end");
    setVisibleCodeVerification(true);
  };
  const onPressJob = () => {
    setVisibleCodeVerification(true);
  };
  const toggleDevliveryCodePopup = () => {
    setVisibleCodeVerification(!visibleCodeVerification);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (currentLatLng) {
      const startCoords = coords[0];
      const distance = calculateDistance(
        currentLatLng.lat,
        currentLatLng.lng,
        startCoords?.latitude,
        startCoords?.longitude
      ); // Implement distance calculation function
      console.log("start distance", distance);
      setShowStartBtn(distance < 0.09); // Adjust the threshold based on your needs (in meters)
    }
  }, [currentLatLng, coords]);

  useEffect(() => {
    if (currentLatLng) {
      const endCoords = coords[coords.length - 1];
      const distance = calculateDistance(
        currentLatLng.lat,
        currentLatLng.lng,
        endCoords?.latitude,
        endCoords?.longitude
      ); // Implement distance calculation function
      console.log("end distance", distance);
      setShowEndBtn(distance < 0.09); // Adjust the threshold based on your needs (in meters)
      if (distance < 0.09 && canJobEndJob && isJobStared) {
        console.log("- - - - - - - fire socket event - - - - - -");
        socket.emit(socketEvent.REACHED_DESTINATION, {
          seller_id: sellerId,
          item_id: package_details_id,
          token: authToken,
        });
      }
    }
  }, [currentLatLng, coords, canJobEndJob]);

  const onPressStartJob = async () => {
    setJobType("start");
    setVisibleCodeVerification(true);
    // try {
    //   const result = await dispatch(
    //     approveRejectMoverRequeste({
    //       package_details_id: Number(package_details_id),
    //       status: "startjob",
    //     })
    //   );
    //   if (approveRejectMoverRequeste.fulfilled.match(result)) {
    //     if (result.payload.status == 1) {
    //       console.log("data Start job --->", result.payload);
    //       setCanEndJob(true);
    //       setIsJobStarted(true);
    //     }
    //   } else {
    //     console.log("errror Start job --->", result.payload);
    //   }
    // } catch (error) {
    //   console.log("catch err", error);
    // }
  };
  const onStartJob = () => {
    mapRef.current?.animateToRegion({
      latitude: currentLatLng.lat,
      longitude: currentLatLng.lng,
      latitudeDelta: 0.007,
      longitudeDelta: 0.007,
    });
    setShowStartBtn(false);
    setCanEndJob(true);
    setIsJobStarted(true);
  };

  const onPressMessage = () => {
    navigation.navigate(Route.navChatroom, {
      receiver_id: buyerSellerId,
      product_id: product_id,
    });
  };

  return (
    <View style={style.scrollCont}>
      <StatusBar
        backgroundColor={theme.colors?.primary}
        barStyle={"light-content"}
      />
      {/* {loader && <Loading />} */}

      <CustomHeader
        title="Package Tracking"
        textColor={theme?.colors?.white}
        backgroundColor={theme?.colors?.primary}
        rightView={
          <TouchableOpacity
            onPress={onPressMessage}
            activeOpacity={0.8}
            hitSlop={HIT_SLOP2}
          >
            <ChatFillIcon color={theme.colors?.white} height={28} width={28} />
          </TouchableOpacity>
        }
      />

      <View style={style.mapCont}>
        {currentLatLng.lat !== 0 ? (
          <MapView
            ref={mapRef}
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            initialRegion={{
              latitude: currentLatLng.lat,
              longitude: currentLatLng.lng,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
          >
            <Marker
              title="Yor are here"
              description=""
              tracksViewChanges={false}
              coordinate={{
                latitude: currentLatLng.lat,
                longitude: currentLatLng.lng,
              }}
            >
              {/* <BikeIcon /> */}

              <View
                style={{
                  height: Scale(30),
                  width: Scale(30),
                  borderRadius: Scale(30 / 2),
                  backgroundColor: "rgba(40, 40, 40, 0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1111,
                }}
              >
                <View
                  style={{
                    height: Scale(15),
                    width: Scale(15),
                    borderRadius: Scale(15 / 2),
                    backgroundColor: theme.colors?.blue,
                  }}
                />
              </View>
            </Marker>
            {/* finally, render the Polyline component with the coords data */}
            {stopFetchingLocation && (
              <>
                {coords?.length > 0 && (
                  <>
                    <Polyline
                      coordinates={coords}
                      strokeWidth={6}
                      strokeColor="#FFBE15"
                    />
                    <Marker
                      tracksViewChanges={false}
                      coordinate={coords[coords.length - 1]}
                      style={{ zIndex: 11 }}
                    >
                      <ProductLocation color="#67C2C9" />
                    </Marker>
                    <Marker
                      tracksViewChanges={false}
                      hitSlop={HIT_SLOP}
                      coordinate={coords[0]}
                    >
                      {
                        <View style={style.locationIconCont}>
                          <ProductLocation color="#FFBE15" />
                        </View>
                      }
                    </Marker>
                  </>
                )}
              </>
            )}
          </MapView>
        ) : (
          <Loading />
        )}
      </View>
      <View style={style.box}>
        <DropShadow style={style.shadow}>
          {showStartBtn && !canJobEndJob && (
            <TouchableOpacity
              onPress={onPressStartJob}
              activeOpacity={0.8}
              style={[
                style.btnPickup,
                {
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              {loading === LoadingState.CREATE ? (
                <ActivityIndicator color={theme.colors?.white} />
              ) : (
                <Text style={style.txtBtn}>Start Job</Text>
              )}
            </TouchableOpacity>
          )}
          {showEndBtn && canJobEndJob && (
            <TouchableOpacity
              onPress={onPressEndJob}
              activeOpacity={0.8}
              style={[
                style.btnPickup,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors?.pinkDark,
                },
              ]}
            >
              <Text style={style.txtBtn}>End Job</Text>
            </TouchableOpacity>
          )}
        </DropShadow>
      </View>
      <DeliveryCodeVerificationPopup
        visiblePopup={visibleCodeVerification}
        togglePopup={toggleDevliveryCodePopup}
        onStartJob={onStartJob}
        package_details_id={package_details_id}
        goBack={goBack}
        jobType={jobType}
        isLoading={loading === LoadingState.CREATE}
      />
    </View>
  );
};

export default PackageDetails;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  scrollCont: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
  },
  headerCont: {
    backgroundColor: theme.colors?.primary,

    height: Platform.OS === "ios" ? Scale(120) : Scale(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  txtPackageDetails: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
  mapCont: {
    flex: 1,
  },
  txtMarkerTitle: {
    fontSize: theme.fontSize?.fs10,
    color: theme.colors?.white,
    backgroundColor: "#67C2C9",
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: theme.fontFamily?.medium,
    overflow: "hidden",
  },
  locationIconCont: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  box: {
    position: "absolute",
    bottom: props.insets.bottom + 30,
    width: "100%",
  },
  btnPickup: {
    height: Scale(50),
    backgroundColor: theme.colors?.primary,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "90%",
  },
  txtBtn: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
  shadow: {
    shadowColor: theme.colors?.blackTrans,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // height: Scale(140),
  },
}));
