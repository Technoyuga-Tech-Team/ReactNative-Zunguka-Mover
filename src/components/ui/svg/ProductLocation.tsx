import * as React from "react";
import Svg, {
  Circle,
  G,
  Path,
  Defs,
  RadialGradient,
  Stop,
  ClipPath,
  SvgProps,
} from "react-native-svg";

interface ProductLocationProps extends SvgProps {
  color: string;
}

const ProductLocation = ({ color, ...props }: ProductLocationProps) => {
  return (
    <Svg viewBox="0 0 40 40" width={40} height={40} fill="none" {...props}>
      <Circle cx={20} cy={20.001} r={19.5} fill="url(#a)" stroke={color} />
      <Circle cx={20} cy={20.001} r={12} fill={color} />
      <G fill="#fff" clipPath="url(#b)">
        <Path d="m17.777 23.687 2.191 2.132 3.558-3.461A4.814 4.814 0 0 0 25 18.897a4.814 4.814 0 0 0-1.474-3.461A5.088 5.088 0 0 0 19.968 14a5.088 5.088 0 0 0-3.557 1.435A4.824 4.824 0 0 0 15 18.13l1.8-1.011.23-.13 1.354-.761 1.584-.89 1.585.89 1.585.89v3.557l-.158.089-1.425.802-1.356.762-.229.128-2.193 1.23Z" />
        <Path
          fillOpacity={0.4}
          d="m17.74 17.293 2.228 1.251 2.228-1.25-.958-.537-1.27-.715-1.268.715h-.002l-.958.536Z"
        />
        <Path d="M19.654 21.573v-2.502l-2.224-1.249v2.502l1.268.713h.002l.954.536Z" />
        <Path
          fillOpacity={0.6}
          d="M20.283 19.071v2.502l.956-.536 1.27-.713v-2.502l-2.226 1.25Z"
        />
      </G>
      <Defs>
        <RadialGradient
          id="a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(90 0 20) scale(20)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor={color} stopOpacity={0} />
        </RadialGradient>
        <ClipPath id="b">
          <Path fill="#fff" d="M15 14.001h10v11.818H15z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default React.memo(ProductLocation);
