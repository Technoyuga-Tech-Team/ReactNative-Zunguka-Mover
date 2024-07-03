import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PlusIconProps extends SvgProps {
  color?: string;
}

const PlusIcon = ({ color, ...props }: PlusIconProps) => {
  return (
    <Svg viewBox="0 0 64 64" width={54} height={54} fill="none" {...props}>
      <Path
        fill="#F3B241"
        d="M27 .333C12.28.333.333 12.28.333 27 .333 41.72 12.28 53.667 27 53.667c14.72 0 26.667-11.947 26.667-26.667C53.667 12.28 41.72.333 27 .333ZM36.333 29H29v7.334c0 1.093-.907 2-2 2s-2-.907-2-2V29h-7.333c-1.094 0-2-.907-2-2s.906-2 2-2H25v-7.333c0-1.094.907-2 2-2s2 .906 2 2V25h7.333c1.094 0 2 .907 2 2s-.906 2-2 2Z"
      />
    </Svg>
  );
};

export default React.memo(PlusIcon);
