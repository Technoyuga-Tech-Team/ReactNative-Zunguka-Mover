import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface FavouriteIconProps extends SvgProps {
  color?: string;
}

const FavouriteIcon = ({ color, ...props }: FavouriteIconProps) => {
  return (
    <Svg viewBox="0 0 22 21" width={22} height={21} fill="none" {...props}>
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.543 2.46c-2.682-1.645-5.023-.982-6.429.074-.576.433-.864.65-1.034.65-.17 0-.458-.217-1.034-.65C8.64 1.478 6.3.814 3.617 2.46.098 4.619-.698 11.74 7.42 17.75c1.546 1.143 2.32 1.716 3.66 1.716 1.341 0 2.114-.572 3.66-1.717 8.118-6.008 7.322-13.13 3.803-15.29Z"
      />
    </Svg>
  );
};

export default React.memo(FavouriteIcon);
