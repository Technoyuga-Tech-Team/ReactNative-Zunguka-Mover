import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { HIT_SLOP2, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constant";
import CloseIcon from "../svg/CloseIcon";

interface ImageZoomViewerProps {
  visiblePopup: boolean;
  togglePopup?: () => void;
  image: any;
}

const ImageZoomViewer: React.FC<ImageZoomViewerProps> = ({
  visiblePopup,
  togglePopup,
  image,
}) => {
  const style = useStyle();
  const { theme } = useTheme();

  return (
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      style={style.modalCont}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={togglePopup}
        style={style.container}
      ></TouchableOpacity>
      <TouchableOpacity
        onPress={togglePopup}
        hitSlop={HIT_SLOP2}
        style={{ position: "absolute", top: 50, right: 20, zIndex: 1000 }}
      >
        <CloseIcon color={theme?.colors?.white} />
      </TouchableOpacity>
      <View style={style.container1}>
        <Image source={image} resizeMode="contain" style={style.img} />
      </View>
    </Modal>
  );
};

export default ImageZoomViewer;

const useStyle = makeStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(40, 40, 40, 1)",
    elevation: 1,
  },
  container1: {
    alignSelf: "center",
    position: "absolute",
    width: SCREEN_WIDTH,
    zIndex: 100,
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  txtLoginToZunguka: {
    fontSize: theme.fontSize?.fs22,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginTop: 10,
  },
  txtLoginToZunguka1: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginVertical: 20,
    textAlign: "center",
    width: "90%",
  },
  txtLoginToZungukaDesc: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    textAlign: "center",
    color: theme.colors?.secondaryText,
    lineHeight: 20,
    marginTop: 10,
  },
  buttonCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonRightMargin: {
    marginRight: 10,
  },
  buttonLeftMargin: {
    marginLeft: 10,
  },
  iconCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
}));
