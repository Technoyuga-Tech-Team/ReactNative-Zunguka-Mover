import * as React from 'react';
import Svg, {G, Path, SvgProps} from 'react-native-svg';

interface LocationCrossIconProps extends SvgProps {
  color?: string;
}

const LocationCrossIcon = ({color, ...props}: LocationCrossIconProps) => {
  return (
    <Svg viewBox="0 0 16 16" width={16} height={16} fill="none" {...props}>
      <Path
        fill={color}
        d="M14 7.5h-1.36v.01a4.667 4.667 0 0 0-4.149-4.15H8.5V2c0-.273-.227-.5-.5-.5s-.5.227-.5.5v1.36h.009a4.667 4.667 0 0 0-4.15 4.15l.001-.01H2c-.273 0-.5.227-.5.5s.227.5.5.5h1.36v-.01a4.668 4.668 0 0 0 4.149 4.15H7.5V14c0 .273.227.5.5.5s.5-.227.5-.5v-1.36h-.009a4.667 4.667 0 0 0 4.15-4.15l-.001.01H14c.273 0 .5-.227.5-.5s-.227-.5-.5-.5ZM8 9.667a1.666 1.666 0 1 1 0-3.333 1.666 1.666 0 0 1 0 3.333Z"
      />
    </Svg>
  );
};

export default React.memo(LocationCrossIcon);
