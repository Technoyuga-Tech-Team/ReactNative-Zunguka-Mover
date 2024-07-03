import React from "react";
import { Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { makeStyles } from "react-native-elements";
import CustomButton from "../CustomButton";

interface LogoutPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onPressLogout: () => void;
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({
  visiblePopup,
  togglePopup,
  onPressLogout,
}) => {
  const style = useStyle();

  return (
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      style={style.modalCont}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={togglePopup}>
        <View style={style.container}>
          <View style={style.innerCont}>
            <Text style={style.txtLoginToZunguka}>Log Out?</Text>
            <Text style={style.txtLoginToZunguka1}>
              Are you sure you want to log out from Zunguka?
            </Text>
            <View style={style.buttonCont}>
              <CustomButton
                onPress={onPressLogout}
                title={"Yes, Log Out"}
                buttonWidth="half"
                variant="primary"
                type="solid"
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LogoutPopup;

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
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
}));
