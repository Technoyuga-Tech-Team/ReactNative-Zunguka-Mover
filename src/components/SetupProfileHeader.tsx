import {View, Text} from 'react-native';
import React from 'react';
import {makeStyles, useTheme} from 'react-native-elements';
import {ThemeProps} from '../types/global.types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Scale from '../utils/Scale';
import * as Progress from 'react-native-progress';
import CircleWithRightIcon from './ui/svg/CircleWithRightIcon';
import {SCREEN_WIDTH} from '../constant';
interface SetupProfileHeaderProps {
  title: string;
  percent: number;
}

const SetupProfileHeader: React.FC<SetupProfileHeaderProps> = ({
  title,
  percent,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({insets});
  const {theme} = useTheme();
  return (
    <View style={style.container}>
      <Text style={style.txtInfo}>Add More Information</Text>
      <Text style={style.txtTitle}>{title}</Text>
      <View style={style.progressCont}>
        <CircleWithRightIcon color={theme.colors?.primary} />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 5,
            }}>
            <Text style={style.txtPercents}>{percent * 10}%</Text>
            <Text style={style.txtCompleted}>Completed</Text>
          </View>
          <View style={{alignItems: 'center', marginLeft: 5, marginTop: 5}}>
            <Progress.Bar
              progress={percent / 10}
              width={SCREEN_WIDTH - 120}
              borderColor={theme.colors?.primary}
              color={theme.colors?.primary}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SetupProfileHeader;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  txtInfo: {
    fontSize: theme.fontSize?.fs22,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    marginTop: 5,
  },
  progressCont: {
    borderRadius: 8,
    borderColor: theme.colors?.primary,
    borderWidth: 1,
    width: '90%',
    height: Scale(80),
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  txtPercents: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
  txtCompleted: {
    fontSize: theme.fontSize?.fs11,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginLeft: 8,
  },
}));
