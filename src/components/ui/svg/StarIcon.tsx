import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

interface StarIconProps extends SvgProps {
  color?: string;
}

const StarIcon = ({ color, ...props }: StarIconProps) => {
  return (
    <Svg width={24} height={23} viewBox="0 0 24 23" fill="none" {...props}>
      <Path
        fill={color}
        d="m13.283 1.128 2.59 5.223c.194.393.57.665 1.006.728l5.977.864c1.096.158 1.534 1.502.74 2.273l-4.321 4.193a1.33 1.33 0 0 0-.386 1.182l.988 5.738c.2 1.164-1.022 2.052-2.07 1.504l-5.184-2.713a1.335 1.335 0 0 0-1.241 0l-5.18 2.71c-1.05.55-2.277-.34-2.075-1.506l.988-5.733a1.33 1.33 0 0 0-.386-1.182L.41 10.216c-.796-.77-.358-2.115.74-2.273l5.976-.864c.435-.063.811-.335 1.007-.728l2.59-5.223c.52-1.06 2.036-1.06 2.56 0Z"
      />
    </Svg>
  );
};

export default React.memo(StarIcon);
