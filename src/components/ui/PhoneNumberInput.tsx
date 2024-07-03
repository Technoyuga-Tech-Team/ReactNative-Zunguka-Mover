import React from 'react';
import {Text, TextInputProps, TouchableOpacity, View} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import ReactNativePhoneInput from 'react-native-phone-input';
import {AppImage} from '../AppImage/AppImage';
import Scale from '../../utils/Scale';
import DownArrowIcon from './svg/DownArrowIcon';

interface CustomPhoneNumberInputProps {
  onPressFlag: () => void;
  onChangePhoneNumber: (value: string, iso2: string) => void;
  textInputTitle: string;
  textProps: TextInputProps;
  error?: string;
  initialValue: string;
  activeCountryCode?: string;
}

export const PhoneNumberInput = React.forwardRef<
  ReactNativePhoneInput,
  CustomPhoneNumberInputProps
>(({...props}, ref) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const DEFAULT_FLAG_CODE = 200; // RAWANDA default flag code
  return (
    <View style={styles.textInCont}>
      {/* {props.textInputTitle && (
        <Text style={styles.txtTextInputTitle}>{props.textInputTitle}</Text>
      )} */}
      <ReactNativePhoneInput
        ref={ref}
        initialCountry={'rw'}
        autoFormat
        renderFlag={({imageSource}) => {
          return (
            <TouchableOpacity
              onPress={props.onPressFlag}
              style={styles.flagCont}>
              <AppImage
                source={imageSource || DEFAULT_FLAG_CODE}
                style={{height: Scale(15), width: Scale(22)}}
                resizeMode="cover"
              />
              <DownArrowIcon
                color={theme.colors?.iconColor}
                height={Scale(12)}
                width={Scale(12)}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          );
        }}
        style={styles.txtInCont}
        {...props}
      />
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
});

export const useStyles = makeStyles(theme => ({
  textInCont: {
    marginVertical: 10,
  },
  txtInCont: {
    height: Scale(53),
    justifyContent: 'center',
    backgroundColor: theme?.colors?.transparent,
    borderRadius: 8,
    paddingHorizontal: theme.spacing?.fs16,
    borderWidth: 1,
    borderColor: theme?.colors?.textSecondary,
  },
  txtInStyle: {
    flex: 1,
    height: Scale(50),
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs16,
  },
  flagCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  txtTextInputTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.iconColor,
    marginBottom: 5,
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.error,
  },
  txtCountrycode: {
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs16,
    marginLeft: 10,
  },
}));
