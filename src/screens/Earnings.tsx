import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { MoverHomeNavigationProps } from "../types/navigation";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectMyEarningLoading } from "../store/MyEarning/myEarning.selector";
import { getMyEarnings } from "../store/MyEarning/myEarning.thunk";
import { LoadingState, ThemeProps } from "../types/global.types";
import Loading from "../components/ui/Loading";
import { HIT_SLOP2, RWF, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constant";
import PayoutHistory from "../components/ui/svg/PayoutHistory";
import CustomButton from "../components/ui/CustomButton";
import BarChartList from "../components/ui/Chart/BarChartList";
import PackageList from "../components/packages/PackageList";
import CalenderPopup from "../components/ui/popups/CalenderPopup";
import Scale from "../utils/Scale";

const Earnings: React.FC<MoverHomeNavigationProps<Route.navEarnings>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const loading = useSelector(selectMyEarningLoading);

  const [visibleCalender, setVisibleCalender] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [myEarningData, setMyEarningData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageBalance, setTotalBalance] = useState(0);
  const [filterBalance, setFilterBalance] = useState(0);
  const [graphData, setGraphData] = useState<
    {
      total_price: number;
      created_date: string;
      order: null;
    }[]
  >([]);
  const [isCurrentWeek, setIsCurrentWeek] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMyEarningData([]);
      // setStartDate(new Date());
      // setEndDate(new Date());
      onPressPrev(6);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getMyEarningData(10, 1);
  }, [startDate, endDate]);

  useEffect(() => {
    const today = new Date();

    // Get the day of the week (0 for Sunday, 6 for Saturday)
    const day = today.getDay();

    // Calculate the offset to get the Monday of the current week
    const offset = (day + 6) % 7;

    // Get the start and end dates of the current week
    const start_Date = new Date(today.getTime() - offset * 24 * 60 * 60 * 1000);
    const end_Date = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    // Check if your target date (replace with your actual date variable) is within the current week
    const isCurrentWeek = endDate >= start_Date && endDate <= end_Date;

    setIsCurrentWeek(isCurrentWeek);
  }, [startDate, endDate]);

  const getMyEarningData = async (limit: number, offset: number) => {
    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");
    console.log("start", start);
    console.log("end", end);
    const result = await dispatch(
      getMyEarnings({
        status: "endjob",
        limit,
        offset,
        start_date: start,
        end_date: end,
      })
    );
    if (getMyEarnings.fulfilled.match(result)) {
      if (result.payload.status == 1) {
        console.log("result.payload?.data?.data", result.payload?.data?.data);
        setMyEarningData(result.payload?.data?.data);
        // result.payload?.data?.data?.length > 0
        //   ? setMyEarningData([...myEarningData, ...result.payload?.data?.data])
        //   : setMyEarningData([]);
        setTotalBalance(result.payload.data?.balance);
        setFilterBalance(result.payload.data?.filter_balance);
        setGraphData(result.payload.data?.graphData);
        setTotalPage(result.payload.data?.totalPages);
        setPage(page + 1);
      }
    } else {
      console.log("errror getMyEarningData --->", result.payload);
    }
  };

  const onPressWithdraw = () => {
    navigation.navigate(Route.navWithdraw, {
      earning: parseFloat(`${totalPageBalance}`).toFixed(2),
    });
  };

  const togglePopup = () => {
    setVisibleCalender(!visibleCalender);
  };
  const onPressSelecteDate = () => {
    togglePopup();
  };

  const rangeDate = (startDate: Date, endDate: Date) => {
    if (startDate && endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
      togglePopup();
    }
  };

  const getPreviousWeek = (fromLoadPage: number) => {
    if (!startDate || !endDate) {
      console.error(
        "Please provide both start and end dates for the current week"
      );
      return;
    }

    const previousWeekStartDate = new Date(startDate.getTime());
    previousWeekStartDate.setDate(
      previousWeekStartDate.getDate() - fromLoadPage
    );

    const previousWeekEndDate = new Date(previousWeekStartDate.getTime());
    previousWeekEndDate.setDate(previousWeekEndDate.getDate() + 6);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(previousWeekStartDate.getTime());
      day.setDate(day.getDate() + i);
      const dayName = moment(day).format("ddd");
      days.push(dayName);
    }
    setWeekDays(days);
    console.log("previousWeekStartDate", previousWeekStartDate);
    console.log("previousWeekEndDate", previousWeekEndDate);
    setStartDate(previousWeekStartDate);
    setEndDate(previousWeekEndDate);
  };

  const onPressPrev = (fromLoadPage: number) => {
    getPreviousWeek(fromLoadPage);
  };
  const getNextWeek = () => {
    if (!startDate || !endDate) {
      console.error(
        "Please provide both start and end dates for the current week"
      );
      return;
    }

    const nextWeekStartDate = new Date(endDate.getTime());
    nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 1);

    const nextWeekEndDate = new Date(nextWeekStartDate.getTime());
    nextWeekEndDate.setDate(nextWeekEndDate.getDate() + 6);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(nextWeekStartDate.getTime());
      day.setDate(day.getDate() + i);
      const dayName = moment(day).format("ddd");
      days.push(dayName);
    }
    setWeekDays(days);

    setStartDate(nextWeekStartDate);
    setEndDate(nextWeekEndDate);
  };
  const onPressNext = () => {
    getNextWeek();
  };

  const onEndReached = () => {
    if (page <= totalPage && loading !== LoadingState.CREATE) {
      getMyEarningData(10, page);
    }
  };

  const onPressShowPayoutHistory = () => {
    navigation.navigate(Route.navPayoutHistory);
  };

  let start_date = moment(startDate).format("MMM D");
  let end_date = moment(endDate).format("MMM D");

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={style.container}
    >
      <StatusBar
        backgroundColor={theme.colors?.primary}
        barStyle={"dark-content"}
      />
      {loading === LoadingState.CREATE && <Loading />}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 50,
        }}
      >
        <PayoutHistory
          color={theme.colors?.transparent}
          height={18}
          width={18}
        />
        <Text style={style.txtTitle}>{"My Earnings"}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={HIT_SLOP2}
          onPress={onPressShowPayoutHistory}
        >
          <PayoutHistory color={theme.colors?.white} height={18} width={18} />
        </TouchableOpacity>
      </View>
      <View style={style.firstCont}>
        <View style={style.firstInnerCont}>
          <View>
            <Text style={style.txtEarning}>
              {parseFloat(`${totalPageBalance}`).toFixed(2)}
            </Text>
            <Text style={style.txtBalance}>{RWF} Balance</Text>
          </View>
          <CustomButton
            disabled={totalPageBalance == 0}
            onPress={onPressWithdraw}
            title={"Withdraw"}
            buttonWidth="half"
            variant="primary"
            type="solid"
            containerStyle={style.btnApply}
            titleStyle={style.txtBtnTitle}
            width={SCREEN_WIDTH / 2 - 30}
            backgroundColor={theme?.colors?.primary}
          />
        </View>
      </View>
      <View style={style.secondCont}>
        <View>
          <BarChartList
            balance={parseFloat(`${filterBalance}`).toFixed(2)}
            graphData={graphData}
            start={startDate}
            end={endDate}
            weekDays={weekDays}
            onPressPrev={() => onPressPrev(7)}
            onPressNext={onPressNext}
            onPressDate={togglePopup}
            onPressBalance={togglePopup}
          />
        </View>
        <View style={style.packageCont}>
          <Text style={style.txtToday}>{`${start_date} - ${end_date}`}</Text>
          <PackageList
            data={myEarningData}
            isCompleted={true}
            isFromMover={true}
            fromEarning={true}
            onPress={() => {}}
            onPressRating={() => {}}
            // onEndReached={onEndReached}
            isLoading={false}
          />
        </View>
      </View>
      <CalenderPopup
        visiblePopup={visibleCalender}
        togglePopup={togglePopup}
        rangeDate={rangeDate}
      />
    </ImageBackground>
  );
};

export default Earnings;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs20,
    color: theme.colors?.white,
    fontFamily: theme.fontFamily?.medium,
  },
  txtTitle1: {
    fontSize: theme.fontSize?.fs18,
    color: theme.colors?.white,
    fontFamily: theme.fontFamily?.medium,
  },
  btnApply: {
    backgroundColor: theme.colors?.primary,
    height: Scale(40),
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  txtBtnTitle: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.white,
  },
  txtEarning: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
  },
  txtBalance: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    lineHeight: theme.fontSize?.fs16,
    marginTop: 3,
    letterSpacing: 0.5,
  },
  firstCont: {
    paddingHorizontal: 20,
  },
  firstInnerCont: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors?.white,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  txtToday: {
    alignSelf: "center",
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.primaryText,
  },
  packageCont: { marginTop: 20, flex: 1 },
  secondCont: {
    flex: 1,
    marginTop: 20,
  },
  round: {
    height: Scale(40),
    width: Scale(40),
    borderRadius: Scale(20),
    backgroundColor: theme.colors?.white,
    alignItems: "center",
    justifyContent: "center",
  },
}));
