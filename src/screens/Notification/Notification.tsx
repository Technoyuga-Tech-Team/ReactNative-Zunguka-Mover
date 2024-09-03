import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationListing from "../../components/Notification/NotificationListing";
import CustomHeader from "../../components/ui/CustomHeader";
import { BASE_URL, secureStoreKeys } from "../../constant";
import { API } from "../../constant/apiEndpoints";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSaveNotificationCount } from "../../store/settings/settings.slice";
import { ThemeProps } from "../../types/global.types";
import { HomeNavigationProps } from "../../types/navigation";
import { GetNotificationDataList } from "../../types/notification.types";
import { getData } from "../../utils/asyncStorage";

const Notification: React.FC<HomeNavigationProps<Route.navNotification>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(true);
  const [notifications, setNotifications] = useState<GetNotificationDataList[]>(
    []
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(setSaveNotificationCount(0));
      getNotifications(10, 1);
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

  return (
    <View style={style.container}>
      <CustomHeader title="Notification" />
      <NotificationListing
        notificationData={notifications}
        notificationLoading={loading}
        onEndReached={onEndReached}
        loadMoreLoading={loadMoreLoading}
      />
    </View>
  );
};

export default Notification;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
  },
  txtHeaderTitle: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
    lineHeight: 24,
    textAlign: "center",
    marginVertical: 20,
  },
}));
