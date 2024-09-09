import * as React from "react";
import Svg, { G, Path, Defs, SvgProps, ClipPath } from "react-native-svg";

interface DeleteIconProps extends SvgProps {
  color?: string;
}

const DeleteIcon = ({ color, ...props }: DeleteIconProps) => {
  return (
    <Svg viewBox="0 0 21 21" width={21} height={21} fill="none" {...props}>
      <G fill={color} clipPath="url(#a)">
        <Path d="m16.747 4.04-1.34 15.257H5.593L4.254 4.041l-1.696.148L3.92 19.723A1.434 1.434 0 0 0 5.335 21h10.33c.721 0 1.343-.561 1.416-1.288L18.443 4.19l-1.696-.148Z" />
        <Path d="M13.622 0H7.378A1.42 1.42 0 0 0 5.96 1.419v2.696h1.703V1.703h5.676v2.412h1.703V1.419A1.42 1.42 0 0 0 13.62 0Z" />
        <Path d="M19.581 3.263H1.42a.851.851 0 1 0 0 1.703h18.162a.851.851 0 1 0 0-1.703Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h21v21H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default React.memo(DeleteIcon);
