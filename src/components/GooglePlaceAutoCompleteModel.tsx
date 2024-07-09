import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { CountryCode } from "react-native-country-picker-modal";
import { makeStyles, useTheme } from "react-native-elements";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../types/global.types";
import Scale from "../utils/Scale";
import BackIcon from "./ui/svg/BackIcon";
import { GOOGLE_MAP_API_KEY } from "../constant";

navigator.geolocation = require("react-native-geolocation-service");
interface GooglePlaceAutoCompleteModalProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onPressAddress: (data: GooglePlaceData, details: GooglePlaceDetail) => void;
  countryCode: CountryCode;
}

const GooglePlaceAutoCompleteModal: React.FC<
  GooglePlaceAutoCompleteModalProps
> = ({ visiblePopup, togglePopup, onPressAddress, countryCode }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const style = useStyle({ insets });

  const textinRef = React.useRef<GooglePlacesAutocompleteRef>(null);

  const [focuseKeyboard, setFocuseKeyboard] = useState(false);

  useEffect(() => {
    textinRef.current?.focus();
    setFocuseKeyboard(true);
  }, []);

  const country_ = countryCode.toLocaleLowerCase() ?? "RW";

  return (
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      onDismiss={togglePopup}
      style={style.modalCont}
      animationType="slide"
    >
      <View style={style.container}>
        <View>
          <TouchableOpacity onPress={togglePopup} style={style.backButtonCont}>
            <BackIcon color={theme.colors?.black} />
          </TouchableOpacity>
          <Text style={style.txtTitle}>Location</Text>
        </View>

        <GooglePlacesAutocomplete
          ref={textinRef}
          placeholder={"Search and select address here..."}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          nearbyPlacesAPI="GoogleReverseGeocoding"
          fetchDetails={true}
          onPress={(data, details) => {
            onPressAddress(data, details);
          }}
          query={{
            key: GOOGLE_MAP_API_KEY,
            language: "en",
            components: `country:${country_}`,
          }}
          autoFillOnNotFound={true}
          currentLocation={true}
          currentLocationLabel="Current location"
          onFail={(error) => console.log("error", error)}
          textInputProps={{
            autoFocus: focuseKeyboard,
            placeholderTextColor: theme.colors?.iconColor,
          }}
          styles={{
            textInputContainer: style.googlePlaceAutoCompleteCont,
            textInput: style.textIn,
            predefinedPlacesDescription: style.predefinedPlacesDescription,
            description: { color: theme.colors?.iconColor },
          }}
        />
      </View>
    </Modal>
  );
};

export default GooglePlaceAutoCompleteModal;

const useStyle = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.white,
    paddingTop: props.insets.top,
    paddingRight: 20,
    paddingLeft: 10,
    justifyContent: "center",
  },
  modalCont: {
    backgroundColor: theme.colors?.white,
  },
  googlePlaceAutoCompleteCont: {
    borderRadius: Scale(8),
    height: Scale(50),
    paddingLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    backgroundColor: theme.colors?.transparent,
    borderColor: theme?.colors?.border,
    borderWidth: 1,
  },
  textIn: {
    height: Scale(45),
    color: theme.colors?.textPrimary,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    backgroundColor: theme.colors?.transparent,
  },
  predefinedPlacesDescription: {
    color: theme.colors?.primary,
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
  },
  backButtonCont: {
    height: Scale(50),
    width: Scale(50),
    alignItems: "center",
    justifyContent: "center",
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
    position: "absolute",
    alignSelf: "center",
    bottom: Scale(12),
  },
}));