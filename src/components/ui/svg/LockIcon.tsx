import * as React from 'react';
import Svg, {Rect, Circle, Path, SvgProps} from 'react-native-svg';

interface LockIconProps extends SvgProps {
  color?: string;
}
const LockIcon = ({color, ...props}: LockIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Rect
        width={16}
        height={14}
        x={4}
        y={7}
        stroke={color}
        strokeWidth={1.5}
        rx={4}
      />
      <Circle cx={12} cy={14} r={2} stroke={color} strokeWidth={1.5} />
      <Path stroke={color} strokeWidth={1.5} d="M16 7a4 4 0 0 0-8 0" />
    </Svg>
  );
};

export default React.memo(LockIcon);
