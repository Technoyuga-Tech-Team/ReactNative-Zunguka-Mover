import React, { useEffect, useState } from "react";
import { RefreshControl, StatusBar, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeNavigationProps } from "../../types/navigation";
import { Route } from "../../constant/navigationConstants";
import { getData } from "../../utils/asyncStorage";
import { BASE_URL, secureStoreKeys } from "../../constant";
import { API } from "../../constant/apiEndpoints";
import CustomHeader from "../../components/ui/CustomHeader";
import NoDataFound from "../../components/ui/NoDataFound";
import { ThemeProps } from "../../types/global.types";
import { ChatDataList } from "../../types/chat.types";
import ChatListing from "../../components/Chat/ChatListing";

const Messaging: React.FC<HomeNavigationProps<Route.navMessaging>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [chatData, setChatData] = useState<ChatDataList[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllMessages(10, 0, true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getAllMessages = async (
    limit: number,
    page: number,
    refresh: boolean
  ) => {
    const token = await getData(secureStoreKeys.JWT_TOKEN);
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}${API.GET_ALL_CHATS_LIST}/${limit}/${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Handle the fetched data here
      if (data.status === 1) {
        setLoading(false);
        if (data && data?.data?.list.length > 0) {
          let total_data = [...chatData, ...data?.data?.list];
          // const uniqueChat = _.uniqBy(total_data, "id");
          const groupedData: ChatDataList[] = total_data.reduce((acc, curr) => {
            const key = curr.username;
            if (!acc.hasOwnProperty(key)) {
              acc[key] = curr;
            } else if (curr.created_at > acc[key].created_at) {
              acc[key] = curr;
            }
            return acc;
          }, {});

          // Convert the grouped object to an array
          const latestData = Object.values(groupedData);
          console.log("latestData = = = ", latestData);

          setChatData(latestData);
          setTotalPage(data?.data?.totalPages);
          setPage(page + 1);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onEndReached = () => {
    if (page <= totalPage && !loading) {
      getAllMessages(10, page, false);
    }
  };

  const onPress = (receiver_id: string, product_id: string) => {
    navigation.navigate(Route.navChatroom, {
      receiver_id,
      product_id: product_id,
    });
  };

  const onRefresh = () => {
    getAllMessages(10, 0, true);
  };

  return (
    <View style={style.container}>
      <StatusBar
        backgroundColor={theme.colors?.white}
        barStyle={"dark-content"}
      />
      <CustomHeader title="Messaging" />
      {chatData?.length > 0 ? (
        <ChatListing
          chatdata={chatData}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          onPress={onPress}
          onEndReached={onEndReached}
          loadMoreLoading={loadMoreLoading}
        />
      ) : (
        <NoDataFound title={"No data found!"} isLoading={loading} />
      )}
    </View>
  );
};

export default Messaging;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
}));
