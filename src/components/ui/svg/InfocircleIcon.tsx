import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface InfocircleIconProps extends SvgProps {
  color?: string;
}

const InfocircleIcon = ({ color, ...props }: InfocircleIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75Zm0-20c-5.101 0-9.25 4.149-9.25 9.25s4.149 9.25 9.25 9.25 9.25-4.149 9.25-9.25S17.101 2.75 12 2.75Zm.75 13.75v-4.571a.75.75 0 0 0-1.5 0V16.5a.75.75 0 0 0 1.5 0Zm.27-8a1 1 0 0 0-1-1h-.01a.996.996 0 0 0-.995 1c0 .552.453 1 1.005 1a1 1 0 0 0 1-1Z"
      />
    </Svg>
  );
};

export default React.memo(InfocircleIcon);
