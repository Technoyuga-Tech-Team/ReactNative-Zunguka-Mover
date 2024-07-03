import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface SearchIconProps extends SvgProps {
  color?: string;
}

const SearchIcon = ({ color, ...props }: SearchIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        d="m21.61 20.936-3.84-3.841a8.705 8.705 0 0 0 2.06-5.63c0-4.824-3.925-8.75-8.75-8.75s-8.75 3.926-8.75 8.75c0 4.826 3.925 8.75 8.75 8.75a8.705 8.705 0 0 0 5.63-2.06l3.84 3.84a.748.748 0 0 0 1.06 0 .749.749 0 0 0 0-1.06Zm-17.78-9.47c0-3.998 3.252-7.25 7.25-7.25s7.25 3.252 7.25 7.25-3.252 7.25-7.25 7.25-7.25-3.252-7.25-7.25Z"
      />
    </Svg>
  );
};

export default React.memo(SearchIcon);
