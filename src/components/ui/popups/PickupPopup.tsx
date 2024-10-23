import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FullTheme, makeStyles, useTheme } from "react-native-elements";

import { CommonActions, useNavigation } from "@react-navigation/native";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import Scale from "../../../utils/Scale";
import { AppImage } from "../../AppImage/AppImage";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { orderDetails } from "../../../store/MoverBooking/moverBooking.thunk";
import { DeliveryDetailsData } from "../../../types/delivery.types";
import { ASPECT_RATIO, GOOGLE_MAP_API_KEY, RWF } from "../../../constant";
import { Route } from "../../../constant/navigationConstants";
import { Images } from "../../../assets/images";
import CustomHeader from "../CustomHeader";
import BorderBottomItem from "../../DeliveryDetails/BorderBottomItem";
import ProductLocation from "../svg/ProductLocation";
import CustomButton from "../CustomButton";
import ChatIcon from "../svg/ChatIcon";
import Geolocation from "react-native-geolocation-service";
import { setErrors } from "../../../store/global/global.slice";
import { notifyMessage } from "../../../utils/notifyMessage";
import NavigationIcon from "../svg/NavigationIcon";

interface PickupPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onPressConfirmPickup: () => void;
  onPressReject: () => void;
  selectedItem: any;
  loading: LoadingState;
}

let interval: string | number | NodeJS.Timeout | undefined;
const PickupPopup: React.FC<PickupPopupProps> = ({
  visiblePopup,
  togglePopup,
  onPressConfirmPickup,
  onPressReject,
  selectedItem,
  loading,
}) => {
  const insets = useSafeAreaInsets();

  const style = useStyle({ insets });
  const { theme } = useTheme();

  const navigation = useNavigation();

  const mapRef = useRef<MapView>(null);
  const dispatch = useAppDispatch();

  const [distance, setDistance] = useState<string>("");
  const [currentToPickupDistance, setCurrentToPickupDistance] =
    useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [distanceLoader, setDistanceLoader] = useState<boolean>(false);
  const [deliveryDetailsData, setDeliveryDetailsData] =
    useState<DeliveryDetailsData>({});
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [distanceForPickup, setDistanceForPickup] = useState("");

  const pickup_point_lat = parseFloat(selectedItem?.pickup_point_lat) || 0;
  const pickup_point_lng = parseFloat(selectedItem?.pickup_point_lng) || 0;

  const delivery_point_lat = parseFloat(selectedItem?.delivery_point_lat) || 0;
  const delivery_point_lng = parseFloat(selectedItem?.delivery_point_lng) || 0;

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
    getPackageDetails();
  }, [selectedItem]);

  useEffect(() => {
    let distance = calculateDistance(
      pickup_point_lat,
      pickup_point_lng,
      delivery_point_lat,
      delivery_point_lng
    );
    setDistance(`${distance.toFixed(2)}`);
  }, [
    pickup_point_lat,
    pickup_point_lng,
    delivery_point_lat,
    delivery_point_lng,
  ]);

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
    setDistanceLoader(true);
    if (locationEnabled) {
      Geolocation.getCurrentPosition(
        (position) => {
          const currentLatitude = position.coords.latitude;
          const currentLongitude = position.coords.longitude;
          let startLoc = `${currentLatitude},${currentLongitude}`;
          let destinationLoc = `${pickup_point_lat},${pickup_point_lng}`;
          let distance = calculateDistance(
            currentLatitude,
            currentLongitude,
            pickup_point_lat,
            pickup_point_lng
          );
          setCurrentToPickupDistance(`${distance.toFixed(2)}`);
          if (
            currentLatitude !== 0 &&
            currentLongitude !== 0 &&
            pickup_point_lat !== 0 &&
            pickup_point_lng !== 0
          ) {
            console.log("startLoc", startLoc);
            console.log("destinationLoc", destinationLoc);
            fetch(
              `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_MAP_API_KEY}`
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.routes && data.routes.length > 0) {
                  const route = data.routes[0];
                  const eta = route.legs[0].duration.text;
                  eta && setDistanceForPickup(eta);
                  setDistanceLoader(false);
                } else {
                  setDistanceLoader(false);
                }
              })
              .catch((error) => {
                setDistanceLoader(false);
                console.error("Error:", error);
              });
          }
        },
        (error) => {
          setDistanceLoader(false);
          console.log("error", error);
        }
        // Update at least every 2 seconds
      );
    }
  }, [locationEnabled, pickup_point_lat, pickup_point_lng]);

  const getPackageDetails = async () => {
    setLoader(true);
    try {
      const result = await dispatch(
        orderDetails({
          package_details_id: selectedItem?.id,
        })
      );
      if (orderDetails.fulfilled.match(result)) {
        if (result.payload.status == 1) {
          setDeliveryDetailsData(result.payload.data);
          setLoader(false);
        }
      } else {
        if (result.payload?.status == 0) {
          setDeliveryDetailsData({});
          setLoader(false);
          togglePopup();
          notifyMessage("Package is no longer available");
        }
        console.log("errror orderDetails --->", result.payload);
      }
    } catch (error) {
      setLoader(false);
      console.log("catch errror orderDetails --->", error);
    }
  };

  const getDirections = async (startLoc: string, destinationLoc: string) => {
    try {
      const KEY = GOOGLE_MAP_API_KEY; //put your API key here.
      //otherwise, you'll have an 'unauthorized' error.
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
      );
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      return coords;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (selectedItem) {
      // fetch the coordinates and then store its value into the coords Hook.

      getDirections(
        `${pickup_point_lat},${pickup_point_lng}`,
        `${delivery_point_lat},${delivery_point_lng}`
      )
        .then((coords) => {
          setCoords(coords);
          let r = {
            latitude: pickup_point_lat,
            longitude: pickup_point_lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          mapRef.current?.animateToRegion(r, 1000);
        })
        .catch((err) => console.log("Something went wrong"));
    }
  }, [selectedItem]);

  const getRouteImage = async (
    originLat: number,
    originLng: number,
    destinationLat: number,
    destinationLng: number,
    googleMapApiKey: string
  ) => {
    try {
      // Clear route image initially
      let routeImage = "";

      // Construct and fetch directions API request
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?destination=${destinationLat},${destinationLng}&origin=${originLat},${originLng}&key=${googleMapApiKey}`;
      const response = await fetch(directionsUrl);

      if (response.ok) {
        const directionsData = await response.json();

        if (directionsData.routes && directionsData.routes.length > 0) {
          const firstRoute = directionsData.routes[0];
          const overviewPolyline = firstRoute.overview_polyline;

          if (overviewPolyline && overviewPolyline.points) {
            // Generate static map image URL
            const polyLineId = overviewPolyline.points;
            const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=400x200&path=weight:3|color:0x67C2C9FF|enc:${polyLineId}&key=${googleMapApiKey}`;

            routeImage = staticMapUrl;
          }
        }
      }

      return routeImage;
    } catch (error) {
      console.error("Error fetching route image:", error);
      return ""; // Or handle the error differently (e.g., display an error message)
    }
  };

  const onPressMessage = () => {
    // need to get buyer-seller id for chat.
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          {
            name: Route.navDashboard,
          },
          {
            name: Route.navMessaging,
          },
          {
            name: Route.navChatroom,
            params: { receiver_id: selectedItem?.userid },
          },
        ],
      })
    );
  };

  const profile = selectedItem?.profile_image || Images.PLACEHOLDER_IMAGE;

  const isReachedDestination = selectedItem?.status === "completed";
  const isConfirmed = selectedItem?.status === "confirmed";
  const isJobStarted = selectedItem?.status === "startjob";
  const isPending = selectedItem?.status === "pending";

  const northeastLat = parseFloat("24.259769");
  const southwestLat = parseFloat("24.234631");
  const latDelta = northeastLat - southwestLat;
  const lngDelta = latDelta * ASPECT_RATIO;

  const getColorFromStatus = (status: string, theme: Partial<FullTheme>) => {
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
      : "";
  };

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
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      style={style.modalCont}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
    >
      <View style={style.container}>
        <View style={style.innerCont}>
          <CustomHeader
            title="Pickup now"
            isOutsideBack={true}
            onPressBackBtn={() => {
              clearInterval(interval);
              togglePopup();
            }}
          />
          {/* <View style={style.topCont}>
            <Text style={style.txtPickupNow}>Pickup now</Text>
          </View> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          >
            <View style={style.headerNameCont}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AppImage
                  source={profile}
                  style={style.profile}
                  resizeMode="cover"
                />
                <Text style={style.txtName}>{selectedItem?.username}</Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Text style={style.txtPrice}>
                  {RWF} {Number(selectedItem?.price).toFixed(2)}
                </Text>
              </View>
            </View>
            {loader ? (
              <ActivityIndicator color={theme.colors?.primary} />
            ) : (
              <View style={{ flex: 1, marginTop: 10, paddingHorizontal: 20 }}>
                <BorderBottomItem
                  title="Receiver"
                  value={deliveryDetailsData?.receiver_name}
                  from_mover={false}
                />
                {/* <BorderBottomItem
                  title="Item name"
                  value={deliveryDetailsData?.item_name}
                  from_mover={false}
                /> */}
                <BorderBottomItem
                  title="Pickup point"
                  value={deliveryDetailsData?.pickup_point_address}
                  from_mover={false}
                  numberOfLines={3}
                />
                <BorderBottomItem
                  title="Delivery point"
                  value={deliveryDetailsData?.delivery_point_address}
                  from_mover={false}
                  numberOfLines={3}
                />
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
                {distance !== "" && (
                  <BorderBottomItem
                    title="Distance"
                    value={`${distance} KM`}
                    from_mover={false}
                  />
                )}
                {distanceLoader ? (
                  <ActivityIndicator color={theme?.colors?.primary} />
                ) : (
                  distanceForPickup !== "" && (
                    <BorderBottomItem
                      title="Distance for pickup location"
                      value={distanceForPickup}
                      from_mover={false}
                    />
                  )
                )}
                <BorderBottomItem
                  title="Price"
                  value={`${RWF} ${
                    Number(selectedItem?.price).toFixed(2) || ""
                  }`}
                  from_mover={false}
                />

                <BorderBottomItem
                  title="Status"
                  value={getStatusStrings(deliveryDetailsData?.status)}
                  from_mover={false}
                  txtColor={getColorFromStatus(
                    deliveryDetailsData?.status,
                    theme
                  )}
                />
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
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
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
              </View>
            )}
            {/* <View style={style.editCont}>
              <EditIcon color={theme?.colors?.primaryText} />
              <Text style={style.txtProductType}>
                {selectedItem?.item_name}
              </Text>
            </View> */}
            <View style={style.mapCont}>
              {pickup_point_lat && pickup_point_lng && coords?.length > 0 && (
                <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  region={{
                    latitude: pickup_point_lat || 0,
                    longitude: pickup_point_lng || 0,
                    latitudeDelta: latDelta,
                    longitudeDelta: lngDelta,
                  }}
                >
                  {/* finally, render the Polyline component with the coords data */}
                  {coords?.length > 0 && (
                    <Polyline
                      coordinates={coords}
                      strokeWidth={3}
                      strokeColor="#67C2C9"
                    />
                  )}
                  <Marker tracksViewChanges={false} coordinate={coords[0]}>
                    <ProductLocation color="#FFBE15" />
                  </Marker>
                  <Marker
                    tracksViewChanges={false}
                    coordinate={coords[coords.length - 1]}
                  >
                    <ProductLocation color="#67C2C9" />
                  </Marker>
                </MapView>
              )}
            </View>
            {/* <PickupDeliveryCont
              pickupAddress={selectedItem?.pickup_point_address}
              deliveryAddress={selectedItem?.delivery_point_address}
            /> */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 50,
                marginTop: 10,
              }}
            >
              <CustomButton
                disabled={isPending}
                onPress={onPressMessage}
                title={"Chat with client"}
                buttonWidth="half"
                type="clear"
                variant="secondary"
                icon={
                  <ChatIcon
                    height={18}
                    width={18}
                    color={
                      isPending
                        ? theme.colors?.textSecondary
                        : theme.colors?.primary
                    }
                    style={{ marginRight: 5 }}
                  />
                }
                containerStyle={[
                  style.btnMessage,
                  {
                    borderColor: isPending
                      ? theme.colors?.textSecondary
                      : theme.colors?.primary,
                  },
                ]}
                titleStyle={[
                  style.txtTitleStyle,
                  {
                    color: isPending
                      ? theme.colors?.textSecondary
                      : theme.colors?.primary,
                  },
                ]}
              />
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 100,
              }}
            >
              {!isConfirmed ? (
                <Text style={style.txtdesc}>
                  You will be able to contact customer once you Accept this job
                </Text>
              ) : (
                <Text style={style.txtdesc}>You can chat with your client</Text>
              )}
            </View>
            <>
              {!isConfirmed && (
                <TouchableOpacity
                  onPress={onPressConfirmPickup}
                  activeOpacity={0.8}
                  style={[style.btnPickup]}
                >
                  <Text style={[style.txtBtn]}>{"Accept this job"}</Text>
                  <Text style={[style.txtBtn]}>
                    {RWF} {Number(selectedItem?.price).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
              {!isConfirmed && (
                <TouchableOpacity
                  onPress={onPressReject}
                  activeOpacity={0.8}
                  style={[
                    style.btnPickup,
                    {
                      backgroundColor: theme.colors?.pinkDark,
                      marginBottom: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  {loading === LoadingState.CREATE ? (
                    <ActivityIndicator color={theme.colors?.white} />
                  ) : (
                    <Text style={style.txtBtn}>Reject</Text>
                  )}
                </TouchableOpacity>
              )}
            </>

            {/* <>
                <TouchableOpacity
                  disabled={isJobStarted}
                  onPress={onPressStartJob}
                  activeOpacity={0.8}
                  style={[
                    style.btnPickup,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isJobStarted
                        ? theme.colors?.disabled
                        : theme.colors?.primary,
                    },
                  ]}
                >
                  {loading === LoadingState.CREATE ? (
                    <ActivityIndicator color={theme.colors?.white} />
                  ) : (
                    <Text
                      style={[
                        style.txtBtn,
                        {
                          color: isJobStarted
                            ? theme.colors?.textSecondary
                            : theme.colors?.white,
                        },
                      ]}
                    >
                      {isJobStarted ? "Job Started" : "Start Job"}
                    </Text>
                  )}
                </TouchableOpacity>
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
              </> */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PickupPopup;

const useStyle = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.white,
    paddingTop: props.insets.top,
    paddingBottom: props.insets.bottom,
  },
  innerCont: {
    flex: 1,
    backgroundColor: theme.colors?.white,
    borderTopLeftRadius: Scale(8),
    borderTopRightRadius: Scale(8),
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  topCont: {
    height: Scale(35),
    borderTopLeftRadius: Scale(8),
    borderTopRightRadius: Scale(8),
    backgroundColor: theme.colors?.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  txtPickupNow: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
  headerNameCont: {
    height: Scale(67),
    borderBottomColor: theme.colors?.borderButtonColor,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  profile: {
    height: Scale(32),
    width: Scale(32),
    borderRadius: Scale(32),
    borderColor: theme.colors?.borderButtonColor,
    borderWidth: 1,
  },
  txtName: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primaryText,
    marginLeft: 10,
  },
  txtPrice: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.primaryText,
  },
  txtcod: {
    fontSize: theme.fontSize?.fs10,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
  },
  editCont: {
    height: Scale(40),
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  txtProductType: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginLeft: 10,
  },
  mapCont: {
    height: Scale(150),
    width: "100%",
  },
  map: {
    height: Scale(200),
    width: "100%",
  },
  btnMessage: {
    backgroundColor: theme.colors?.white,
    width: "100%",
    height: Scale(40),
    borderRadius: 8,
    borderColor: theme.colors?.primary,
    borderWidth: 1,
    justifyContent: "center",
  },
  btnContMessage: {
    backgroundColor: theme.colors?.white,
    width: "100%",
    height: Scale(42),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  txtTitleStyle: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
  },
  txtdesc: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
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
  },
  txtBtn: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
}));
