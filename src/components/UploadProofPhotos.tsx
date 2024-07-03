import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {makeStyles} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-elements';
import {ThemeProps} from '../types/global.types';
import PaperclipIcon from './ui/svg/PaperclipIcon';

interface UploadProofPhotosProps {
  title: string;
  onPressUploadImages: () => void;
}

const UploadProofPhotos: React.FC<UploadProofPhotosProps> = ({
  title,
  onPressUploadImages,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  return (
    <View>
      <Text style={style.txtTitle}>{title}</Text>
      <TouchableOpacity
        onPress={onPressUploadImages}
        activeOpacity={0.8}
        style={style.uploadCont}>
        <PaperclipIcon />
        <Text style={style.txtUploadImg}>Upload Images</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadProofPhotos;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  txtTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.primaryText,
  },
  uploadCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: '#706E6E',
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  txtUploadImg: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginLeft: 8,
  },
}));
