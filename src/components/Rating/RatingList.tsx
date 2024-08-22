import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RatingItemCont from "./RatingItemCont";

interface RatingListProps {
  ratingData: any;
  onReachedEnd: () => void;
  onEndReachLoading?: boolean;
}

const RatingList: React.FC<RatingListProps> = ({
  ratingData,
  onReachedEnd,
  onEndReachLoading,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: any }) => {
    return <RatingItemCont item={item} />;
  };
  const ItemSeparator = () => {
    return <View style={style.border} />;
  };

  return (
    <FlatList
      data={ratingData}
      keyExtractor={(_item, index) => index.toString()}
      contentContainerStyle={style.container}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <ItemSeparator />}
      renderItem={renderItem}
      onMomentumScrollEnd={onReachedEnd}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        onEndReachLoading && (
          <ActivityIndicator color={theme?.colors?.primary} />
        )
      }
    />
  );
};

export default RatingList;

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors?.background,
  },
  border: {
    height: 1,
    backgroundColor: "#F5F5F5",
    width: "100%",
    marginVertical: 10,
  },
}));
