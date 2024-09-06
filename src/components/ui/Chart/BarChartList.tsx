import moment from "moment";
import React, { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import DropShadow from "react-native-drop-shadow";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../../../types/global.types";
import { HIT_SLOP, RWF, SCREEN_WIDTH } from "../../../constant";
import LeftIcon from "../svg/LeftIcon";

interface BarChartListProps {
  start: Date;
  end: Date;
  weekDays: String[];
  onPressNext: () => void;
  onPressPrev: () => void;
  graphData: {
    total_price: number;
    created_date: string;
    order: null;
  }[];
  balance: string;
  onPressDate: () => void;
  onPressBalance: () => void;
}

const BarChartList: React.FC<BarChartListProps> = ({
  start,
  end,
  onPressNext,
  onPressPrev,
  weekDays,
  graphData,
  balance,
  onPressDate,
  onPressBalance,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const sliderRef = useRef<FlatList>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  let start_date = moment(start).format("MMM D");
  let end_date = moment(end).format("MMM D");

  // const onPressPrev = () => {
  // if (currentSlide > 0) {
  //   sliderRef.current?.scrollToIndex({ index: currentSlide - 1 });
  // }
  // };
  // const onPressNext = () => {
  // if (currentSlide < BARCHART_DATA.length - 1) {
  //   sliderRef.current?.scrollToIndex({ index: currentSlide + 1 });
  // }
  // };

  const isTodayOrAfter = () => {
    if (!end) return false; // Handle case if no date is selected
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    return end.getTime() >= today.getTime();
  };

  const RenderItem = () => {
    const data = {
      labels: graphData?.map((ele) =>
        moment(ele.created_date, "MM-DD-YYYY").format("DD MMM")
      ),
      datasets: [
        {
          data: graphData?.map((ele) => ele.total_price),
        },
      ],
    };

    return (
      <DropShadow style={style.shadow}>
        <View style={style.container}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressDate}
            hitSlop={HIT_SLOP}
          >
            <Text
              style={style.txtDuration}
            >{`${start_date} - ${end_date}`}</Text>
          </TouchableOpacity>
          <View style={style.priceCont}>
            <TouchableOpacity onPress={onPressPrev} hitSlop={HIT_SLOP}>
              <LeftIcon color={theme.colors?.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressBalance}
              hitSlop={HIT_SLOP}
            >
              <Text style={style.txtPrice}>
                {RWF} {balance}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isTodayOrAfter()}
              onPress={onPressNext}
              hitSlop={HIT_SLOP}
            >
              <LeftIcon
                color={
                  isTodayOrAfter()
                    ? theme.colors?.lightGrey
                    : theme.colors?.primary
                }
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
          </View>
          <View style={style.dividerCont} />
          <BarChart
            data={data}
            width={SCREEN_WIDTH - 60}
            height={180}
            style={{ left: -10, width: "100%" }}
            chartConfig={{
              backgroundColor: theme.colors?.white,
              backgroundGradientFrom: theme.colors?.white,
              backgroundGradientTo: theme.colors?.white,
              decimalPlaces: 0,
              color: () => theme.colors?.primary,
              labelColor: () => "#5E8274",
              barPercentage: 0.7,
              propsForLabels: {
                fontSize: theme.fontSize?.fs10,
                fontFamily: theme.fontFamily?.regular,
              },
            }}
            withInnerLines={false}
            yAxisSuffix="k"
            showBarTops={false}
            fromZero={true}
            // yAxisLabel="$"
          />
        </View>
      </DropShadow>
    );
  };

  // const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // const viewableItemChanged = useRef(
  //   ({ viewableItems }: { viewableItems: ViewToken[] }) => {
  //     setCurrentSlide(viewableItems[0]?.index);
  //   }
  // ).current;

  return (
    <RenderItem />
    // <FlatList
    //   ref={sliderRef}
    //   data={BARCHART_DATA}
    //   keyExtractor={(_item, index) => index.toString()}
    //   renderItem={renderItem}
    //   pagingEnabled={true}
    //   horizontal
    //   showsHorizontalScrollIndicator={false}
    //   onViewableItemsChanged={viewableItemChanged}
    //   viewabilityConfig={viewConfig}
    //   contentContainerStyle={{ paddingBottom: 20 }}
    // />
  );
};

export default BarChartList;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.white,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 10,
  },
  dividerCont: {
    height: 1,
    width: "100%",
    backgroundColor: theme.colors?.borderButtonColor,
    marginVertical: 10,
  },
  txtPrice: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
  priceCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  shadow: {
    shadowColor: theme.colors?.blackTrans,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  txtDuration: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.greyedColor,
    alignSelf: "center",
  },
}));
