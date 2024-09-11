import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

interface AlertIconProps extends SvgProps {
  color?: string;
}

const AlertIcon = ({ color, ...props }: AlertIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        d="M19.916 12.69v-2.056c0-3-1.994-5.543-4.727-6.374v-.93a1.936 1.936 0 0 0-1.933-1.934 1.936 1.936 0 0 0-1.934 1.933v.931c-2.732.83-4.726 3.374-4.726 6.374v2.056a10.12 10.12 0 0 1-2.829 7.037.644.644 0 0 0 .465 1.09h5.866a3.228 3.228 0 0 0 3.158 2.578 3.228 3.228 0 0 0 3.158-2.578h5.865a.644.644 0 0 0 .465-1.09 10.12 10.12 0 0 1-2.828-7.037Zm-7.305-9.36a.645.645 0 0 1 1.29 0v.675a6.718 6.718 0 0 0-1.29 0v-.676Zm.645 18.776c-.84 0-1.557-.538-1.823-1.289h3.646a1.937 1.937 0 0 1-1.823 1.29Zm-7.634-2.578a11.396 11.396 0 0 0 2.263-6.838v-2.056a5.377 5.377 0 0 1 5.37-5.371 5.377 5.377 0 0 1 5.372 5.37v2.057c0 2.49.795 4.87 2.263 6.838H5.622ZM21.635 10.633a.645.645 0 0 0 1.29 0 9.605 9.605 0 0 0-2.833-6.836.645.645 0 0 0-.911.912 8.324 8.324 0 0 1 2.454 5.925ZM4.232 11.278a.645.645 0 0 0 .645-.645c0-2.238.871-4.342 2.454-5.924a.644.644 0 1 0-.911-.912 9.605 9.605 0 0 0-2.832 6.836c0 .356.288.645.644.645Z"
      />
    </Svg>
  );
};

export default React.memo(AlertIcon);