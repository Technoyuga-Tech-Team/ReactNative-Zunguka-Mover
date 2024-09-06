import React from "react";
import { FlatList } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransactionItem from "./TransactionItem";
import { ThemeProps } from "../../types/global.types";
import {
  ProductDataProps,
  transactionData,
} from "../../types/transaction.types";

interface TransactionHistoryListProps {
  transactionHistoryData: transactionData[];
  onPressItem: (item: ProductDataProps) => void;
  onEndReached: () => void;
}

const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({
  transactionHistoryData,
  onPressItem,
  onEndReached,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const renderItem = ({
    item,
    index,
  }: {
    item: transactionData;
    index: number;
  }) => {
    return (
      <TransactionItem item={item} onPress={() => onPressItem(item?.item)} />
    );
  };

  return (
    <FlatList
      data={transactionHistoryData}
      keyExtractor={(_item, index) => index.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      contentContainerStyle={style.container}
    />
  );
};

export default TransactionHistoryList;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
  },
  txtTitle: {
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.bold,
    fontSize: theme.fontSize?.fs16,
    paddingLeft: 20,
    paddingTop: 20,
    backgroundColor: theme.colors?.white,
  },
}));
