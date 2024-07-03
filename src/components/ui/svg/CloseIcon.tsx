import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CloseIconProps extends SvgProps {
  color?: string;
}

const CloseIcon = ({ color, ...props }: CloseIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M18.53 17.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.748.748 0 0 1-1.06 0 .75.75 0 0 1 0-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 1.061-1.061l5.47 5.47 5.47-5.47a.75.75 0 1 1 1.061 1.06L13.062 12l5.468 5.47Z"
      />
    </Svg>
  );
};

export default React.memo(CloseIcon);
