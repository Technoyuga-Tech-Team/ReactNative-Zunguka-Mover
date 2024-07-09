import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CreditcardIconProps extends SvgProps {
  color?: string;
}

const CreditcardIcon = ({ color, ...props }: CreditcardIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M18 4.25H6C3.582 4.25 2.25 5.582 2.25 8v8c0 2.418 1.332 3.75 3.75 3.75h12c2.418 0 3.75-1.332 3.75-3.75V8c0-2.418-1.332-3.75-3.75-3.75ZM20.25 16c0 1.577-.673 2.25-2.25 2.25H6c-1.577 0-2.25-.673-2.25-2.25v-5.25h16.5V16Zm0-6.75H3.75V8c0-1.577.673-2.25 2.25-2.25h12c1.577 0 2.25.673 2.25 2.25v1.25ZM6.25 15a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75Z"
      />
    </Svg>
  );
};

export default React.memo(CreditcardIcon);