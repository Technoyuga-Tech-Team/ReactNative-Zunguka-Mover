import * as React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

interface ArrowUpRightCircleProps extends SvgProps {
  color?: string;
}

const ArrowUpRightCircle = ({ ...props }: ArrowUpRightCircleProps) => {
  return (
    <Svg viewBox="0 0 40 40" width={40} height={40} fill="none" {...props}>
      <Rect width={40} height={40} fill="#F2FFFA" rx={20} />
      <Path
        fill="#32BF89"
        d="M20 7.5C13.096 7.5 7.5 13.096 7.5 20S13.096 32.5 20 32.5 32.5 26.904 32.5 20 26.904 7.5 20 7.5Zm4.688 13.75a.938.938 0 0 1-1.875 0v-2.736l-5.9 5.9a.935.935 0 0 1-1.325 0 .938.938 0 0 1 0-1.327l5.9-5.9H18.75a.938.938 0 0 1 0-1.875h5a.94.94 0 0 1 .866.58.937.937 0 0 1 .073.36v4.998h-.002Z"
      />
    </Svg>
  );
};

export default React.memo(ArrowUpRightCircle);
