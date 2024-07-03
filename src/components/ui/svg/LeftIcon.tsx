import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

interface LeftIconProps extends SvgProps {
  color?: string;
}

const LeftIcon = ({ color, ...props }: LeftIconProps) => {
  return (
    <Svg viewBox="0 0 9 16" width={9} height={16} fill="none" {...props}>
      <Path
        fill={color}
        d="M8 15.75a.744.744 0 0 1-.53-.22l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 1 1 1.061 1.06L2.061 8l6.47 6.47A.75.75 0 0 1 8 15.75Z"
      />
    </Svg>
  );
};

export default React.memo(LeftIcon);
