import React from "react";
import { Text, TouchableOpacity } from "react-native";
import CountryPicker, {
  CountryCode,
  TranslationLanguageCodeMap,
} from "react-native-country-picker-modal";
import { makeStyles, useTheme } from "react-native-elements";
import Scale from "../../utils/Scale";

interface CountryPickerModalProps {
  countryCode: string | CountryCode;
  onSelect: (
    country: string | TranslationLanguageCodeMap,
    cc2: CountryCode
  ) => void;
  onPressCountryPicker: () => void;
  onClosePickerModal: () => void;
  country: string | TranslationLanguageCodeMap;
  visible: boolean;
}

const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  countryCode,
  onSelect,
  onPressCountryPicker,
  onClosePickerModal,
  country,
  visible,
}) => {
  const { theme } = useTheme();
  const style = useStyle();
  return (
    <CountryPicker
      containerButtonStyle={[style.container]}
      countryCode={countryCode as CountryCode}
      onSelect={(country) => onSelect(country?.name, country.cca2)}
      withCountryNameButton={true}
      withCloseButton={true}
      withFilter={true}
      withCallingCode={true}
      renderFlagButton={({ placeholder, containerButtonStyle }) => (
        <TouchableOpacity
          activeOpacity={0.6}
          style={containerButtonStyle}
          onPress={onPressCountryPicker}
        >
          {country ? (
            <Text style={[style.txtCountry]}>{country as string}</Text>
          ) : (
            <Text
              style={[style.txtCountry, { color: theme.colors?.secondaryText }]}
            >
              {placeholder}
            </Text>
          )}
        </TouchableOpacity>
      )}
      onClose={onClosePickerModal}
      visible={visible}
    />
  );
};

export default CountryPickerModal;

const useStyle = makeStyles((theme) => ({
  container: {
    height: Scale(0),
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  txtCountry: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
    marginLeft: 10,
  },
}));
