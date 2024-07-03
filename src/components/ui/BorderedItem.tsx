import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RightIcon from './svg/RightIcon';
import {ThemeProps} from '../../types/global.types';
import Scale from '../../utils/Scale';
import LockIcon from './svg/LockIcon';

interface BorderedItemProps {
  title: string;
  onPressItem: () => void;
}

const BorderedItem: React.FC<BorderedItemProps> = ({title, onPressItem}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPressItem}
      activeOpacity={0.8}
      style={style.cont}>
      <View style={style.iconCont}>
        <LockIcon
          color={theme?.colors?.primary}
          style={{marginRight: 10}}
          height={20}
          width={20}
        />
        <Text style={style.txtChangePassword}>{title}</Text>
      </View>
      <RightIcon color={'#B8B5B5'} />
    </TouchableOpacity>
  );
};

export default BorderedItem;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  txtChangePassword: {
    fontSize: theme.fontSize?.fs15,
    lineHeight: 20,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
  },
  cont: {
    height: Scale(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: theme.colors?.border,
    borderTopColor: theme.colors?.border,
    marginTop: 20,
  },
  iconCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
