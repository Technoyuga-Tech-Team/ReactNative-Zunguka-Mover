import * as React from "react";
import Svg, { Circle, SvgProps } from "react-native-svg";

interface VerticlePathDotsIconProps extends SvgProps {
  color?: string;
}

const VerticlePathDotsIcon = ({
  color,
  ...props
}: VerticlePathDotsIconProps) => {
  return (
    <Svg viewBox="0 0 24 20" width={24} height={20} fill="none" {...props}>
      <Circle cx={12} cy={1} r={1} fill="#B2B5C4" />
      <Circle cx={12} cy={7} r={1} fill="#B2B5C4" />
      <Circle cx={12} cy={13} r={1} fill="#B2B5C4" />
      <Circle cx={12} cy={19} r={1} fill="#B2B5C4" />
    </Svg>
  );
};

export default React.memo(VerticlePathDotsIcon);
