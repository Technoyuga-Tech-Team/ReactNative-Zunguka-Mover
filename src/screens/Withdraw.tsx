import React, { useState } from "react";
import { Keyboard, StatusBar, Text, TextInput, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  HomeNavigationProps,
  MainNavigationProps,
  MoverHomeNavigationProps,
} from "../types/navigation";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectMyEarningLoading } from "../store/MyEarning/myEarning.selector";
import { sendPayoutRequest } from "../store/MyEarning/myEarning.thunk";
import { setSuccess } from "../store/global/global.slice";
import CustomHeader from "../components/ui/CustomHeader";
import CustomButton from "../components/ui/CustomButton";
import { LoadingState, ThemeProps } from "../types/global.types";
import { SCREEN_HEIGHT } from "../constant";

const Withdraw: React.FC<MainNavigationProps<Route.navWithdraw>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectMyEarningLoading);

  const [amount, setAmount] = useState<string>("");
  const [error, setErrors] = useState<string>("");

  const totalEarning = route.params.earning;

  const onChangeText = (val: string) => {
    if (Number(val) < Number(totalEarning)) {
      setErrors("");
      setAmount(val);
    } else {
      setErrors("Please enter less amount than available balance");
    }
  };

  const onPressSend = async () => {
    Keyboard.dismiss();
    const result = await dispatch(sendPayoutRequest({ amount: amount }));
    if (sendPayoutRequest.fulfilled.match(result)) {
      if (result.payload.status == 1) {
        setErrors("");
        setAmount("");
        dispatch(setSuccess(result.payload?.message));
        navigation.navigate(Route.navPayoutHistory);
      }
    } else {
      console.log("errror getMyEarningData --->", result.payload);
    }
  };

  return (
    <View style={style.container}>
      <StatusBar
        backgroundColor={theme.colors?.background}
        barStyle={"dark-content"}
      />
      <CustomHeader title="Withdraw" />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={style.innerCont}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
            }}
          >
            <Text style={style.txtTotEarning}>${totalEarning}</Text>
            <Text style={style.txtBalance}>Available Balance</Text>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TextInput
              placeholderTextColor={theme.colors?.secondaryText}
              placeholder={"0.00"}
              style={style.inputText}
              value={amount}
              onChangeText={onChangeText}
              selectionColor={theme?.colors?.primary}
              keyboardType="numeric"
              returnKeyLabel="done"
              returnKeyType="done"
            />
            {error && <Text style={style.error}>{error}</Text>}
          </View>
        </View>
        <View style={{ paddingBottom: insets.bottom + 10 }}>
          <CustomButton
            disabled={
              error !== "" || amount == "" || loading == LoadingState.CREATE
            }
            loading={loading == LoadingState.CREATE}
            onPress={onPressSend}
            title={"Send"}
            buttonWidth="full"
            variant="primary"
            type="solid"
            //   disabled={!isValid}
            // loading={loading === LoadingState.CREATE}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Withdraw;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
  },
  innerCont: {
    flex: 1,
  },
  txtTotEarning: {
    fontSize: theme.fontSize?.fs20,
    color: theme.colors?.black,
    fontFamily: theme.fontFamily?.bold,
  },
  txtBalance: {
    fontSize: theme.fontSize?.fs17,
    color: theme.colors?.secondaryText,
    fontFamily: theme.fontFamily?.regular,
    marginTop: 7,
  },
  inputText: {
    fontSize: RFValue(64, SCREEN_HEIGHT),
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.primary,
    width: "90%",
    textAlign: "center",
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
  },
}));
