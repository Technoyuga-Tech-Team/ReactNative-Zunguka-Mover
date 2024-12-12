import React from "react";
import { Text, View } from "react-native";
import { makeStyles } from "react-native-elements";
import InfoIcon from "./svg/InfoIcon";

interface InputFieldInfoProps {
  text: string;
}

const InputFieldInfo: React.FC<InputFieldInfoProps> = ({ text }) => {
  const style = useStyles();
  return (
    <View style={style.container}>
      <InfoIcon />
      <Text style={style.text}>{text}</Text>
    </View>
  );
};

export default InputFieldInfo;

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: theme.fontSize?.fs12,
    lineHeight: 16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    marginLeft: 5,
    width: "90%",
  },
}));
