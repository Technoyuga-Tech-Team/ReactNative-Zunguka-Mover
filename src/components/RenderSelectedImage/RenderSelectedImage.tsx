import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HIT_SLOP } from "../../constant";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";
import { AppImage } from "../AppImage/AppImage";
import CloseIcon from "../ui/svg/CloseIcon";

interface RenderSelectedImageProps {
  data: any[];
  onPressCloseIcon: (item: any) => void;
  largSize?: boolean;
  zoomViewDisable?: boolean;
}

const RenderSelectedImage: React.FC<RenderSelectedImageProps> = ({
  data,
  onPressCloseIcon,
  largSize = false,
  zoomViewDisable = true,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <AppImage
                source={item.uri || item}
                style={largSize ? style.img1 : style.img}
                resizeMode="cover"
                zoomViewDisable={zoomViewDisable}
              />
              <TouchableOpacity
                onPress={() => onPressCloseIcon(item)}
                hitSlop={HIT_SLOP}
                activeOpacity={0.6}
                style={style.closeCont}
              >
                <CloseIcon color={theme.colors?.black} height={18} width={18} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default RenderSelectedImage;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  closeCont: {
    height: Scale(20),
    width: Scale(20),
    borderRadius: Scale(10),
    backgroundColor: theme.colors?.white,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 8,
    right: 17,
  },
  img: {
    height: Scale(100),
    width: Scale(100),
    borderRadius: 10,
    marginHorizontal: 10,
  },
  img1: {
    borderRadius: 10,
    marginHorizontal: 10,
    height: Scale(170),
    width: Scale(300),
  },
}));
