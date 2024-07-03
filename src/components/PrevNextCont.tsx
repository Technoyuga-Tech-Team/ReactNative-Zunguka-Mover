import React from 'react';
import {Platform, View} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HAS_NOTCH} from '../constant';
import {ThemeProps} from '../types/global.types';
import Scale from '../utils/Scale';
import CustomButton from './ui/CustomButton';

interface PrevNextContProps {
  onPressPrev: () => void;
  onPressNext: () => void;
  onPressSkip?: () => void;
  isDisable?: boolean;
  isSkipEnabled?: boolean;
}

const PrevNextCont: React.FC<PrevNextContProps> = ({
  onPressPrev,
  onPressNext,
  onPressSkip,
  isDisable,
  isSkipEnabled = false,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  return (
    <View style={style.container}>
      <CustomButton
        disabled={isDisable}
        onPress={onPressPrev}
        title={'Previous'}
        buttonWidth="half"
        variant="secondary"
        type="outline"
      />
      <CustomButton
        onPress={onPressNext}
        title={'Next'}
        buttonWidth="half"
        variant="primary"
        type="solid"
      />
      {/* <TouchableOpacity
        disabled={isDisable}
        onPress={onPressPrev}
        activeOpacity={0.8}
        hitSlop={HIT_SLOP2}>
        <Text
          style={[
            style.txtPrev,
            {
              color: isDisable
                ? theme.colors?.lightGrey
                : theme.colors?.primary,
            },
          ]}>
          Previous
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressNext}
        activeOpacity={0.8}
        style={style.btnCont}>
        <Text style={style.txtNext}>Next</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PrevNextCont;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    paddingBottom:
      Platform.OS === 'ios'
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtPrev: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.lightGrey,
    textDecorationLine: 'underline',
  },
  txtNext: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
  btnCont: {
    height: Scale(40),
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors?.primary,
    borderRadius: 4,
  },
  btnOutlineCont: {
    height: Scale(40),
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors?.transparent,
    borderWidth: 1,
    borderColor: theme?.colors?.primary,
    borderRadius: 4,
    marginRight: 5,
  },
}));
