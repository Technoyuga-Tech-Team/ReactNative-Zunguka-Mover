import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CameraIconProps extends SvgProps {
  color?: string;
}

const CameraIcon = ({ color, ...props }: CameraIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M18 7h-2l-.658-1.974A1.5 1.5 0 0 0 13.919 4H10.08a1.5 1.5 0 0 0-1.423 1.026L8 7H6c-2 0-3 1-3 3v8c0 2 1 3 3 3h12c2 0 3-1 3-3v-8c0-2-1-3-3-3Zm-6 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.5-5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
      />
    </Svg>
  );
};

export default React.memo(CameraIcon);
