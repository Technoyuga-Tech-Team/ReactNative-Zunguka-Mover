import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GetNotificationDataList } from "../../types/notification.types";
import NoDataFound from "../ui/NoDataFound";
import NotificationItem from "./NotificationItem";

interface NotificationDataProps {
  notificationData: GetNotificationDataList[];
  notificationLoading: boolean;
  onEndReached: () => void;
  loadMoreLoading?: boolean;
}

const NotificationListing: React.FC<NotificationDataProps> = ({
  notificationData,
  notificationLoading,
  onEndReached,
  loadMoreLoading,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: GetNotificationDataList }) => {
    return <NotificationItem item={item} />;
  };

  return (
    <>
      {notificationData?.length > 0 ? (
        <FlatList
          data={notificationData}
          keyExtractor={(_item, index) => index.toString()}
          contentContainerStyle={style.container}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            loadMoreLoading && (
              <ActivityIndicator color={theme?.colors?.primary} />
            )
          }
        />
      ) : (
        <NoDataFound title={"No data found!"} isLoading={notificationLoading} />
      )}
    </>
  );
};

export default NotificationListing;

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  noDataCont: { flex: 1, alignItems: "center", justifyContent: "center" },
  txtNoData: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
  },
}));
