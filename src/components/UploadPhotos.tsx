import React, { useCallback, useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePickerProps } from "../types/common.types";
import { ThemeProps } from "../types/global.types";
import Scale from "../utils/Scale";
import { AppImage } from "./AppImage/AppImage";
import { HIT_SLOP } from "../constant";
import CloseIcon from "./ui/svg/CloseIcon";
import PlusIcon from "./ui/svg/PlusIcon";
import CustomButton from "./ui/CustomButton";
import {
  getImageFromCamera,
  getImageFromGallary,
  requestCameraPermission,
} from "../utils/ImagePickerCameraGallary";
import ImagePickerPopup from "./ui/ImagePickerPopup";

export type Item = ReturnType<typeof mapIndexToData>;

export const mapIndexToData = (_d: any, index: number, arr: any[]) => {
  return {
    name: arr[index].name,
    type: arr[index].type,
    uri: arr[index].uri,
  };
};

interface UploadPhotosProps {
  images: imagePickerProps[];
  setImages: (val: imagePickerProps[]) => void;
  navigation: any;
}

const UploadPhotos: React.FC<UploadPhotosProps> = ({
  images,
  setImages,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const [visible, setVisible] = useState(false);
  const [selectedImageForDelete, setSelectedImageForDelete] =
    useState<string>("");

  const onPressFromCamera = async () => {
    togglePopup();
    setTimeout(async () => {
      if (Platform.OS === "android") {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          openPickerCameraImage();
        }
      } else {
        openPickerCameraImage();
      }
    }, 100);
  };

  const openPickerCameraImage = async () => {
    try {
      const imageObject = await getImageFromCamera();
      setImages([...images, imageObject]);
    } catch (error) {
      // Handle errors here if needed (e.g., display a user-friendly message)
      console.error("Error using getImageFromCamera:", error);
    }
  };

  const onPressFromGallary = async () => {
    togglePopup();
    setTimeout(async () => {
      try {
        const imageObject = await getImageFromGallary({ multiple: true });
        setImages([...images, ...imageObject]);
      } catch (error) {
        // Handle errors here if needed (e.g., display a user-friendly message)
        console.error("Error using getImageFromGallary:", error);
      }
    }, 100);
  };

  const togglePopup = () => {
    setVisible(!visible);
  };

  const onPressUploadPhotos = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (selectedImageForDelete !== "") {
      const filterArr = images.filter((ele) => {
        return ele.name !== selectedImageForDelete;
      });
      setImages(filterArr);
      setSelectedImageForDelete("");
    }
  }, [selectedImageForDelete]);

  const onPressCloseIcon = (item: imagePickerProps) => {
    setSelectedImageForDelete(item.name);
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<imagePickerProps>) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={[style.rowItem, { opacity: isActive ? 0.5 : 1 }]}
          >
            <AppImage
              source={item.uri}
              style={style.imgCont}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onPressCloseIcon(item)}
              hitSlop={HIT_SLOP}
              activeOpacity={0.6}
              style={style.closeCont}
            >
              <CloseIcon color={theme.colors?.black} height={14} width={14} />
            </TouchableOpacity>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    []
  );

  return (
    <View style={style.container}>
      {images?.length > 0 ? (
        <DraggableFlatList
          horizontal
          data={images}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onDragEnd={({ data }) => setImages(data)}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={style.draggableCont}
        />
      ) : (
        <TouchableOpacity onPress={onPressUploadPhotos} activeOpacity={0.8}>
          <PlusIcon />
        </TouchableOpacity>
      )}
      <ImagePickerPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressFromCamera={onPressFromCamera}
        onPressFromGallary={onPressFromGallary}
      />
    </View>
  );
};

export default UploadPhotos;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    height: Scale(100),
    marginHorizontal: 20,
    backgroundColor: theme.colors?.primaryLightest,
    borderRadius: 4,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rowItem: {
    height: Scale(80),
    width: Scale(80),
    borderRadius: Scale(8),
    marginHorizontal: 5,
  },
  imgCont: { height: Scale(80), width: Scale(80), borderRadius: Scale(8) },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  draggableCont: {
    height: 100,
    // width: "100%",
    alignSelf: "center",
    paddingTop: 10,
  },
  closeCont: {
    height: Scale(20),
    width: Scale(20),
    borderRadius: Scale(10),
    backgroundColor: theme.colors?.white,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 8,
    right: 8,
  },
}));
