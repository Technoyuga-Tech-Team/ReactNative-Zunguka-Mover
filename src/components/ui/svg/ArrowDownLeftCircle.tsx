import * as React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

interface ArrowDownLeftCircleProps extends SvgProps {
  color?: string;
}

const ArrowDownLeftCircle = ({ ...props }: ArrowDownLeftCircleProps) => {
  return (
    <Svg viewBox="0 0 40 40" width={40} height={40} fill="none" {...props}>
      <Rect width={40} height={40} fill="#FFF4F2" rx={20} />
      <Path
        fill="#E43E2B"
        d="M20 7.5C13.096 7.5 7.5 13.096 7.5 20S13.096 32.5 20 32.5 32.5 26.904 32.5 20 26.904 7.5 20 7.5Zm4.413 9.413-5.9 5.9h2.737a.938.938 0 0 1 0 1.875h-5a.94.94 0 0 1-.938-.938v-5a.938.938 0 0 1 1.876 0v2.736l5.9-5.9a.938.938 0 1 1 1.325 1.327Z"
      />
    </Svg>
  );
};

export default React.memo(ArrowDownLeftCircle);
