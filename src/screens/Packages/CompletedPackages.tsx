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

const CompletedPackages: React.FC<
  HomeNavigationProps<Route.navCompletedPackages>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectPackageStatusLoading);

  const [compeltedData, setCompeltedData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      setCompeltedData([]);
      getCompletedData(10, 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getCompletedData = async (limit: number, offset: number) => {
    const result = await dispatch(
      moverPackageStatusDetails({
        status: "endjob",
        limit,
        offset,
      })
    );
    if (moverPackageStatusDetails.fulfilled.match(result)) {
      console.log("data completed job --->", result.payload);
      if (result.payload.status == 1) {
        setCompeltedData([...compeltedData, ...result.payload.data.data]);
        setTotalPage(result.payload.data.totalPages);
        setPage(page + 1);
      }
    } else {
      console.log("errror completed job --->", result.payload);
    }
  };

  const onPressItem = (item: any) => {
    navigation.navigate(Route.navDeliveryDetails1, {
      package_details_id: item.id,
      from: "mover",
    });
  };

  const onEndReached = () => {
    if (page <= totalPage && loading !== LoadingState.CREATE) {
      getCompletedData(10, page);
    }
  };

  console.log("compeltedData - - ", JSON.stringify(compeltedData));

  return (
    <View style={style.scrollCont}>
      <PackageList
        isCompleted={true}
        onPress={onPressItem}
        isLoading={loading && loading === LoadingState.CREATE}
        data={compeltedData}
        onEndReached={onEndReached}
        isFromMover={false}
        onPressRating={() => {}}
      />
    </View>
  );
};

export default CompletedPackages;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  scrollCont: {
    flex: 1,
    backgroundColor: theme.colors?.background,
  },
}));
