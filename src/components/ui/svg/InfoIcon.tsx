import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface InfoIconProps extends SvgProps {
  color?: string;
}
const InfoIcon = ({ color, ...props }: InfoIconProps) => {
  return (
    <Svg viewBox="0 0 16 16" width={16} height={16} fill="none" {...props}>
      <Path
        fill="#F3B241"
        d="M8 15.167A7.174 7.174 0 0 1 .833 8 7.174 7.174 0 0 1 8 .833 7.174 7.174 0 0 1 15.167 8 7.174 7.174 0 0 1 8 15.167ZM8 1.833A6.173 6.173 0 0 0 1.833 8c0 3.4 2.766 6.167 6.167 6.167 3.4 0 6.167-2.766 6.167-6.167 0-3.4-2.766-6.167-6.167-6.167ZM8.5 11V7.953a.5.5 0 0 0-1 0V11a.5.5 0 0 0 1 0Zm.18-5.333A.666.666 0 0 0 8.013 5h-.006a.664.664 0 0 0-.664.667.67.67 0 0 0 .67.667.667.667 0 0 0 .667-.667Z"
      />
    </Svg>
  );
};

export default React.memo(InfoIcon);
