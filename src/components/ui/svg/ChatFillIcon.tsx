import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ChatFillIconProps extends SvgProps {
  color?: string;
}

const ChatFillIcon = ({ color, ...props }: ChatFillIconProps) => {
  return (
    <Svg viewBox="0 0 20 21" width={20} height={21} fill="none" {...props}>
      <Path
        fill={color}
        d="M14.096 5.404a6.498 6.498 0 0 0-9.192 0 6.493 6.493 0 0 0-1.22 7.495l-.67 2.944a.534.534 0 0 0 .639.638l2.945-.669C10.879 17.95 16 14.855 16 9.998a6.452 6.452 0 0 0-1.904-4.594Zm-3.24 6.212H6.788a.534.534 0 1 1 0-1.067h4.068a.534.534 0 1 1 0 1.067Zm1.356-2.168H6.788a.534.534 0 1 1 0-1.068h5.424a.534.534 0 1 1 0 1.068Z"
      />
    </Svg>
  );
};

export default React.memo(ChatFillIcon);
