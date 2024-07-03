import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface UploadIconProps extends SvgProps {
  color?: string;
}

const UploadIcon = ({ color, ...props }: UploadIconProps) => {
  return (
    <Svg viewBox="0 0 16 17" width={16} height={17} fill="none" {...props}>
      <Path
        fill={color}
        d="M12.942 15H3.61a.5.5 0 0 1 0-1h9.333a.5.5 0 0 1 0 1Zm-7.22-7.167v3.334c0 .368.3.666.667.666h4a.667.667 0 0 0 .667-.666V7.833h1.615a.66.66 0 0 0 .454-1.139L8.94 2.742a.887.887 0 0 0-1.217 0L3.541 6.694a.66.66 0 0 0 .453 1.14h1.729Z"
      />
    </Svg>
  );
};

export default React.memo(UploadIcon);
