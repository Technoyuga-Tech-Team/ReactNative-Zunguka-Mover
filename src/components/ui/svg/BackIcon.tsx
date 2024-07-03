import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BackIconProps extends SvgProps {
  color: string | undefined;
}

const BackIcon = ({ color, ...props }: BackIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M22 12a1 1 0 0 1-1 1H5.414l5.293 5.293a.999.999 0 1 1-1.414 1.414l-6.999-6.999a1 1 0 0 1 0-1.416l6.999-6.999a.999.999 0 1 1 1.414 1.414L5.414 11H21a1 1 0 0 1 1 1Z"
      />
    </Svg>
  );
};

export default React.memo(BackIcon);
