import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface HomeIconProps extends SvgProps {
  color?: string;
}

const HomeIcon = ({ color, ...props }: HomeIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        d="M18.66 22.216h-4.25v-5.25c0-.965-.785-1.75-1.75-1.75s-1.75.785-1.75 1.75v5.25H6.66c-2.418 0-3.75-1.332-3.75-3.75v-6.35c0-2.123.586-2.716 1.542-3.509l6.12-5.13a3.244 3.244 0 0 1 4.176 0l6.12 5.13c.956.793 1.542 1.387 1.542 3.51v6.35c0 2.417-1.332 3.75-3.75 3.75Zm-2.75-1.5h2.75c1.577 0 2.25-.673 2.25-2.25v-6.35c0-1.526-.252-1.735-.999-2.355l-6.126-5.136a1.75 1.75 0 0 0-2.25 0L5.41 9.761c-.747.62-.999.83-.999 2.355v6.35c0 1.577.673 2.25 2.25 2.25h2.75v-3.75a3.254 3.254 0 0 1 3.25-3.25 3.254 3.254 0 0 1 3.25 3.25v3.75Z"
      />
    </Svg>
  );
};

export default React.memo(HomeIcon);
