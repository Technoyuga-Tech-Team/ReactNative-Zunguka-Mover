import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

interface DollerCircleIconProps extends SvgProps {
  color?: string;
}

const DollerCircleIcon = ({color, ...props}: DollerCircleIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Path
        fill={color}
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm2.203 13.869c-.405.405-.92.652-1.475.732V17a.75.75 0 0 1-1.5 0v-.401a2.62 2.62 0 0 1-2.184-2.293.75.75 0 1 1 1.491-.167c.064.57.544 1 1.116 1h.7c.298 0 .579-.117.792-.33.213-.213.33-.494.33-.792 0-.515-.35-.962-.851-1.089l-1.608-.399a2.643 2.643 0 0 1-1.434-.935 2.61 2.61 0 0 1-.552-1.609c0-1.301.955-2.376 2.2-2.579V7a.75.75 0 0 1 1.5 0v.396a2.617 2.617 0 0 1 2.229 2.298.75.75 0 1 1-1.491.167c-.064-.57-.544-1-1.116-1h-.7a1.123 1.123 0 0 0-.271 2.211l1.608.399a2.624 2.624 0 0 1 1.986 2.544 2.61 2.61 0 0 1-.77 1.854Z"
      />
    </Svg>
  );
};

export default React.memo(DollerCircleIcon);
