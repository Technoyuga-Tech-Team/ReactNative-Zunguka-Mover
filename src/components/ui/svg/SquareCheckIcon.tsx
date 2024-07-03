import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface SquareCheckIconProps extends SvgProps {
  color?: string;
}

const SquareCheckIcon = ({ color, ...props }: SquareCheckIconProps) => {
  return (
    <Svg viewBox="0 0 16 17" width={16} height={17} fill="none" {...props}>
      <Path
        fill={color}
        d="M10 15.667H6C2.38 15.667.833 14.12.833 10.5v-4C.833 2.88 2.38 1.333 6 1.333h4c3.62 0 5.167 1.547 5.167 5.167v4c0 3.62-1.547 5.167-5.167 5.167ZM6 2.333c-3.073 0-4.167 1.094-4.167 4.167v4c0 3.073 1.094 4.167 4.167 4.167h4c3.073 0 4.167-1.094 4.167-4.167v-4c0-3.073-1.094-4.167-4.167-4.167H6Z"
      />
    </Svg>
  );
};

export default React.memo(SquareCheckIcon);
