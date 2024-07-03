import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface HomeFillIconProps extends SvgProps {
  color?: string;
}

const HomeFillIcon = ({ color, ...props }: HomeFillIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        fillRule="evenodd"
        d="M18.66 21.466h-3.2a.3.3 0 0 1-.3-.3v-4.2a2.5 2.5 0 1 0-5 0v4.2a.3.3 0 0 1-.3.3h-3.2c-2 0-3-1-3-3v-6.349c0-1.998.523-2.305 1.43-3.065l5.964-5a2.5 2.5 0 0 1 3.213 0l5.964 5c.906.76 1.43 1.067 1.43 3.065v6.35c0 2-1 3-3 3Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default React.memo(HomeFillIcon);
