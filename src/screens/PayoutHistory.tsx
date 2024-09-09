import React, { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import moment from "moment";
import { MoverHomeNavigationProps } from "../types/navigation";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { PayoutHistoryItem } from "../types/myEarning.types";
import { useGetPayoutHistory } from "../hooks/useGetPayoutHistory";
import CustomHeader from "../components/ui/CustomHeader";
import { HIT_SLOP, RWF, SCREEN_HEIGHT } from "../constant";
import NoDataFound from "../components/ui/NoDataFound";
import { ThemeProps } from "../types/global.types";

const PayoutHistory: React.FC<
  MoverHomeNavigationProps<Route.navPayoutHistory>
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loader, setLoader] = useState(true);
  const [payoutHistoryData, setPayoutHistoryData] = useState<
    PayoutHistoryItem[]
  >([]);

  const { data, refetch, isLoading, isError } = useGetPayoutHistory(
    `${10}`,
    `${page}`,
    { enabled: false }
  );

  useEffect(() => {
    if (!isError && data?.data?.data) {
      setPayoutHistoryData([...payoutHistoryData, ...data?.data?.data]);
      setTotalPage(data?.data?.totalPages);
      setPage(page + 1);
    }
  }, [data]);

  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setPage(1);
      refetch().then();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getStatus = (status: string) => {
    return status == "pending"
      ? theme?.colors?.yellowStar
      : status == "completed"
      ? theme?.colors?.primary
      : theme?.colors?.pinkDark;
  };

  const onEndReached = () => {
    if (page <= totalPage && !loader) {
      refetch().then();
    }
  };

  return (
    <View style={style.container}>
      <StatusBar
        backgroundColor={theme.colors?.background}
        barStyle={"dark-content"}
      />
      <CustomHeader title="Payout History" />
      <View style={style.innerCont}>
        {payoutHistoryData?.length > 0 ? (
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <FlatList
              data={payoutHistoryData}
              keyExtractor={(_item, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              //   refreshControl={
              //     <RefreshControl refreshing={loader} onRefresh={onRefresh} />
              //   }
              onMomentumScrollEnd={onEndReached}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <View style={style.itemCont}>
                    <Text style={style.txtDate}>
                      {moment(item.created_at).format("DD MMM YYYY")}
                    </Text>
                    <View style={style.itemInnerCont}>
                      <Text style={style.txtAmount}>
                        Requested amount - {RWF} {item.amount}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={style.txtDate}>Status - </Text>
                        <View style={style.statusCont}>
                          <TouchableOpacity
                            hitSlop={HIT_SLOP}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                style.txtStatus,
                                { color: getStatus(item.status) },
                              ]}
                            >
                              {item.status}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <NoDataFound title="No data found!" isLoading={loader} />
        )}
      </View>
    </View>
  );
};

export default PayoutHistory;

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
    color: theme.colors?.black,
    width: "90%",
    textAlign: "center",
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.error,
  },
  statusCont: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemCont: {
    backgroundColor: theme.colors?.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  itemInnerCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtDate: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
  },
  txtAmount: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
  },
  txtStatus: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textTransform: "capitalize",
  },
}));
