import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface NavigationIconProps extends SvgProps {
  color?: string;
}

const NavigationIcon = ({ color, ...props }: NavigationIconProps) => {
  return (
    <Svg viewBox="0 0 13 13" width={13} height={13} fill="none" {...props}>
      <Path
        fill={color}
        fillRule="evenodd"
        d="M.374 5.246c.063-.161.192-.24.347-.301C4.476 3.445 8.23 1.943 11.986.44a.325.325 0 0 1 .12-.029c-.025.027-.048.055-.074.08-2.375 2.376-4.75 4.751-7.124 7.128-.072.072-.123.078-.213.034a977.62 977.62 0 0 0-3.999-1.94c-.141-.068-.261-.15-.322-.3v-.168ZM7.623 12.663c-.151-.06-.232-.18-.3-.322a1119.46 1119.46 0 0 0-1.945-4.01c-.04-.08-.035-.128.03-.193 2.383-2.38 4.764-4.76 7.145-7.142A.205.205 0 0 1 12.64.94l-.04.101c-1.508 3.774-3.018 7.547-4.525 11.321a.513.513 0 0 1-.284.302h-.168Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default React.memo(NavigationIcon);
