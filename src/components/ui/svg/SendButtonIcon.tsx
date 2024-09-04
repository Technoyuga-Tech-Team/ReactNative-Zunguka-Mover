import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface SendButtonIconProps extends SvgProps {
  color?: string;
}
const SendButtonIcon = ({ color, ...props }: SendButtonIconProps) => {
  return (
    <Svg viewBox="0 0 23 23" width={23} height={23} fill="none" {...props}>
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="m5.401 3.854 13.353 6.659a1.097 1.097 0 0 1 0 1.964L5.4 19.136a1.103 1.103 0 0 1-1.187-.13 1.097 1.097 0 0 1-.37-1.133l1.694-6.378-1.693-6.378c-.11-.417.034-.86.37-1.132.335-.273.8-.324 1.186-.13Z"
        clipRule="evenodd"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.369}
        d="M10.563 11.495H5.538"
      />
    </Svg>
  );
};

export default React.memo(SendButtonIcon);
