import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { makeStyles } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeNavigationProps } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import { getData } from "../../utils/asyncStorage";
import { BASE_URL, HAS_NOTCH, secureStoreKeys } from "../../constant";
import { API } from "../../constant/apiEndpoints";
import CustomHeader from "../../components/ui/CustomHeader";
import NoDataFound from "../../components/ui/NoDataFound";
import { ThemeProps } from "../../types/global.types";
import TransactionHistoryList from "../../components/TransactionHistory/TransactionHistoryList";
import { transactionData } from "../../types/transaction.types";

const TransactionHistory: React.FC<
  HomeNavigationProps<Route.navTransactionHistory>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });

  const [transactionData, setTransactionData] = useState<transactionData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllTransaction(10, 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getAllTransaction = async (limit: number, page: number) => {
    const token = await getData(secureStoreKeys.JWT_TOKEN);
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}${API.GET_TRANSACTIONS}/${limit}/${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      // Handle the fetched data here
      if (data && data?.data?.data?.length > 0) {
        setLoading(false);
        setTransactionData([...transactionData, ...data?.data?.data]);
        setTotalPage(data?.data?.totalPages);
        setPage(page + 1);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onEndReached = () => {
    if (page <= totalPage && !loading) {
      getAllTransaction(10, page);
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader title="Transactions" />

      {transactionData && transactionData?.length > 0 ? (
        <TransactionHistoryList
          transactionHistoryData={transactionData}
          onEndReached={onEndReached}
          onPressItem={() => {}}
        />
      ) : (
        <NoDataFound title={"No data found!"} isLoading={loading} />
      )}
    </View>
  );
};

export default TransactionHistory;
const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    paddingTop: props.insets.top,
    paddingBottom:
      Platform.OS === "ios"
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
    backgroundColor: theme.colors?.background,
    noDataCont: { flex: 1, alignItems: "center", justifyContent: "center" },
    txtNoData: {
      fontSize: theme.fontSize?.fs16,
      fontFamily: theme.fontFamily?.medium,
      color: theme.colors?.black,
    },
  },
  txtTitle: {
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.bold,
    fontSize: theme.fontSize?.fs16,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
}));
