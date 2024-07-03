import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface DownArrowIconProps extends SvgProps {
  color: string | undefined;
}

const DownArrowIcon = ({ color, ...props }: DownArrowIconProps) => {
  return (
    <Svg viewBox="0 0 6 3" width={6} height={3} fill="none" {...props}>
      <Path
        fill={color}
        d="M3 2.875a.372.372 0 0 1-.265-.11l-2-2a.375.375 0 1 1 .53-.53l1.736 1.734L4.735.234a.375.375 0 1 1 .531.53l-2 2a.376.376 0 0 1-.266.11Z"
      />
    </Svg>
  );
};

export default React.memo(DownArrowIcon);
