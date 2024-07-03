import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface InboxIconProps extends SvgProps {
  color?: string;
}
const InboxIcon = ({ color, ...props }: InboxIconProps) => {
  return (
    <Svg viewBox="0 0 20 21" width={20} height={21} fill="none" {...props}>
      <Path
        stroke={color}
        strokeWidth={1.5}
        d="M.918 18.756V3.466a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.879a2 2 0 0 0-1.561.75L1.987 19.13a.6.6 0 0 1-1.069-.374Z"
      />
    </Svg>
  );
};

export default React.memo(InboxIcon);
