import notifee from "@notifee/react-native";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectUserData } from "../../store/settings/settings.selectors";
import { ThemeProps } from "../../types/global.types";
import { HomeNavigationProps } from "../../types/navigation";
import { getData } from "../../utils/asyncStorage";
import { Route } from "../../constant/navigationConstants";
import { setSaveNotificationCount } from "../../store/settings/settings.slice";
import { BASE_URL, HAS_NOTCH, secureStoreKeys } from "../../constant";
import { API } from "../../constant/apiEndpoints";
import CustomHeader from "../../components/ui/CustomHeader";
import { GetNotificationDataList } from "../../types/notification.types";
import NotificationListing from "../../components/Notification/NotificationListing";

const Inbox: React.FC<HomeNavigationProps<Route.navInbox>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUserData);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(true);
  const [notifications, setNotifications] = useState<GetNotificationDataList[]>(
    []
  );

  useEffect(() => {
    notifee.cancelDisplayedNotifications();
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(setSaveNotificationCount(0));
      // getNotifications(10, 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getNotifications = async (limit: number, page: number) => {
    const token = await getData(secureStoreKeys.JWT_TOKEN);
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}${API.GET_NOTIFICATION}/${limit}/${page}`,
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
        setNotifications([...notifications, ...data?.data?.data]);
        setTotalPage(data?.data?.totalPages);
        setPage(page + 1);
        setLoadMoreLoading(false);
      } else {
        setLoading(false);
        setLoadMoreLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setLoadMoreLoading(false);
      console.error(error);
    }
  };

  const onEndReached = () => {
    if (page <= totalPage && !loading) {
      setLoadMoreLoading(true);
      getNotifications(10, page);
    }
  };

  const isMover = userData?.type === "mover";

  return (
    <View style={style.container}>
      <CustomHeader title="Inbox" isBackVisible={false} />
      <NotificationListing
        notificationData={notifications}
        notificationLoading={loading}
        onEndReached={onEndReached}
        loadMoreLoading={loadMoreLoading}
      />
    </View>
  );
};

export default Inbox;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    paddingBottom:
      Platform.OS === "ios"
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
  },
}));
