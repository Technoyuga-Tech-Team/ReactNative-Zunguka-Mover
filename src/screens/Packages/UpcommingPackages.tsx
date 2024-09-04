import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { HomeNavigationProps } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectPackageStatusLoading } from "../../store/PackageStatus/packageStatus.selectors";
import { moverPackageStatusDetails } from "../../store/PackageStatus/packageStatus.thunk";
import { LoadingState, ThemeProps } from "../../types/global.types";
import PackageList from "../../components/packages/PackageList";

const UpcommingPackages: React.FC<
  HomeNavigationProps<Route.navUpcomingPackages>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectPackageStatusLoading);

  const [upComingData, setUpcomingData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      setUpcomingData([]);
      getUpcommingData(10, 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getUpcommingData = async (limit: number, offset: number) => {
    const result = await dispatch(
      moverPackageStatusDetails({
        status: "completed",
        limit,
        offset,
      })
    );
    if (moverPackageStatusDetails.fulfilled.match(result)) {
      console.log("data upcoming job --->", result.payload);
      if (result.payload.status == 1) {
        setUpcomingData([...upComingData, ...result.payload.data.data]);
        setTotalPage(result.payload.data.totalPages);
        setPage(page + 1);
      }
    } else {
      console.log("errror upcoming job --->", result.payload);
    }
  };

  const onPressItem = () => {
    navigation.navigate(Route.navPackageDetails);
  };

  const onEndReached = () => {
    if (page <= totalPage && loading !== LoadingState.CREATE) {
      getUpcommingData(10, page);
    }
  };

  return (
    <View style={style.scrollCont}>
      <PackageList
        isCompleted={false}
        onPress={onPressItem}
        data={upComingData}
        isLoading={loading && loading === LoadingState.CREATE}
        onEndReached={onEndReached}
        onPressRating={() => {}}
      />
    </View>
  );
};

export default UpcommingPackages;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  scrollCont: {
    flex: 1,
    backgroundColor: theme.colors?.background,
  },
}));
