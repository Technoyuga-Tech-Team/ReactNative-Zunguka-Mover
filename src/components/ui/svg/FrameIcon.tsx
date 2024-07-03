import * as React from "react";
import Svg, {
  SvgProps,
  G,
  Mask,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";

interface FrameIconProps extends SvgProps {}

const FrameIcon = ({ ...props }: FrameIconProps) => {
  return (
    <Svg viewBox="0 0 82 83" width={82} height={83} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Mask
          id="b"
          width={82}
          height={83}
          x={0}
          y={0}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <Path fill="#fff" d="M82 .5H0v82h82V.5Z" />
        </Mask>
        <G mask="url(#b)">
          <Path
            fill="url(#c)"
            d="m41 .5.836 23.983c.188 5.407 6.65 8.083 10.606 4.393l17.55-16.367-16.368 17.55c-3.69 3.956-1.014 10.417 4.393 10.605L82 41.5l-23.983.836c-5.407.188-8.083 6.65-4.393 10.606l16.367 17.55-17.55-16.368c-3.956-3.69-10.417-1.014-10.605 4.393L41 82.5l-.836-23.983c-.188-5.407-6.65-8.083-10.606-4.393L12.008 70.49l16.368-17.55c3.69-3.956 1.014-10.417-4.393-10.605L0 41.5l23.983-.836c5.407-.188 8.083-6.65 4.393-10.606L12.01 12.508l17.55 16.368c3.956 3.69 10.417 1.014 10.605-4.393L41 .5Z"
          />
        </G>
      </G>
      <Defs>
        <LinearGradient
          id="c"
          x1={41}
          x2={41}
          y1={0.5}
          y2={82.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A7B5FF" />
          <Stop offset={1} stopColor="#F3ACFF" />
        </LinearGradient>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 .5h82v82H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default React.memo(FrameIcon);
