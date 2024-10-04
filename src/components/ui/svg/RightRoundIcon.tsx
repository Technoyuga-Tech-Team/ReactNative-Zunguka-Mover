import * as React from "react";
import Svg, { Circle, G, Path, SvgProps } from "react-native-svg";

interface RightRoundIconProps extends SvgProps {
  color?: string;
}

const RightRoundIcon = ({ color, ...props }: RightRoundIconProps) => {
  return (
    <Svg viewBox="0 0 96 96" width={96} height={96} fill="none" {...props}>
      <Path
        fill={color}
        d="M48 8C25.92 8 8 25.92 8 48s17.92 40 40 40 40-17.92 40-40S70.08 8 48 8Zm16.12 32.8L45.44 59.44c-.56.6-1.32.88-2.12.88-.76 0-1.52-.28-2.12-.88l-9.32-9.32a3.018 3.018 0 0 1 0-4.24 3.018 3.018 0 0 1 4.24 0l7.2 7.2 16.56-16.52c1.16-1.2 3.08-1.2 4.24 0 1.16 1.16 1.16 3.04 0 4.24Z"
      />
    </Svg>
  );
};

export default React.memo(RightRoundIcon);
