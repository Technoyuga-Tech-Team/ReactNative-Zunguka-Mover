import React from 'react';
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {makeStyles} from 'react-native-elements';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomButton from './CustomButton';
import {HAS_NOTCH, HIT_SLOP, SCREEN_WIDTH} from '../../constant';
import {ThemeProps} from '../../types/global.types';
import Scale from '../../utils/Scale';

interface ImagePickerPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onPressFromGallary: () => void;
  onPressFromCamera: () => void;
}

const ImagePickerPopup: React.FC<ImagePickerPopupProps> = ({
  visiblePopup,
  togglePopup,
  onPressFromGallary,
  onPressFromCamera,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyle({insets});

  return (
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      style={style.modalCont}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}>
      <TouchableWithoutFeedback onPress={togglePopup}>
        <View style={style.container}>
          <View style={style.innerCont}>
            <Text style={style.txtLoginToAnypost}>Choose picture from</Text>
            <View style={style.buttonCont}>
              <CustomButton
                onPress={onPressFromGallary}
                title={'Gallary'}
                buttonWidth="full"
                variant="primary"
                type="solid"
                containerStyle={style.btnCont}
              />
            </View>
            <View style={style.buttonCont}>
              <CustomButton
                onPress={onPressFromCamera}
                title={'Camera'}
                buttonWidth="full"
                variant="primary"
                type="solid"
                containerStyle={style.btnCont}
              />
            </View>
            <TouchableOpacity
              onPress={togglePopup}
              activeOpacity={0.8}
              hitSlop={HIT_SLOP}>
              <Text style={style.txtLoginToAnypost1}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ImagePickerPopup;

const useStyle = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors?.overlay,
    paddingBottom:
      Platform.OS === 'ios'
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
  },
  modalCont: {
    backgroundColor: 'transparent',
  },
  innerCont: {
    height: 'auto',
    width: '90%',
    backgroundColor: theme.colors?.white,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  txtLoginToAnypost: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginTop: 10,
    marginBottom: 20,
  },
  txtLoginToAnypost1: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
    marginVertical: 20,
  },
  txtLoginToAnypostDesc: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    textAlign: 'center',
    color: theme.colors?.secondaryText,
    lineHeight: 20,
    marginTop: 10,
  },
  buttonCont: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonRightMargin: {
    marginRight: 10,
  },
  buttonLeftMargin: {
    marginLeft: 10,
  },
  iconCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCont: {
    height: Scale(50),
    width: SCREEN_WIDTH - 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Scale(4),
  },
}));
