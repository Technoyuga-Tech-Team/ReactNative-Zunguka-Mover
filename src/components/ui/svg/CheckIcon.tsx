import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CheckIconProps extends SvgProps {
  color?: string;
}

const CheckIcon = ({ color, ...props }: CheckIconProps) => {
  return (
    <Svg viewBox="0 0 16 17" width={16} height={17} fill="none" {...props}>
      <Path
        fill={color}
        d="M10 15.666H6C2.38 15.666.833 14.12.833 10.5v-4C.833 2.88 2.38 1.333 6 1.333h4c3.62 0 5.167 1.547 5.167 5.167v4c0 3.62-1.547 5.166-5.167 5.166ZM6 2.333c-3.073 0-4.167 1.093-4.167 4.167v4c0 3.073 1.094 4.166 4.167 4.166h4c3.073 0 4.167-1.093 4.167-4.166v-4c0-3.074-1.094-4.167-4.167-4.167H6Z"
      />
      <Path
        fill={color}
        d="M7.053 10.887a.5.5 0 0 1-.353-.147L4.813 8.853a.503.503 0 0 1 0-.706.503.503 0 0 1 .707 0L7.053 9.68l3.427-3.427a.503.503 0 0 1 .707 0 .503.503 0 0 1 0 .707l-3.78 3.78a.5.5 0 0 1-.354.147Z"
      />
    </Svg>
  );
};

export default React.memo(CheckIcon);
