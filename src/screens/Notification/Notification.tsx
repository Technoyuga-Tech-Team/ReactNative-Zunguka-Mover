import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationListing from "../../components/Notification/NotificationListing";
import CustomHeader from "../../components/ui/CustomHeader";
import { BASE_URL, secureStoreKeys } from "../../constant";
import { API } from "../../constant/apiEndpoints";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  markAllAsRead,
  readUnreadNotification,
} from "../../store/Notification/notification.thunk";
import { setTotalUnreadNotificationCount } from "../../store/settings/settings.slice";
import { ThemeProps } from "../../types/global.types";
import { HomeNavigationProps } from "../../types/navigation";
import { GetNotificationDataList } from "../../types/notification.types";
import { getData } from "../../utils/asyncStorage";
import Scale from "../../utils/Scale";

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

  const [unreadNotification, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    dispatch(setTotalUnreadNotificationCount(unreadNotification));
  }, [unreadNotification]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getNotifications(10, 1);
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

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
        console.log(
          "data?.data?.unread_notifications===",
          typeof data?.data?.unread_notifications
        );
        setUnreadNotificationCount(data?.data?.unread_notifications);
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

  const onPressItem = async (item: GetNotificationDataList) => {
    console.log("item - - -", item);
    if (item.is_read == 0) {
      let data = [...notifications];
      data.map((ele) => {
        if (ele.id == item.id) {
          return (ele.is_read = 1);
        }
      });
      setNotifications(data);
      const result = await dispatch(
        readUnreadNotification({ notification_id: `${item.id}` })
      );
      if (readUnreadNotification.fulfilled.match(result)) {
        if (result.payload.status == 1) {
          setUnreadNotificationCount(unreadNotification - 1);
        }
      } else {
        console.log("errror getMyEarningData --->", result.payload);
      }
    }

    console.log("item - - -", item);
    if (item.type == "new_message") {
      // navigate to Search screen
      navigation.navigate(Route.navChatroom, {
        product_id: null,
        receiver_id: item?.reference_id,
      });
    } else if (item.type == "new_rating") {
      navigation.navigate(Route.navReviewAndRating, {
        rating_id: item.rating_id,
      });
    } else if (item.type == "approve_request") {
      navigation.navigate(Route.navPayoutHistory);
    }
  };

  const onPressMarkAllAsRead = async () => {
    try {
      const result = await dispatch(markAllAsRead({ is_alert: 0 }));
      if (markAllAsRead.fulfilled.match(result)) {
        if (result.payload.status == 1) {
          console.log("markAllAsRead result.payload", result.payload);

          let data = [...notifications];
          data.map((ele) => {
            return (ele.is_read = 1);
          });
          setNotifications(data);
          getNotifications(10, 1);
          setUnreadNotificationCount(0);
        }
      } else {
        console.log("errror markAllAsRead --->", result.payload);
      }
    } catch (error) {
      console.log("catch error markAllAsRead --->", error);
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader title="Steps and Statuses" isBackVisible={false} />
      <View style={{ flex: 1 }}>
        {notifications?.length > 0 && (
          <TouchableOpacity
            disabled={unreadNotification == 0}
            onPress={onPressMarkAllAsRead}
            style={[
              style.btnMarkCont,
              {
                backgroundColor:
                  unreadNotification == 0
                    ? theme?.colors?.unselectedIconColor
                    : theme?.colors?.blue,
              },
            ]}
          >
            <Text style={style.txtMark}>Mark all as read</Text>
          </TouchableOpacity>
        )}
        <NotificationListing
          notificationData={notifications}
          notificationLoading={loading}
          onEndReached={onEndReached}
          loadMoreLoading={loadMoreLoading}
          onPressItem={onPressItem}
        />
      </View>
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
  btnMarkCont: {
    height: Scale(30),
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme?.colors?.blue,
    // backgroundColor: "red",
    alignSelf: "flex-end",
    borderRadius: 4,
    marginRight: 10,
    marginVertical: 5,
  },
  txtMark: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.white,
  },
}));
