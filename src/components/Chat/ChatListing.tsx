import React from "react";
import { ActivityIndicator, FlatList, RefreshControlProps } from "react-native";
import { ChatDataList } from "../../types/chat.types";
import ChatBlock from "./ChatBlock";
import { useTheme } from "react-native-elements";

interface ChatListingProps {
  chatdata: ChatDataList[];
  onPress: (receiver_id: string, product_id: string) => void;
  onEndReached: () => void;
  loadMoreLoading?: boolean;
  refreshControl: React.ReactElement<RefreshControlProps>;
}

const ChatListing: React.FC<ChatListingProps> = ({
  chatdata,
  onPress,
  onEndReached,
  loadMoreLoading,
  refreshControl,
}) => {
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: ChatDataList }) => {
    return (
      <ChatBlock
        item={item}
        onPress={() => onPress(`${item?.user_id}`, item.item_id)}
      />
    );
  };

  return (
    <FlatList
      data={chatdata}
      keyExtractor={(_item, index) => index.toString()}
      refreshControl={refreshControl}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() =>
        loadMoreLoading && <ActivityIndicator color={theme?.colors?.primary} />
      }
    />
  );
};

export default ChatListing;
