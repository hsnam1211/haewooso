import React from 'react';
import { SvgProps } from 'react-native-svg';

import * as Icons from '../res/Index';

type IconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
  styleProps?: {};
};
const Icon = ({
  name,
  fill = 'transparent',
  width: _width,
  height: _height,
  size,
  stroke = 'transparent',
  strokeWidth,
  styleProps,
  ...props
}: IconProps) => {
  const Comp = Icons[name];

  const width = _width ?? size;
  const height = _height ?? size;
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return (
    <Comp
      style={styleProps}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...sizeProps}
    />
  );
};

export default Icon;
