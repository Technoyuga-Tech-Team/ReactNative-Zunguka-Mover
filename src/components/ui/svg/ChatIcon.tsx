import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ChatIconProps extends SvgProps {
  color?: string;
}

const ChatIcon = ({ color, ...props }: ChatIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M4.005 21.749c-.457 0-.9-.18-1.237-.516a1.743 1.743 0 0 1-.427-1.792l.84-2.501c.099-.307.09-.615-.025-.858a9.74 9.74 0 0 1-.902-4.083c0-5.375 4.373-9.749 9.748-9.749 5.376 0 9.749 4.373 9.749 9.749s-4.373 9.749-9.749 9.749a9.727 9.727 0 0 1-4.075-.9c-.248-.119-.558-.127-.875-.026l-2.489.836a1.781 1.781 0 0 1-.558.091ZM12 3.75c-4.548 0-8.248 3.7-8.248 8.249a8.23 8.23 0 0 0 .76 3.444c.276.581.312 1.28.095 1.963l-.844 2.511a.242.242 0 0 0 .064.256.244.244 0 0 0 .257.064l2.498-.839c.693-.221 1.394-.187 1.982.094a8.21 8.21 0 0 0 3.436.757c4.549 0 8.249-3.7 8.249-8.249s-3.7-8.25-8.249-8.25ZM16.75 10a.75.75 0 0 0-.75-.75H8a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 .75-.75Zm-3 4a.75.75 0 0 0-.75-.75H8a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 .75-.75Z"
      />
    </Svg>
  );
};

export default React.memo(ChatIcon);