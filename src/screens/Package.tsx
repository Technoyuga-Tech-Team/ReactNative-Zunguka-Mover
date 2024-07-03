import {View, Text} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {makeStyles, useTheme} from 'react-native-elements';
import {ThemeProps} from '../types/global.types';

const Package = () => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  return (
    <View style={style.container}>
      <Text>Package</Text>
    </View>
  );
};

export default Package;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
  },
}));
