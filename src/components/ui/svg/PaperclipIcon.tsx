import * as React from 'react';
import Svg, {G, Rect, Path, Defs, SvgProps} from 'react-native-svg';

interface PaperclipIconProps extends SvgProps {
  color?: string;
}
const PaperclipIcon = ({color, ...props}: PaperclipIconProps) => {
  return (
    <Svg viewBox="0 0 16 17" width={16} height={17} fill="none" {...props}>
      <Path
        fill="#706E6E"
        d="M6.87 15a4.678 4.678 0 0 1-3.34-1.369c-1.857-1.862-1.828-4.922.065-6.819l3.818-3.83a3.318 3.318 0 0 1 2.366-.981c.893 0 1.734.348 2.365.982a3.362 3.362 0 0 1 0 4.74l-3.837 3.846c-.726.728-1.992.73-2.72 0a1.931 1.931 0 0 1 0-2.722l3.371-3.38a.5.5 0 0 1 .709.706l-3.37 3.38a.93.93 0 0 0 0 1.311.941.941 0 0 0 1.302 0l3.837-3.847a2.36 2.36 0 0 0 0-3.328c-.885-.888-2.429-.888-3.314 0L4.303 7.52C2.824 9 2.795 11.479 4.24 12.926a3.682 3.682 0 0 0 2.632 1.075 3.916 3.916 0 0 0 2.757-1.138L12.979 9.5a.5.5 0 0 1 .709.707l-3.351 3.361A4.931 4.931 0 0 1 6.87 15Z"
      />
    </Svg>
  );
};

export default React.memo(PaperclipIcon);
