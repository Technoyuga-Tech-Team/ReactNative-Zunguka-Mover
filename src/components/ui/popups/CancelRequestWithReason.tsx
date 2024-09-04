import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import CustomButton from "../CustomButton";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constant";
import { CustomTxtInput } from "../CustomTextInput";
import Scale from "../../../utils/Scale";

interface CancelRequestWithReasonProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onPressOk: (reason: string) => void;
}

const CancelRequestWithReason: React.FC<CancelRequestWithReasonProps> = ({
  visiblePopup,
  togglePopup,
  onPressOk,
}) => {
  const style = useStyle();
  const { theme } = useTheme();

  const [reason, setReason] = useState("");
  const [errorReason, setErrorReason] = useState("");

  const onChangeText = (txt: string) => {
    setErrorReason("");
    setReason(txt);
  };

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
      <View style={style.container1}>
        <View style={style.innerCont}>
          <Text style={style.txtLoginToZunguka}>Provide cancel reason</Text>

          <CustomTxtInput
            placeholder="Provide resaon"
            returnKeyType="done"
            returnKeyLabel="done"
            keyboardType={"default"}
            onChangeText={(val) => onChangeText(val)}
            value={reason}
            error={errorReason}
            touched={errorReason !== ""}
            textInputStyle={style.txtInCont}
          />
          <View style={style.buttonCont}>
            <CustomButton
              onPress={() => {
                if (reason !== "") {
                  onPressOk(reason);
                  setReason("");
                } else {
                  setErrorReason("Please provide reason");
                }
              }}
              title={"Submit"}
              buttonWidth="half"
              width={SCREEN_WIDTH - 100}
              variant="primary"
              type="solid"
              backgroundColor={theme?.colors?.pinkDark}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelRequestWithReason;

const useStyle = makeStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors?.overlay,
    elevation: 1,
  },
  container1: {
    alignSelf: "center",
    position: "absolute",
    top: "35%",
    width: "90%",
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  innerCont: {
    height: "auto",
    width: "100%",
    backgroundColor: theme.colors?.white,
    borderRadius: 20,
    paddingVertical: 10,
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
  txtInCont: {
    height: Scale(53),
    width: SCREEN_WIDTH - 80,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme?.colors?.secondaryText,
  },
}));
