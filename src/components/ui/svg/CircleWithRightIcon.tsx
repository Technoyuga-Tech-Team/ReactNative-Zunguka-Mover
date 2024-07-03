import * as React from 'react';
import Svg, {Rect, Path, SvgProps} from 'react-native-svg';

interface CircleWithRightIconProps extends SvgProps {
  color?: string;
}

const CircleWithRightIcon = ({color, ...props}: CircleWithRightIconProps) => {
  return (
    <Svg viewBox="0 0 40 40" width={40} height={40} fill="none" {...props}>
      <Rect width={40} height={40} fill={color} rx={20} />
      <Path
        fill="#fff"
        d="M17.87 25.37c-.3 0-.585-.12-.795-.33l-4.245-4.245a1.132 1.132 0 0 1 0-1.59 1.132 1.132 0 0 1 1.59 0l3.45 3.45 7.71-7.71a1.132 1.132 0 0 1 1.59 0 1.132 1.132 0 0 1 0 1.59l-8.505 8.505c-.21.21-.495.33-.795.33Z"
      />
    </Svg>
  );
};

export default React.memo(CircleWithRightIcon);
