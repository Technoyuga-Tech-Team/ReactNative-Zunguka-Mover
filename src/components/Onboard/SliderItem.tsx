import * as React from "react";
import { Platform, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../types/global.types";
import { SliderItemProps } from "../../types/slider.types";
import Scale from "../../utils/Scale";
import { AppImage } from "../AppImage/AppImage";
import { SCREEN_WIDTH } from "../../constant";

interface SliderProps {
  item: SliderItemProps;
}

const SliderItem: React.FC<SliderProps> = ({ item }) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <AppImage
        source={item?.image}
        style={styles.sliderImage}
        resizeMode={"contain"}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 100,
  },
  imageContainer: {
    paddingVertical: Scale(20),
  },
  sliderImage: {
    height: 213.41,
    width: SCREEN_WIDTH,
  },
}));

export default SliderItem;
