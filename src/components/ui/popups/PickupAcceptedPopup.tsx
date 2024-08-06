import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import Scale from "../../../utils/Scale";
import AcceptedIcon from "../svg/AcceptedIcon";

interface PickupAcceptedPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onPressOk: () => void;
}

const PickupAcceptedPopup: React.FC<PickupAcceptedPopupProps> = ({
  visiblePopup,
  togglePopup,
  onPressOk,
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
      <TouchableWithoutFeedback>
        <View style={style.container}>
          <View style={style.innerCont}>
            <AcceptedIcon color={theme.colors?.primary} />
            <Text style={style.txtLoginToAnypost}>Pick up accepted!</Text>
            <Text style={style.txtDesc}>
              Go ahead and arrange with your customer to pick up the goods
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressOk}
              style={style.btnOk}
            >
              <Text style={style.txtOk}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PickupAcceptedPopup;

const useStyle = makeStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors?.overlay,
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  innerCont: {
    height: "auto",
    width: "90%",
    backgroundColor: theme.colors?.white,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  txtLoginToAnypost: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginTop: 10,
    marginBottom: 20,
  },
  txtDesc: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
    marginHorizontal: 50,
  },
  txtLoginToAnypostDesc: {
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
    justifyContent: "space-between",
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
  txtOk: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.white,
  },
  btnOk: {
    height: Scale(50),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: theme.colors?.primary,
    marginTop: 20,
  },
}));
