import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

interface LogoutIconProps extends SvgProps {
  color?: string;
}

const LogoutIcon = ({ color, ...props }: LogoutIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M17.44 14.62 20 12.06 17.44 9.5M9.76 12.06h10.17M11.76 20c-4.42 0-8-3-8-8s3.58-8 8-8"
      />
    </Svg>
  );
};

export default React.memo(LogoutIcon);
