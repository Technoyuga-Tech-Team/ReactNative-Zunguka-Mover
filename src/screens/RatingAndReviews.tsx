import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import StarWithRate from "../components/StarWithRate";
import CustomHeader from "../components/ui/CustomHeader";
import NoDataFound from "../components/ui/NoDataFound";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectMoverBookingLoading } from "../store/MoverBooking/moverBooking.selectors";
import { getMoverRatingHistory } from "../store/MoverBooking/moverBooking.thunk";
import { selectUserData } from "../store/settings/settings.selectors";
import { LoadingState, ThemeProps } from "../types/global.types";
import { MainNavigationProps } from "../types/navigation";
import RatingList from "../components/Rating/RatingList";

const RatingAndReviews: React.FC<
  MainNavigationProps<Route.navReviewAndRating>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectMoverBookingLoading);

  const [moverRatingHistoryData, setMoverRatingHistoryData] = useState<any>([]);
  const [onEndReachLoading, setOnEndReachLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const userData = useSelector(selectUserData);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      setMoverRatingHistoryData([]);
      moverRatingHistory(10, 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const moverRatingHistory = async (limit: number, offset: number) => {
    const result = await dispatch(
      getMoverRatingHistory({
        limit,
        offset,
      })
    );
    if (getMoverRatingHistory.fulfilled.match(result)) {
      if (result.payload.status == 1) {
        setMoverRatingHistoryData([
          ...moverRatingHistoryData,
          ...result.payload.data.data,
        ]);
        setPage(page + 1);
        setTotalPage(result.payload.data.totalPages);
        setOnEndReachLoading(false);
      } else {
        setOnEndReachLoading(false);
      }
    } else {
      setOnEndReachLoading(false);
      console.log("errror getMoverRatingHistory --->", result.payload);
    }
  };

  const onEndReached = () => {
    if (page <= totalPage && loading !== LoadingState.CREATE) {
      setOnEndReachLoading(true);
      moverRatingHistory(10, page);
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader title="Your reviews" />
      <StarWithRate
        rate={Number(userData?.avg_rate).toFixed(1)}
        totalRateCount={userData?.total_user_rate}
      />

      {moverRatingHistoryData?.length > 0 ? (
        <View style={style.listCont1}>
          <RatingList
            ratingData={moverRatingHistoryData}
            onReachedEnd={onEndReached}
            onEndReachLoading={onEndReachLoading}
          />
        </View>
      ) : (
        <>
          <NoDataFound
            title={"No data found!"}
            isLoading={loading === LoadingState.CREATE}
          />
        </>
      )}
    </View>
  );
};

export default RatingAndReviews;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
  },
  innerCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  txtRating: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
  listCont1: {
    flex: 1,
    paddingBottom: 20,
  },
}));
