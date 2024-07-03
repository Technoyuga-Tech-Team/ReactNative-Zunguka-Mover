import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface UserIconProps extends SvgProps {
  color?: string;
}

const UserIcon = ({ color, ...props }: UserIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        d="M12.349 11.216a4.255 4.255 0 0 1-4.25-4.25 4.255 4.255 0 0 1 4.25-4.25 4.255 4.255 0 0 1 4.25 4.25 4.255 4.255 0 0 1-4.25 4.25Zm0-7a2.752 2.752 0 0 0-2.75 2.75 2.752 2.752 0 0 0 2.75 2.75 2.752 2.752 0 0 0 2.75-2.75 2.753 2.753 0 0 0-2.75-2.75Zm3.988 18H8.343c-2.42 0-3.753-1.325-3.753-3.731 0-2.661 1.506-5.77 5.75-5.77h4c4.244 0 5.75 3.108 5.75 5.77 0 2.406-1.333 3.73-3.753 3.73Zm-5.997-8c-3.943 0-4.25 3.267-4.25 4.269 0 1.564.674 2.23 2.253 2.23h7.994c1.579 0 2.253-.666 2.253-2.23 0-1.001-.307-4.27-4.25-4.27h-4Z"
      />
    </Svg>
  );
};

export default React.memo(UserIcon);
