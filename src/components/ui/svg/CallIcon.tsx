import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CallIconProps extends SvgProps {
  color: string | undefined;
}

const CallIcon = ({ color, ...props }: CallIconProps) => {
  return (
    <Svg viewBox="0 0 20 20" width={20} height={20} fill="none" {...props}>
      <Path
        fill={color}
        d="M14.544 12.048c-.843-.671-1.698-1.078-2.53-.408l-.497.406c-.364.294-1.04 1.669-3.654-1.134C5.25 8.113 6.805 7.678 7.17 7.386l.5-.406c.828-.672.515-1.518-.082-2.39l-.36-.527c-.6-.87-1.253-1.44-2.083-.769l-.449.366a3.906 3.906 0 0 0-1.64 2.597c-.3 1.845.644 3.959 2.808 6.278 2.16 2.32 4.277 3.485 6.281 3.465 1.666-.017 2.672-.85 2.986-1.153l.45-.366c.828-.67.314-1.353-.53-2.026l-.506-.407Z"
      />
    </Svg>
  );
};

export default React.memo(CallIcon);
