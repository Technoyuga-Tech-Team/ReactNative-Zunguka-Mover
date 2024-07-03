import React from 'react';
import {Platform, Text, View} from 'react-native';
import {CheckBox, makeStyles, useTheme} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Scale from '../../utils/Scale';
import {ThemeProps} from '../../types/global.types';
import CheckIcon from './svg/CheckIcon';
import SquareCheckIcon from './svg/SquareCheckIcon';

interface TermsAndConditionProps {
  checked: boolean;
  toggleCheckbox: () => void;
  onPressTermsAndCondition: () => void;
}

const TermsAndCondition: React.FC<TermsAndConditionProps> = ({
  checked,
  toggleCheckbox,
  onPressTermsAndCondition,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  return (
    <View style={style.tcContainer}>
      <CheckBox
        checked={checked}
        onPress={toggleCheckbox}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        checkedIcon={
          <CheckIcon
            color={theme.colors?.primary}
            height={Scale(18)}
            width={Scale(18)}
          />
        }
        uncheckedIcon={
          <SquareCheckIcon
            color={theme.colors?.iconColor}
            height={Scale(18)}
            width={Scale(18)}
          />
        }
        containerStyle={{
          padding: 0,
        }}
      />
      <Text onPress={toggleCheckbox} style={style.txtTC}>
        I agree with the{' '}
        <Text onPress={onPressTermsAndCondition} style={style.txtTC1}>
          Terms & Conditions
        </Text>
      </Text>
    </View>
  );
};

export default TermsAndCondition;
const useStyles = makeStyles((theme, props: ThemeProps) => ({
  txtTC: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: '#777986',
    marginBottom: Platform.OS === 'ios' ? 0 : 3,
  },
  txtTC1: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: '#212121',
  },
  tcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
}));
