import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface PickupLocationIconProps extends SvgProps {
  color?: string;
}

const PickupLocationIcon = ({ color, ...props }: PickupLocationIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill="#FFBE15"
        fillRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-1a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
        clipRule="evenodd"
      />
      <Circle cx={12} cy={12} r={4.3} fill="#FFBE15" stroke="#FFBE15" />
    </Svg>
  );
};

export default React.memo(PickupLocationIcon);
