import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

interface LocationIconProps extends SvgProps {
  color?: string;
}

const LocationIcon = ({ color, ...props }: LocationIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M12 2.5c-4.687 0-8.5 3.813-8.5 8.5 0 4.983 4.629 8.041 7.692 10.064l.53.352a.5.5 0 0 0 .554 0l.53-.352c3.063-2.023 7.692-5.081 7.692-10.064C20.5 6.313 16.687 2.5 12 2.5Zm0 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
      />
    </Svg>
  );
};

export default React.memo(LocationIcon);
