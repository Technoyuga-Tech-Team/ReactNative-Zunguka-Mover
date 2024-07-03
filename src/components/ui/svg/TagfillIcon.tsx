import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface TagfillIconProps extends SvgProps {
  color?: string;
}

const TagfillIcon = ({ color, ...props }: TagfillIconProps) => {
  return (
    <Svg viewBox="0 0 25 25" width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        d="m20.88 15.676-4.76 4.77c-1.37 1.36-2.78 1.36-4.14 0l-.804-.813a.3.3 0 0 1 0-.424l8.476-8.476a.3.3 0 0 1 .424 0l.803.803c1.41 1.41 1.36 2.77 0 4.14Zm-2.262-5.978-8.476 8.476a.3.3 0 0 1-.424 0L4.78 13.236a2.934 2.934 0 0 1-.86-2.076V5.416a1.95 1.95 0 0 1 1.95-1.95h5.737c.778 0 1.524.309 2.073.86l4.938 4.948a.3.3 0 0 1 0 .424ZM8.92 7.466c0-.552-.446-1-.998-1h-.01a.996.996 0 0 0-.993 1c0 .552.452 1 1.002 1a.999.999 0 0 0 .999-1Z"
      />
    </Svg>
  );
};

export default React.memo(TagfillIcon);
