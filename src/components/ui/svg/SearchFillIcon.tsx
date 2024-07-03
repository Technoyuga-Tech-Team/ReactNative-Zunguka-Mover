import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface SearchFillIconProps extends SvgProps {
  color?: string;
}

const SearchFillIcon = ({ color, ...props }: SearchFillIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        fillRule="evenodd"
        d="m21.61 21.436-4.369-4.368a8 8 0 1 0-1.059 1.06l4.368 4.368c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default React.memo(SearchFillIcon);
