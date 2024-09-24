import React from "react";

import { Image, ImageProps } from "../../../blueprints";
import { Images } from "../../assets/images";

export type ImageSource = Images | string;

export interface AppImageProps extends Omit<ImageProps, "source"> {
  source: ImageSource;
  zoomViewDisable?: boolean;
}

export const AppImage = (props: AppImageProps) => {
  return (
    <Image
      defaultSource={Images.PLACEHOLDER_IMAGE}
      resizeMode="contain"
      zoomViewDisable={props.zoomViewDisable}
      {...props}
    />
  );
};
