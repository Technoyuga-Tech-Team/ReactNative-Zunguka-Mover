import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PlusSquareIconProps extends SvgProps {
  color?: string;
}

const PlusSquareIcon = ({ color, ...props }: PlusSquareIconProps) => {
  return (
    <Svg viewBox="0 0 27 26" width={27} height={26} fill="none" {...props}>
      <Path
        fill={color}
        d="M21 .333H6C2.62.333.833 2.12.833 5.5v15c0 3.38 1.787 5.167 5.167 5.167h15c3.38 0 5.167-1.787 5.167-5.167v-15C26.167 2.12 24.38.333 21 .333ZM24.833 20.5c0 2.615-1.217 3.834-3.833 3.834H6c-2.615 0-3.833-1.22-3.833-3.834v-15c0-2.615 1.218-3.833 3.833-3.833h15c2.616 0 3.833 1.218 3.833 3.833v15Zm-6-7.5a.667.667 0 0 1-.666.667h-4v4a.667.667 0 0 1-1.334 0v-4h-4a.667.667 0 0 1 0-1.333h4v-4a.667.667 0 0 1 1.334 0v4h4c.368 0 .666.298.666.666Z"
      />
    </Svg>
  );
};

export default React.memo(PlusSquareIcon);
