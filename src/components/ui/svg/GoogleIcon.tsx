import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface GoogleIconProps extends SvgProps {
  color?: string;
}

const GoogleIcon = ({ color, ...props }: GoogleIconProps) => {
  return (
    <Svg viewBox="0 0 24 23" width={24} height={23} fill="none" {...props}>
      <Path
        fill="#4285F4"
        fillRule="evenodd"
        d="M23.298 11.761c0-.815-.073-1.6-.21-2.352h-10.83v4.449h6.189a5.29 5.29 0 0 1-2.295 3.47v2.886h3.717c2.174-2.002 3.429-4.95 3.429-8.452Z"
        clipRule="evenodd"
      />
      <Path
        fill="#34A853"
        fillRule="evenodd"
        d="M12.258 23c3.105 0 5.708-1.03 7.61-2.786l-3.716-2.886c-1.03.69-2.347 1.098-3.894 1.098-2.996 0-5.53-2.023-6.435-4.741H1.98v2.98A11.496 11.496 0 0 0 12.258 23Z"
        clipRule="evenodd"
      />
      <Path
        fill="#FBBC05"
        fillRule="evenodd"
        d="M5.823 13.685a6.913 6.913 0 0 1-.36-2.185c0-.758.13-1.495.36-2.185v-2.98H1.98A11.496 11.496 0 0 0 .758 11.5c0 1.856.444 3.612 1.223 5.165l3.842-2.98Z"
        clipRule="evenodd"
      />
      <Path
        fill="#EA4335"
        fillRule="evenodd"
        d="M12.258 4.574c1.688 0 3.204.58 4.396 1.72l3.298-3.299C17.961 1.14 15.357 0 12.258 0A11.496 11.496 0 0 0 1.98 6.335l3.842 2.98c.904-2.718 3.44-4.741 6.435-4.741Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default React.memo(GoogleIcon);
