import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface AcceptedIconProps extends SvgProps {
  color: string | undefined;
}

const AcceptedIcon = ({ color, ...props }: AcceptedIconProps) => {
  return (
    <Svg viewBox="0 0 33 32" width={33} height={32} fill="none" {...props}>
      <Path
        fill={color}
        d="M16.5 0C7.678 0 .5 7.178.5 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16Zm8.942 11.79L15.217 21.934a1.573 1.573 0 0 1-2.206.04l-5.413-4.932a1.626 1.626 0 0 1-.12-2.246 1.586 1.586 0 0 1 2.245-.08l4.29 3.93 9.144-9.143a1.598 1.598 0 0 1 2.285 0 1.598 1.598 0 0 1 0 2.286Z"
      />
    </Svg>
  );
};

export default React.memo(AcceptedIcon);
