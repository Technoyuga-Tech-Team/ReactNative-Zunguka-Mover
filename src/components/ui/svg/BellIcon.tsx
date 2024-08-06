import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BellIconProps extends SvgProps {
  color: string | undefined;
}

const BellIcon = ({ color, ...props }: BellIconProps) => {
  return (
    <Svg viewBox="0 0 16 16" width={16} height={16} fill="none" {...props}>
      <Path
        fill={color}
        d="M9.443 13.168a.334.334 0 0 1-.002.334c-.304.52-.842.832-1.441.832a1.656 1.656 0 0 1-1.441-.832.334.334 0 0 1 .288-.502h2.306c.12 0 .23.064.29.168Zm4.151-1.376c-.013-.015-1.264-1.604-1.264-3.458V5.997A4.335 4.335 0 0 0 8 1.667a4.335 4.335 0 0 0-4.33 4.33v2.337c0 1.854-1.25 3.442-1.264 3.458a.334.334 0 0 0 .26.542h10.667a.333.333 0 0 0 .261-.542Z"
      />
    </Svg>
  );
};

export default React.memo(BellIcon);
