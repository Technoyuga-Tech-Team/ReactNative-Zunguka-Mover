import React from "react";
import { ActivityIndicator, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";

interface LoadingProps {
  backgroundColor?: string;
}

const Loading: React.FC<LoadingProps> = ({ backgroundColor }) => {
  const style = useStyles();
  const { theme } = useTheme();
  return (
    <View style={[style.container, { backgroundColor }]}>
      <ActivityIndicator size={"large"} color={theme?.colors?.primary} />
    </View>
  );
};

export default Loading;

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  lottie: { height: 100, width: 100 },
}));
