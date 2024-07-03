import * as React from 'react';
import {Animated, useWindowDimensions, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import Scale from '../../utils/Scale';

type ColorVariant = 'primary' | 'secondary';

interface SliderProps {
  data: number[];
  scrollX: Animated.Value;
  variant?: ColorVariant;
}

const Paginator: React.FC<SliderProps> = ({data, scrollX, variant}) => {
  const styles = useStyles(variant);
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const doWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View key={i.toString()} style={[styles.dot, {opacity}]} />
        );
      })}
    </View>
  );
};

const useStyles = makeStyles((theme, variant: ColorVariant) => ({
  container: {
    flexDirection: 'row',
  },
  dot: {
    height: Scale(8),
    width: Scale(8),
    borderRadius: Scale(5),
    backgroundColor:
      variant === 'secondary' ? theme.colors?.primary : theme.colors?.white,
    marginHorizontal: 10,
  },
}));

export default Paginator;
