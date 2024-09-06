import React from "react";
import { Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import moment from "moment";
import { TouchableOpacity } from "react-native";
import { ThemeProps } from "../../types/global.types";
import Scale from "../../utils/Scale";
import { RWF, SCREEN_WIDTH } from "../../constant";
import ArrowUpRightCircle from "../ui/svg/ArrowUpRightCircle";
import ArrowDownLeftCircle from "../ui/svg/ArrowDownLeftCircle";
import { transactionData } from "../../types/transaction.types";

interface TransactionItemProps {
  item: transactionData;
  onPress: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item, onPress }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  let isCredited = item.transaction_type === "sell";
  const date = moment(item.created_at).format("MMM Do YY");
  const time = moment(item?.created_at).startOf("hour").fromNow();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={style.container}
    >
      <View style={{ flexDirection: "row" }}>
        {isCredited ? (
          <ArrowUpRightCircle style={style.icon} />
        ) : (
          <ArrowDownLeftCircle style={style.icon} />
        )}
        <View>
          <Text style={style.txtTitle}>{item.item?.title}</Text>
          <Text style={style.txtDateAndTime}>
            {date} • {time}
          </Text>
        </View>
      </View>

      <Text
        style={[
          style.txtAmount,
          {
            color: isCredited ? theme.colors?.green : theme.colors?.pinkDark,
          },
        ]}
      >
        {RWF} {item.amount}
      </Text>
    </TouchableOpacity>
  );
};

export default TransactionItem;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    height: Scale(72),
    borderBottomColor: theme.colors?.borderButtonColor,
    borderBottomWidth: 1,
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors?.white,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
  },
  txtDateAndTime: {
    fontSize: theme.fontSize?.fs11,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.textSecondary,
    marginTop: 8,
  },
  icon: {
    marginRight: 10,
  },
  txtAmount: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
}));
