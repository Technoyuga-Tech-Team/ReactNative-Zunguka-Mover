import * as React from "react";
import Svg, { Circle, G, Path, SvgProps } from "react-native-svg";

interface RightIconProps extends SvgProps {
  color?: string;
}

const RightIcon = ({ color, ...props }: RightIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M9 19.75a.75.75 0 0 1-.53-1.281l6.47-6.47-6.47-6.47a.75.75 0 1 1 1.061-1.061l7 7a.75.75 0 0 1 0 1.06l-7 7A.745.745 0 0 1 9 19.75Z"
      />
    </Svg>
  );
};

export default React.memo(RightIcon);
