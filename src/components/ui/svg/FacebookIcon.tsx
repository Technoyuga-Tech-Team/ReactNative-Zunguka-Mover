import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface FacebookIconProps extends SvgProps {
  color?: string;
}

const FacebookIcon = ({ color, ...props }: FacebookIconProps) => {
  return (
    <Svg viewBox="0 0 24 23" width={24} height={23} fill="none" {...props}>
      <Path
        fill="#1877F2"
        d="M23.242 11.5c0-6.351-5.148-11.5-11.5-11.5C5.392 0 .242 5.15.242 11.5c0 5.74 4.206 10.498 9.704 11.36v-8.036h-2.92V11.5h2.92V8.966c0-2.882 1.716-4.474 4.343-4.474 1.258 0 2.574.225 2.574.225v2.83h-1.45c-1.428 0-1.874.886-1.874 1.796V11.5h3.19l-.51 3.324h-2.68v8.036c5.498-.862 9.703-5.62 9.703-11.36Z"
      />
    </Svg>
  );
};

export default React.memo(FacebookIcon);
